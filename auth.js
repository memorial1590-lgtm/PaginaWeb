/**
 * Huellitas — Autenticación, solicitudes de publicación y panel de administración
 * ------------------------------------------------------------------------------
 * Incluye:
 *  - Registro e inicio de sesión de clientes (contraseñas guardadas con hash SHA-256).
 *  - Envío de solicitudes de publicación de mascotas.
 *  - Panel del administrador (atajo Ctrl + 8) para aprobar/rechazar solicitudes,
 *    agregar mascotas directamente y ver los usuarios registrados.
 *
 * Los datos se guardan en localStorage del navegador.
 *
 * ⚠️ IMPORTANTE: esta es una autenticación del lado del cliente, pensada para
 * una demo o trabajo académico. Sirve para que todo el flujo funcione, pero NO
 * es segura para producción: las credenciales del administrador están en este
 * archivo y cualquiera con conocimientos puede leerlas o editar el localStorage.
 * Para producción se debe mover la autenticación a un servidor (Node/Express +
 * base de datos) con contraseñas cifradas y sesiones firmadas.
 */

const HZ_KEYS = {
  users: 'huellitas_users',
  session: 'huellitas_session',
  requests: 'huellitas_requests'
};

/* ------------------------------------------------------------------ */
/* Credenciales del administrador — cámbialas aquí si lo necesitas     */
/* ------------------------------------------------------------------ */
const HZ_ADMIN = {
  email: 'andyrojascei@gmail.com',
  password: 'WilderRojas',
  name: 'Andy Rojas'
};

const HZ_SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 días

const HZ_SPECIES = {
  perro: { label: 'Perro', icon: '🐶' },
  gato: { label: 'Gato', icon: '🐱' },
  conejo: { label: 'Conejo', icon: '🐰' },
  aves: { label: 'Ave', icon: '🐦' },
  'pequeños animales': { label: 'Pequeño animal', icon: '🐹' },
  otros: { label: 'Otros', icon: '🐾' }
};

const HZ_STATUS = {
  pendiente: { label: 'En revisión', className: 'status-pendiente' },
  aprobada: { label: 'Publicada', className: 'status-aprobada' },
  rechazada: { label: 'Rechazada', className: 'status-rechazada' },
  retirada: { label: 'Retirada', className: 'status-rechazada' }
};

class HuellitasAuth {
  constructor() {
    this.session = this.loadSession();
    this.accountMode = 'login';
    this.accountIntent = null;
    this.adminTab = 'solicitudes';

    this.cacheDOM();
    this.bindEvents();
    this.refreshAccountButton();
    this.refreshAdminBadge();
  }

  /* ============================== DOM ============================== */

  cacheDOM() {
    this.accountModal = document.getElementById('account-modal');
    this.loginForm = document.getElementById('login-form');
    this.registerForm = document.getElementById('register-form');
    this.accountPanel = document.getElementById('account-panel');
    this.accountTabs = document.getElementById('account-tabs');

    this.adminLoginModal = document.getElementById('admin-login-modal');
    this.adminLoginForm = document.getElementById('admin-login-form');
    this.adminLoginError = document.getElementById('admin-login-error');
    this.adminPanelModal = document.getElementById('admin-panel-modal');
    this.adminContent = document.getElementById('admin-content');
  }

  bindEvents() {
    // ---- Atajo secreto del administrador: Ctrl + 8 ----
    document.addEventListener('keydown', (event) => {
      const isCtrl = event.ctrlKey || event.metaKey;
      const isKey8 = event.key === '8' || event.code === 'Digit8' || event.code === 'Numpad8';
      if (isCtrl && isKey8) {
        event.preventDefault();
        this.openAdminAccess();
      }
    });

    // ---- Botón de cuenta del header ----
    document.getElementById('account-btn')?.addEventListener('click', () => this.openAccountModal());

    // ---- Pestañas login / registro ----
    document.querySelectorAll('[data-auth-tab]').forEach((btn) => {
      btn.addEventListener('click', () => this.setAccountMode(btn.dataset.authTab));
    });

    // ---- Formularios de cuenta ----
    this.loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin(this.loginForm);
    });

    this.registerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister(this.registerForm);
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());

    // ---- Login del administrador ----
    this.adminLoginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAdminLogin(this.adminLoginForm);
    });

    document.getElementById('admin-badge-btn')?.addEventListener('click', () => this.openAdminPanel());
    document.getElementById('admin-logout-btn')?.addEventListener('click', () => this.logout());

    // ---- Pestañas del panel ----
    document.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.addEventListener('click', () => this.setAdminTab(btn.dataset.adminTab));
    });

    // ---- Acciones del panel (delegación de eventos) ----
    this.adminContent?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      this.handleAdminAction(btn.dataset.action, btn.dataset.id);
    });

    // ---- Formulario "Agregar mascota" del panel ----
    this.adminContent?.addEventListener('submit', (e) => {
      if (e.target && e.target.id === 'admin-add-form') {
        e.preventDefault();
        this.handleAdminAddPet(e.target);
      }
    });
  }

  /* ============================ ALMACENAMIENTO ============================ */

  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('Huellitas: no se pudo leer', key, error);
      return fallback;
    }
  }

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Huellitas: no se pudo guardar', key, error);
      return false;
    }
  }

  getUsers() {
    return this.read(HZ_KEYS.users, []);
  }

  setUsers(users) {
    this.write(HZ_KEYS.users, users);
  }

  getRequests() {
    return this.read(HZ_KEYS.requests, []);
  }

  setRequests(requests) {
    this.write(HZ_KEYS.requests, requests);
  }

  loadSession() {
    const session = this.read(HZ_KEYS.session, null);
    if (!session) return null;
    if (!session.at || Date.now() - session.at > HZ_SESSION_TTL) {
      try {
        localStorage.removeItem(HZ_KEYS.session);
      } catch (error) {
        /* ignore */
      }
      return null;
    }
    return session;
  }

  saveSession() {
    this.write(HZ_KEYS.session, this.session);
  }

  /* ============================== UTILIDADES ============================== */

  /**
   * Hash de la contraseña con SHA-256 (Web Crypto).
   * Si el navegador no lo permite (por ejemplo al abrir el archivo con file://),
   * se usa un hash alternativo para que la demo siga funcionando.
   */
  hashPassword(password) {
    const text = 'huellitas::' + String(password);

    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      return window.crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(text))
        .then((buffer) =>
          Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('')
        );
    }

    let h1 = 0x811c9dc5;
    let h2 = 0x1000193;
    for (let i = 0; i < text.length; i += 1) {
      h1 = ((h1 ^ text.charCodeAt(i)) * 16777619) >>> 0;
      h2 = (h2 + text.charCodeAt(i) * (i + 7)) >>> 0;
    }
    return Promise.resolve('fb' + h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0'));
  }

  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[char];
    });
  }

  /** Quita etiquetas HTML y limita el largo de lo que escribe el usuario. */
  cleanText(value, max = 400) {
    return String(value ?? '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, max);
  }

  initials(name) {
    const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return '👤';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  formatDate(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toast(message) {
    if (window.huellitas?.showToast) {
      window.huellitas.showToast(message);
    }
  }

  showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
  }

  hideError(element) {
    if (!element) return;
    element.textContent = '';
    element.classList.add('hidden');
  }

  setLoading(button, isLoading, loadingText = 'Procesando…') {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = loadingText;
      button.disabled = true;
      button.classList.add('opacity-70', 'cursor-not-allowed');
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.classList.remove('opacity-70', 'cursor-not-allowed');
    }
  }

  /* ============================== SESIÓN ============================== */

  get isAdmin() {
    return this.session?.role === 'admin';
  }

  isLoggedIn() {
    return Boolean(this.session);
  }

  async register({ name, email, password, password2, phone }) {
    const cleanName = this.cleanText(name, 60);
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (cleanName.length < 3) return { ok: false, error: 'Escribe tu nombre completo.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      return { ok: false, error: 'El correo electrónico no es válido.' };
    }
    if (cleanEmail === HZ_ADMIN.email) {
      return { ok: false, error: 'Ese correo está reservado para la administración.' };
    }
    if (String(password || '').length < 8) {
      return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    if (password !== password2) {
      return { ok: false, error: 'Las contraseñas no coinciden.' };
    }

    const users = this.getUsers();
    if (users.some((user) => user.email === cleanEmail)) {
      return { ok: false, error: 'Ya existe una cuenta registrada con este correo.' };
    }

    const user = {
      id: 'u-' + Date.now().toString(36),
      name: cleanName,
      email: cleanEmail,
      phone: this.cleanText(phone, 20),
      passHash: await this.hashPassword(password),
      role: 'cliente',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.setUsers(users);

    this.session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: 'cliente',
      at: Date.now()
    };
    this.saveSession();

    return { ok: true, user };
  }

  async login({ email, password }) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const pass = String(password || '');

    if (!cleanEmail || !pass) {
      return { ok: false, error: 'Completa tu correo y tu contraseña.' };
    }

    // Administrador
    if (cleanEmail === HZ_ADMIN.email) {
      if (pass === HZ_ADMIN.password) {
        this.session = {
          userId: 'admin',
          name: HZ_ADMIN.name,
          email: HZ_ADMIN.email,
          role: 'admin',
          at: Date.now()
        };
        this.saveSession();
        return { ok: true, admin: true, user: this.session };
      }
      return { ok: false, error: 'La contraseña del administrador es incorrecta.' };
    }

    // Clientes
    const user = this.getUsers().find((item) => item.email === cleanEmail);
    if (!user) {
      return { ok: false, error: 'No encontramos una cuenta con ese correo.' };
    }

    const hash = await this.hashPassword(pass);
    if (hash !== user.passHash) {
      return { ok: false, error: 'La contraseña es incorrecta.' };
    }

    this.session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: 'cliente',
      at: Date.now()
    };
    this.saveSession();

    return { ok: true, user: this.session };
  }

  logout() {
    this.session = null;
    try {
      localStorage.removeItem(HZ_KEYS.session);
    } catch (error) {
      /* ignore */
    }
    this.refreshAccountButton();
    this.refreshAdminBadge();
    window.huellitas?.closeAllModals();
    this.toast('👋 Sesión cerrada. ¡Vuelve pronto!');
  }

  /* ============================== SOLICITUDES ============================== */

  addRequest(pet) {
    const request = {
      id: 'req-' + Date.now().toString(36),
      pet,
      status: 'pendiente',
      applicant: {
        id: this.session?.userId || null,
        name: this.session?.name || 'Visitante',
        email: this.session?.email || ''
      },
      createdAt: new Date().toISOString(),
      reviewedAt: null
    };

    const requests = this.getRequests();
    requests.unshift(request);
    this.setRequests(requests);
    this.refreshAdminBadge();

    return request;
  }

  getRequestsByUser(userId) {
    return this.getRequests().filter((request) => request.applicant.id === userId);
  }

  updateRequest(id, changes) {
    const requests = this.getRequests();
    const index = requests.findIndex((request) => request.id === id);
    if (index === -1) return null;
    requests[index] = { ...requests[index], ...changes };
    this.setRequests(requests);
    return requests[index];
  }

  approveRequest(id) {
    const request = this.getRequests().find((item) => item.id === id);
    if (!request) return false;

    const published = window.huellitas?.addApprovedPet({ ...request.pet });
    if (published === false) {
      this.toast('⚠️ Esta mascota ya está publicada en el catálogo.');
      return false;
    }

    this.updateRequest(id, { status: 'aprobada', reviewedAt: new Date().toISOString() });
    this.refreshAdminBadge();
    this.renderAdminPanel();
    this.toast(`✅ "${request.pet.name}" fue aprobada y ya es visible en el catálogo.`);
    return true;
  }

  rejectRequest(id) {
    const request = this.getRequests().find((item) => item.id === id);
    if (!request) return false;

    this.updateRequest(id, { status: 'rechazada', reviewedAt: new Date().toISOString() });
    this.refreshAdminBadge();
    this.renderAdminPanel();
    this.toast(`🚫 La solicitud de "${request.pet.name}" fue rechazada.`);
    return true;
  }

  retireRequest(id) {
    const request = this.getRequests().find((item) => item.id === id);
    if (!request) return false;

    window.huellitas?.removeApprovedPet(request.pet.id);
    this.updateRequest(id, { status: 'retirada', reviewedAt: new Date().toISOString() });
    this.refreshAdminBadge();
    this.renderAdminPanel();
    this.toast(`🗑️ "${request.pet.name}" fue retirada del catálogo.`);
    return true;
  }

  /* ============================== UI: CUENTA ============================== */

  openAccountModal(mode = 'login', intent = null) {
    this.accountIntent = intent;

    if (this.isLoggedIn()) {
      this.showAccountPanel();
    } else {
      this.setAccountMode(mode);
    }

    window.huellitas?.openModal(this.accountModal);
  }

  setAccountMode(mode) {
    this.accountMode = mode === 'register' ? 'register' : 'login';

    if (this.accountTabs) this.accountTabs.classList.remove('hidden');
    this.accountPanel?.classList.add('hidden');

    const isLogin = this.accountMode === 'login';
    this.loginForm?.classList.toggle('hidden', !isLogin);
    this.registerForm?.classList.toggle('hidden', isLogin);

    this.loginForm?.querySelector('.auth-error') &&
      this.hideError(this.loginForm.querySelector('.auth-error'));
    this.registerForm?.querySelector('.auth-error') &&
      this.hideError(this.registerForm.querySelector('.auth-error'));

    document.querySelectorAll('[data-auth-tab]').forEach((btn) => {
      const active = btn.dataset.authTab === this.accountMode;
      btn.classList.toggle('auth-tab-active', active);
    });

    const title = document.getElementById('account-modal-title');
    const subtitle = document.getElementById('account-modal-subtitle');
    if (title) title.textContent = isLogin ? 'Iniciar sesión' : 'Crear una cuenta';
    if (subtitle) {
      subtitle.textContent =
        this.accountIntent === 'publish'
          ? 'Necesitas una cuenta para publicar una mascota'
          : isLogin
            ? 'Entra para gestionar tus publicaciones'
            : 'Regístrate gratis en menos de un minuto';
    }
  }

  showAccountPanel() {
    this.accountTabs?.classList.add('hidden');
    this.loginForm?.classList.add('hidden');
    this.registerForm?.classList.add('hidden');
    this.accountPanel?.classList.remove('hidden');

    const title = document.getElementById('account-modal-title');
    const subtitle = document.getElementById('account-modal-subtitle');
    if (title) title.textContent = 'Mi cuenta';
    if (subtitle) subtitle.textContent = this.isAdmin ? 'Sesión de administrador' : 'Panel de usuario';

    const name = this.session?.name || 'Usuario';
    const email = this.session?.email || '';

    const nameEl = document.getElementById('account-name');
    const emailEl = document.getElementById('account-email');
    const avatarEl = document.getElementById('account-avatar');

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    if (avatarEl) avatarEl.textContent = this.initials(name);

    this.renderMyRequests();
  }

  renderMyRequests() {
    const container = document.getElementById('my-requests-list');
    if (!container) return;

    const requests = this.getRequestsByUser(this.session?.userId);

    if (requests.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center bg-stone-50 rounded-2xl border border-stone-200/70">
          <div class="text-2xl mb-2">🐾</div>
          <p class="text-xs font-bold text-gray-700">Aún no has publicado mascotas</p>
          <p class="text-[11px] text-gray-500 mt-1">Usa el botón “Publica tu mascota” para enviar tu primera solicitud.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = requests
      .map((request) => {
        const status = HZ_STATUS[request.status] || HZ_STATUS.pendiente;
        const pet = request.pet;
        return `
        <div class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-2xl">
          <img src="${this.escapeHtml(pet.image)}" alt="${this.escapeHtml(pet.name)}"
               class="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0"
               onerror="this.src='images/pastor-aleman.jpg'">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-bold text-sm text-gray-900 truncate">${this.escapeHtml(pet.name)}</p>
              <span class="status-badge ${status.className}">${status.label}</span>
            </div>
            <p class="text-[11px] text-gray-500 truncate">${this.escapeHtml(pet.breed)} · ${this.escapeHtml(pet.location)}</p>
            <p class="text-[10px] text-gray-400 mt-0.5">Enviada el ${this.formatDate(request.createdAt)}</p>
          </div>
        </div>
      `;
      })
      .join('');
  }

  refreshAccountButton() {
    const icon = document.getElementById('account-icon');
    const initialsEl = document.getElementById('account-initials');
    const button = document.getElementById('account-btn');
    if (!button) return;

    if (this.isLoggedIn()) {
      icon?.classList.add('hidden');
      if (initialsEl) {
        initialsEl.textContent = this.initials(this.session.name);
        initialsEl.classList.remove('hidden');
      }
      button.classList.add('bg-[#e8f5ee]', 'text-[#175338]', 'font-bold');
      button.title = `${this.session.name} (${this.session.role === 'admin' ? 'Administrador' : 'Cliente'})`;
    } else {
      icon?.classList.remove('hidden');
      initialsEl?.classList.add('hidden');
      button.classList.remove('bg-[#e8f5ee]', 'text-[#175338]', 'font-bold');
      button.title = 'Mi cuenta';
    }
  }

  refreshAdminBadge() {
    const badgeBtn = document.getElementById('admin-badge-btn');
    const pendingBadge = document.getElementById('admin-pending-badge');
    if (!badgeBtn) return;

    if (!this.isAdmin) {
      badgeBtn.classList.add('hidden');
      badgeBtn.classList.remove('flex');
      return;
    }

    badgeBtn.classList.remove('hidden');
    badgeBtn.classList.add('flex');

    const pending = this.getRequests().filter((request) => request.status === 'pendiente').length;
    if (pendingBadge) {
      pendingBadge.textContent = pending;
      pendingBadge.classList.toggle('hidden', pending === 0);
      pendingBadge.classList.toggle('flex', pending > 0);
    }
  }

  afterAuthSuccess() {
    this.refreshAccountButton();
    this.refreshAdminBadge();

    const shouldPublish = this.accountIntent === 'publish';
    this.accountIntent = null;

    if (shouldPublish) {
      window.huellitas?.closeAllModals();
      window.huellitas?.openPublishModal();
      return;
    }

    this.showAccountPanel();
  }

  async handleLogin(form) {
    const formData = new FormData(form);
    const errorEl = form.querySelector('.auth-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    this.hideError(errorEl);

    this.setLoading(submitBtn, true, 'Verificando…');
    const result = await this.login({
      email: formData.get('email'),
      password: formData.get('password')
    });
    this.setLoading(submitBtn, false);

    if (!result.ok) {
      this.showError(errorEl, result.error);
      return;
    }

    form.reset();
    this.toast(`👋 ¡Bienvenido, ${result.user.name}!`);
    this.afterAuthSuccess();
  }

  async handleRegister(form) {
    const formData = new FormData(form);
    const errorEl = form.querySelector('.auth-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    this.hideError(errorEl);

    this.setLoading(submitBtn, true, 'Creando cuenta…');
    const result = await this.register({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      password2: formData.get('password2')
    });
    this.setLoading(submitBtn, false);

    if (!result.ok) {
      this.showError(errorEl, result.error);
      return;
    }

    form.reset();
    this.toast(`🎉 ¡Cuenta creada! Bienvenido, ${result.user.name}.`);
    this.afterAuthSuccess();
  }

  /* ============================== UI: ADMIN ============================== */

  openAdminAccess() {
    if (this.isAdmin) {
      this.openAdminPanel();
      return;
    }

    this.adminLoginError?.classList.add('hidden');
    this.adminLoginForm?.reset();
    const emailInput = this.adminLoginForm?.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = HZ_ADMIN.email;

    window.huellitas?.openModal(this.adminLoginModal);
    this.adminLoginForm?.querySelector('input[name="password"]')?.focus();
  }

  async handleAdminLogin(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    this.hideError(this.adminLoginError);

    this.setLoading(submitBtn, true, 'Verificando…');
    const result = await this.login({
      email: formData.get('email'),
      password: formData.get('password')
    });
    this.setLoading(submitBtn, false);

    if (!result.ok || !result.admin) {
      this.showError(this.adminLoginError, result.error || 'Acceso denegado.');
      return;
    }

    form.reset();
    this.refreshAccountButton();
    this.refreshAdminBadge();
    this.openAdminPanel();
    this.toast('🔐 Sesión de administrador iniciada.');
  }

  openAdminPanel() {
    if (!this.isAdmin) {
      this.openAdminAccess();
      return;
    }

    const emailEl = document.getElementById('admin-session-email');
    if (emailEl) emailEl.textContent = this.session.email;

    this.setAdminTab(this.adminTab);
    window.huellitas?.openModal(this.adminPanelModal);
  }

  setAdminTab(tab) {
    this.adminTab = tab || 'solicitudes';

    document.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.classList.toggle('admin-tab-active', btn.dataset.adminTab === this.adminTab);
    });

    this.renderAdminPanel();
  }

  renderAdminPanel() {
    if (!this.adminContent) return;

    const requests = this.getRequests();
    const pending = requests.filter((request) => request.status === 'pendiente');
    const published = requests.filter((request) => request.status === 'aprobada');

    const statPending = document.getElementById('admin-stat-pending');
    const statPublished = document.getElementById('admin-stat-published');
    const statUsers = document.getElementById('admin-stat-users');

    if (statPending) statPending.textContent = pending.length;
    if (statPublished) statPublished.textContent = published.length;
    if (statUsers) statUsers.textContent = this.getUsers().length;

    const pendingTabBtn = document.querySelector('[data-admin-tab="solicitudes"]');
    if (pendingTabBtn) {
      pendingTabBtn.textContent = pending.length > 0 ? `Solicitudes (${pending.length})` : 'Solicitudes';
    }

    switch (this.adminTab) {
      case 'publicadas':
        this.adminContent.innerHTML = this.renderPublishedTab(published);
        break;
      case 'nueva':
        this.adminContent.innerHTML = this.renderAddPetForm();
        break;
      case 'usuarios':
        this.adminContent.innerHTML = this.renderUsersTab();
        break;
      case 'solicitudes':
      default:
        this.adminContent.innerHTML = this.renderPendingTab(pending);
        break;
    }
  }

  renderRequestCard(request, actionsHtml) {
    const pet = request.pet;
    const status = HZ_STATUS[request.status] || HZ_STATUS.pendiente;

    return `
      <div class="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4">
        <img src="${this.escapeHtml(pet.image)}" alt="${this.escapeHtml(pet.name)}"
             class="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover bg-stone-100 shrink-0"
             onerror="this.src='images/pastor-aleman.jpg'">

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="font-bold text-sm text-gray-900">${this.escapeHtml(pet.name)}</h4>
            <span class="status-badge ${status.className}">${status.label}</span>
          </div>
          <p class="text-[11px] font-semibold text-emerald-800 mt-0.5">${this.escapeHtml(pet.breed)} · ${this.escapeHtml(pet.speciesLabel)}</p>
          <p class="text-[11px] text-gray-500 mt-0.5">${this.escapeHtml(pet.age)} · ${this.escapeHtml(pet.gender)} · ${this.escapeHtml(pet.size)} · 📍 ${this.escapeHtml(pet.location)}</p>
          <p class="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">${this.escapeHtml(pet.description)}</p>
          <p class="text-[10px] text-gray-400 mt-2">
            Enviada por <strong class="text-gray-500">${this.escapeHtml(request.applicant.name)}</strong>
            (${this.escapeHtml(request.applicant.email || 'sin correo')}) · ${this.formatDate(request.createdAt)}
          </p>
          <div class="flex flex-wrap gap-2 mt-3">${actionsHtml}</div>
        </div>
      </div>
    `;
  }

  renderPendingTab(pending) {
    if (pending.length === 0) {
      return `
        <div class="py-14 text-center">
          <div class="w-16 h-16 mx-auto mb-3 bg-[#e8f5ee] text-[#175338] rounded-full flex items-center justify-center text-2xl">✅</div>
          <p class="font-bold text-gray-800">No hay solicitudes pendientes</p>
          <p class="text-xs text-gray-500 mt-1">Cuando un cliente publique una mascota, aparecerá aquí para tu revisión.</p>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        <p class="text-[11px] text-gray-500">Revisa la información y decide si la publicación pasa al catálogo público.</p>
        ${pending
          .map((request) =>
            this.renderRequestCard(
              request,
              `
              <button type="button" data-action="approve" data-id="${request.id}"
                class="px-3.5 py-2 bg-[#1b4d3e] hover:bg-[#143d31] text-white text-[11px] font-bold rounded-xl transition">
                ✓ Aprobar y publicar
              </button>
              <button type="button" data-action="reject" data-id="${request.id}"
                class="px-3.5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold rounded-xl transition">
                ✕ Rechazar
              </button>
            `
            )
          )
          .join('')}
      </div>
    `;
  }

  renderPublishedTab(published) {
    if (published.length === 0) {
      return `
        <div class="py-14 text-center">
          <div class="w-16 h-16 mx-auto mb-3 bg-stone-100 text-gray-400 rounded-full flex items-center justify-center text-2xl">🐾</div>
          <p class="font-bold text-gray-800">Todavía no has publicado mascotas</p>
          <p class="text-xs text-gray-500 mt-1">Aprueba una solicitud o usa la pestaña “+ Agregar mascota”.</p>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        ${published
          .map((request) =>
            this.renderRequestCard(
              request,
              `
              <button type="button" data-action="view" data-id="${request.pet.id}"
                class="px-3.5 py-2 bg-[#e8f5ee] text-[#175338] hover:bg-[#d5eddf] text-[11px] font-bold rounded-xl transition">
                Ver ficha
              </button>
              <button type="button" data-action="retire" data-id="${request.id}"
                class="px-3.5 py-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-[11px] font-bold rounded-xl transition">
                Quitar del catálogo
              </button>
            `
            )
          )
          .join('')}
      </div>
    `;
  }

  renderUsersTab() {
    const users = this.getUsers();

    if (users.length === 0) {
      return `
        <div class="py-14 text-center">
          <div class="w-16 h-16 mx-auto mb-3 bg-stone-100 text-gray-400 rounded-full flex items-center justify-center text-2xl">👥</div>
          <p class="font-bold text-gray-800">Aún no hay usuarios registrados</p>
          <p class="text-xs text-gray-500 mt-1">Los clientes aparecerán aquí cuando creen su cuenta.</p>
        </div>
      `;
    }

    const requests = this.getRequests();

    return `
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-stone-50 border-b border-gray-200">
            <tr class="text-[10px] uppercase tracking-wide text-gray-500">
              <th class="px-4 py-3 font-bold">Usuario</th>
              <th class="px-4 py-3 font-bold hidden sm:table-cell">Contacto</th>
              <th class="px-4 py-3 font-bold text-center">Solicitudes</th>
              <th class="px-4 py-3 font-bold hidden md:table-cell">Registro</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${users
              .map((user) => {
                const count = requests.filter((request) => request.applicant.id === user.id).length;
                return `
                <tr class="text-xs">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2.5">
                      <span class="w-8 h-8 rounded-full bg-[#e8f5ee] text-[#175338] flex items-center justify-center font-black text-[10px] shrink-0">${this.escapeHtml(this.initials(user.name))}</span>
                      <div class="min-w-0">
                        <p class="font-bold text-gray-900 truncate">${this.escapeHtml(user.name)}</p>
                        <p class="text-[10px] text-gray-500 truncate">${this.escapeHtml(user.email)}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-600 hidden sm:table-cell">${this.escapeHtml(user.phone || '—')}</td>
                  <td class="px-4 py-3 text-center font-bold text-gray-800">${count}</td>
                  <td class="px-4 py-3 text-[10px] text-gray-500 hidden md:table-cell">${this.formatDate(user.createdAt)}</td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderAddPetForm() {
    const options = Object.entries(HZ_SPECIES)
      .map(([value, data]) => `<option value="${value}">${data.icon} ${data.label}</option>`)
      .join('');

    return `
      <form id="admin-add-form" class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4" novalidate>
        <p class="text-[11px] text-gray-500">Lo que agregues aquí se publica <strong>de inmediato</strong> en el catálogo, sin pasar por revisión.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Nombre de la mascota *</label>
            <input name="name" type="text" required placeholder="Ej. Manchitas" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Especie *</label>
            <select name="species" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${options}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Raza</label>
            <input name="breed" type="text" placeholder="Mestizo" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Edad</label>
            <input name="age" type="text" placeholder="2 años" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Género</label>
            <select name="gender" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Tamaño</label>
            <select name="size" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano" selected>Mediano</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Ubicación *</label>
            <input name="location" type="text" required value="Huánuco, Perú" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">URL de la foto</label>
            <input name="imageUrl" type="text" placeholder="images/pastor-aleman.jpg" class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Descripción / Historia *</label>
          <textarea name="description" rows="3" required placeholder="Personalidad, rescate y cuidados..." class="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"></textarea>
        </div>

        <button type="submit" class="w-full sm:w-auto px-6 py-3 bg-[#1b4d3e] hover:bg-[#143d31] text-white rounded-xl font-bold text-xs shadow-md transition">
          Publicar en el catálogo
        </button>
      </form>
    `;
  }

  handleAdminAction(action, id) {
    if (!this.isAdmin) return;

    if (action === 'approve') {
      this.approveRequest(id);
    } else if (action === 'reject') {
      this.rejectRequest(id);
    } else if (action === 'retire') {
      this.retireRequest(id);
    } else if (action === 'view') {
      window.huellitas?.closeAllModals();
      window.huellitas?.openPetDetailsById(id);
    }
  }

  handleAdminAddPet(form) {
    if (!this.isAdmin) return;

    const formData = new FormData(form);
    const species = formData.get('species') || 'perro';
    const name = this.cleanText(formData.get('name'), 40) || 'Mascota';
    const size = formData.get('size') || 'Mediano';
    const imageUrl = this.cleanText(formData.get('imageUrl'), 300) || 'images/pastor-aleman.jpg';

    const pet = {
      id: 'custom-' + Date.now(),
      name,
      species,
      speciesLabel: HZ_SPECIES[species]?.label || 'Mascota',
      breed: this.cleanText(formData.get('breed'), 40) || 'Mestizo',
      age: this.cleanText(formData.get('age'), 20) || '1 año',
      gender: formData.get('gender') || 'Macho',
      size,
      weight: size === 'Grande' ? '25 kg' : size === 'Pequeño' ? '6 kg' : '15 kg',
      location: this.cleanText(formData.get('location'), 60) || 'Huánuco, Perú',
      description: this.cleanText(formData.get('description'), 400) || 'En búsqueda de una segunda oportunidad.',
      fullStory: this.cleanText(formData.get('description'), 600) || 'En búsqueda de una segunda oportunidad.',
      image: imageUrl,
      gallery: [imageUrl],
      tags: ['Publicado por el administrador', 'En adopción responsable'],
      medical: {
        vaccinated: true,
        neutered: true,
        dewormed: true,
        microchip: 'PE-' + Math.floor(10000 + Math.random() * 90000)
      },
      energy: 'Media',
      coatColor: 'Estándar'
    };

    // Se registra como solicitud ya aprobada para conservar el historial.
    const request = {
      id: 'req-' + Date.now().toString(36),
      pet,
      status: 'aprobada',
      applicant: { id: 'admin', name: this.session.name, email: this.session.email },
      createdAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString()
    };

    const requests = this.getRequests();
    requests.unshift(request);
    this.setRequests(requests);

    window.huellitas?.addApprovedPet(pet);

    form.reset();
    this.adminTab = 'publicadas';
    this.setAdminTab('publicadas');
    this.toast(`🐾 "${name}" fue publicada en el catálogo.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.huellitasAuth = new HuellitasAuth();
});
