/**
 * Huellitas - Pet Adoption Platform Application Logic
 * Exact 10 pets requested:
 * Perros: Pastor Alemán, Labrador, Pug, Gran Danés
 * Gatos: Mestizo / Criollo, Persa, Siamés
 * Otros: Cuy Inti, Conejo (blanco), Hámster americano
 */

const INITIAL_PETS = [
  // -------------------------------------------------------------
  // PERROS (Fotos reales de patas a cabeza con fondo blanco)
  // -------------------------------------------------------------
  {
    id: 'perro-pastor-aleman',
    name: 'Rex',
    species: 'perro',
    speciesLabel: 'Perro',
    breed: 'Pastor Alemán',
    age: '2 años',
    gender: 'Macho',
    size: 'Grande',
    weight: '32 kg',
    location: 'Huánuco, Perú',
    description: 'Pastor Alemán de línea clásica, noble, leal y muy protector. Con entrenamiento básico completo.',
    fullStory: 'Rex es un hermoso Pastor Alemán adulto de patas a cabeza con manto negro y fuego. Es extremadamente inteligente, obediente, cariñoso con su familia y siempre atento. Requiere actividad física diaria y un hogar con personas que valoren su fidelidad.',
    image: 'images/pastor-aleman.jpg',
    gallery: [
      'images/pastor-aleman.jpg',
      'images/gsd1.jpg'
    ],
    tags: ['Pastor Alemán', 'Obediente', 'Guardián', 'Inteligente', 'Fondo blanco'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-81023'
    },
    energy: 'Alta',
    coatColor: 'Negro y fuego'
  },
  {
    id: 'perro-labrador',
    name: 'Max',
    species: 'perro',
    speciesLabel: 'Perro',
    breed: 'Labrador',
    age: '1.5 años',
    gender: 'Macho',
    size: 'Grande',
    weight: '28 kg',
    location: 'Huánuco, Perú',
    description: 'Labrador dorado puro amor, alegre, juguetón y el mejor compañero para toda la familia.',
    fullStory: 'Max es un Labrador dorado de contextura atlética y pelaje brillante, fotografiado completo de patas a cabeza. Su cola nunca deja de moverse cuando saluda. Le apasiona jugar a buscar la pelota y convive en perfecta armonía con niños y otros perros.',
    image: 'images/labrador.jpg',
    gallery: [
      'images/labrador.jpg',
      'images/lab1.jpg'
    ],
    tags: ['Labrador', 'Excelente con niños', 'Juguetón', 'Muy sociable', 'Fondo blanco'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-92144'
    },
    energy: 'Alta',
    coatColor: 'Dorado / Miel'
  },
  {
    id: 'perro-pug',
    name: 'Milo',
    species: 'perro',
    speciesLabel: 'Perro',
    breed: 'Pug',
    age: '2 años',
    gender: 'Macho',
    size: 'Pequeño',
    weight: '8 kg',
    location: 'Huánuco, Perú',
    description: 'Pug leonado con máscara negra, chaparrito simpático, dormilón y super cariñoso para departamento.',
    fullStory: 'Milo es un carismático Pug leonado de cuerpo completo con su clásica cola enroscada y arrugas faciales tiernas. Es un perrito hogareño de bajo requerimiento físico, ideal para departamentos. Adora las siestas y la compañía humana.',
    image: 'images/pug.jpg',
    gallery: [
      'images/pug.jpg',
      'images/pug1.jpg'
    ],
    tags: ['Pug', 'Ideal departamento', 'Tranquilo', 'Cariñoso', 'Fondo blanco'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-73309'
    },
    energy: 'Baja',
    coatColor: 'Leonado con máscara negra'
  },
  {
    id: 'perro-gran-danes',
    name: 'Apolo',
    species: 'perro',
    speciesLabel: 'Perro',
    breed: 'Gran Danés',
    age: '3 años',
    gender: 'Macho',
    size: 'Gigante',
    weight: '56 kg',
    location: 'Huánuco, Perú',
    description: 'Gran Danés leonado imponente, un gigante noble y muy tranquilo con corazón dulce.',
    fullStory: 'Apolo es un majestuoso Gran Danés de porte esbelto y gran altura, fotografiado de patas a cabeza mostrando su elegante contextura. A pesar de su tamaño gigante, es sumamente sereno, camina con tranquilidad y es muy educado con su familia adoptiva.',
    image: 'images/gran-danes.jpg',
    gallery: [
      'images/gran-danes.jpg'
    ],
    tags: ['Gran Danés', 'Gigante noble', 'Elegante', 'Muy tranquilo'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-65521'
    },
    energy: 'Media-Baja',
    coatColor: 'Leonado con máscara oscura'
  },

  // -------------------------------------------------------------
  // GATOS (Fotos reales de cuerpo completo con fondo blanco)
  // -------------------------------------------------------------
  {
    id: 'gato-mestizo',
    name: 'Luna',
    species: 'gato',
    speciesLabel: 'Gato',
    breed: 'Mestizo / Criollo',
    age: '1 año',
    gender: 'Hembra',
    size: 'Pequeña',
    weight: '3.6 kg',
    location: 'Huánuco, Perú',
    description: 'Gatita atigrada criolla, limpia, cariñosa, saludable y super compañera.',
    fullStory: 'Luna es una hermosa gatita mestiza/criolla atigrada con ojos verdes brillantes, fotografiada de cuerpo entero sobre fondo blanco. Rescatada en Huánuco, ha demostrado ser muy inteligente, limpia con su arenero y ronroneadora profesional.',
    image: 'images/gato-mestizo.jpg',
    gallery: [
      'images/gato-mestizo.jpg',
      'images/cat_mestizo.jpg'
    ],
    tags: ['Mestizo / Criollo', 'Ronroneadora', 'Hogareña', 'Limpia', 'Fondo blanco'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-41098'
    },
    energy: 'Media',
    coatColor: 'Atigrado clásico'
  },
  {
    id: 'gato-persa',
    name: 'Copito',
    species: 'gato',
    speciesLabel: 'Gato',
    breed: 'Persa',
    age: '2 años',
    gender: 'Macho',
    size: 'Mediano',
    weight: '4.2 kg',
    location: 'Huánuco, Perú',
    description: 'Gato Persa de exuberante pelaje blanco sedoso, rostro chato y ojos ámbar serenos.',
    fullStory: 'Copito es un gato Persa de cuerpo completo con pelaje largo y denso sobre fondo blanco de estudio. Es la calma personificada: adora pasar las tardes descansando en cojines mullidos y disfruta los cepillados diarios de su manto.',
    image: 'images/gato-persa.jpg',
    gallery: [
      'images/gato-persa.jpg'
    ],
    tags: ['Persa', 'Ultra esponjoso', 'Sereno', 'Ojos ámbar', 'Fondo blanco'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-54219'
    },
    energy: 'Baja',
    coatColor: 'Blanco puro sedoso'
  },
  {
    id: 'gato-siames',
    name: 'Cleo',
    species: 'gato',
    speciesLabel: 'Gato',
    breed: 'Siamés',
    age: '1 año',
    gender: 'Hembra',
    size: 'Pequeña',
    weight: '3.4 kg',
    location: 'Huánuco, Perú',
    description: 'Elegante gata Siamesa con hipnóticos ojos azul zafiro y marcados puntos oscuros seal.',
    fullStory: 'Cleo es una distinguida gata Siamesa de porte esbelto, fotografiada de cuerpo entero sobre fondo blanco. Es comunicativa, muy apegada a sus cuidadores y tiene un pelaje corto y brillante con las características manchas en orejas, patas y cola.',
    image: 'images/gato-siames.jpg',
    gallery: [
      'images/gato-siames.jpg'
    ],
    tags: ['Siamés', 'Ojos azul zafiro', 'Curiosa', 'Muy comunicativa', 'Fondo blanco'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-31872'
    },
    energy: 'Media-Alta',
    coatColor: 'Crema con puntos seal'
  },

  // -------------------------------------------------------------
  // OTROS (Cuy Inti, Conejo blanco, Hámster americano)
  // -------------------------------------------------------------
  {
    id: 'otro-cuy-inti',
    name: 'Inti',
    species: 'otros',
    speciesLabel: 'Cuy',
    breed: 'Cuy Inti',
    age: '8 meses',
    gender: 'Macho',
    size: 'Pequeño',
    weight: '1.1 kg',
    location: 'Huánuco, Perú',
    description: 'Cuy de raza mejorada Inti, pelaje suave blanco y dorado-naranja, dócil y simpático.',
    fullStory: 'Inti es un auténtico cuy peruano de la raza Inti, con pelaje liso bicolor naranja y blanco de patas a cabeza. Es muy dócil, acostumbrado al contacto humano y emite alegres chilliditos al escuchar que le traen alfalfa fresca.',
    image: 'images/cuy-inti.jpg',
    gallery: [
      'images/cuy-inti.jpg',
      'images/cuy.jpg'
    ],
    tags: ['Cuy Inti', 'Raza peruana', 'Dócil', 'Vegetariano', 'Cuerpo completo'],
    medical: {
      vaccinated: true,
      neutered: false,
      dewormed: true,
      microchip: 'PE-19804'
    },
    energy: 'Tranquilo',
    coatColor: 'Naranja dorado y blanco'
  },
  {
    id: 'otro-conejo-blanco',
    name: 'Tambor',
    species: 'otros',
    speciesLabel: 'Conejo',
    breed: 'Conejo (blanco)',
    age: '1 año',
    gender: 'Macho',
    size: 'Pequeño',
    weight: '1.8 kg',
    location: 'Huánuco, Perú',
    description: 'Conejito completamente blanco de orejas erguidas, nariz movediza y carácter apacible.',
    fullStory: 'Tambor es un conejito blanco como la nieve, fotografiado de cuerpo entero. Es sumamente silencioso, limpio, usa su esquinero de heno y disfruta que le acaricien detrás de las orejas mientras descansa.',
    image: 'images/conejo-blanco.jpg',
    gallery: [
      'images/conejo-blanco.jpg'
    ],
    tags: ['Conejo (blanco)', 'Silencioso', 'Muy dócil', 'Blanco puro', 'Cuerpo completo'],
    medical: {
      vaccinated: true,
      neutered: true,
      dewormed: true,
      microchip: 'PE-28841'
    },
    energy: 'Tranquilo',
    coatColor: 'Blanco puro'
  },
  {
    id: 'otro-hamster-americano',
    name: 'Cheeks',
    species: 'otros',
    speciesLabel: 'Hámster',
    breed: 'Hámster americano',
    age: '6 meses',
    gender: 'Macho',
    size: 'Diminuto',
    weight: '0.14 kg',
    location: 'Huánuco, Perú',
    description: 'Hámster sirio/americano de cachetitos redondos, pelaje dorado y patitas rosadas.',
    fullStory: 'Cheeks es un simpático hámster americano dorado fotografiado de cuerpo entero sobre fondo claro. Es activo en su rueda por las noches, curioso y recibe gustoso pequeñas semillas o manzana de la mano.',
    image: 'images/hamster-americano.jpg',
    gallery: [
      'images/hamster-americano.jpg'
    ],
    tags: ['Hámster americano', 'Cachetón', 'Compañero pequeño', 'Dorado', 'Cuerpo completo'],
    medical: {
      vaccinated: true,
      neutered: false,
      dewormed: true,
      microchip: 'PE-09941'
    },
    energy: 'Activo',
    coatColor: 'Dorado con vientre blanco'
  }
];

class HuellitasApp {
  constructor() {
    this.pets = this.loadPets();
    this.favorites = this.loadFavorites();
    this.activeCategory = 'todos';
    this.searchQuery = '';
    this.selectedLocation = 'Todas las regiones';
    this.selectedType = 'Todos';
    this.selectedPet = null;

    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.renderPets();
    this.updateFavoritesCount();
  }

  cacheDOM() {
    this.petGrid = document.getElementById('pets-grid');
    this.searchQueryInput = document.getElementById('search-query');
    this.searchLocationSelect = document.getElementById('search-location');
    this.searchTypeSelect = document.getElementById('search-type');
    this.searchBtn = document.getElementById('search-btn');
    this.categoryBtns = document.querySelectorAll('.category-btn');
    this.favoritesCountBadge = document.getElementById('favorites-count');
    
    // Modals
    this.favoritesModal = document.getElementById('favorites-modal');
    this.petDetailsModal = document.getElementById('pet-details-modal');
    this.adoptionModal = document.getElementById('adoption-modal');
    this.publishModal = document.getElementById('publish-modal');
    this.howToAdoptModal = document.getElementById('how-to-adopt-modal');
    this.aboutModal = document.getElementById('about-modal');
    this.blogModal = document.getElementById('blog-modal');
    this.contactModal = document.getElementById('contact-modal');
    this.adoptionSuccessModal = document.getElementById('adoption-success-modal');

    // Details Modal elements
    this.galleryMainImg = document.getElementById('gallery-main-img');
    this.galleryThumbnails = document.getElementById('gallery-thumbnails');
  }

  bindEvents() {
    // Category pill buttons
    this.categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.categoryBtns.forEach((b) => b.classList.remove('active-category'));
        btn.classList.add('active-category');
        this.activeCategory = btn.dataset.category;
        this.renderPets();
      });
    });

    // Hero Search Button
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    if (this.searchQueryInput) {
      this.searchQueryInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') this.handleSearch();
      });
    }

    // Top Navigation Links
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.nav;
        this.handleNavigation(target);
      });
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeAllModals();
        }
      });
    });

    // Favorites Drawer Trigger
    const favBtn = document.getElementById('favorites-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => this.openFavoritesModal());
    }

    // Publica tu Mascota Trigger
    const publishBtn = document.getElementById('publish-pet-btn');
    if (publishBtn) {
      publishBtn.addEventListener('click', () => this.openPublishModal());
    }

    // Publish Pet Form Submit
    const publishForm = document.getElementById('publish-form');
    if (publishForm) {
      publishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePublishPet(publishForm);
      });
    }

    // Adoption Form Submit inside dedicated Adoption Apartado
    const adoptionForm = document.getElementById('adoption-form');
    if (adoptionForm) {
      adoptionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAdoptionSubmit(adoptionForm);
      });
    }

    // Details Modal "Quiero adoptarlo" buttons
    const modalBtnAdoptHeader = document.getElementById('modal-btn-adopt-header');
    if (modalBtnAdoptHeader) {
      modalBtnAdoptHeader.addEventListener('click', () => {
        if (this.selectedPet) {
          this.closeModal(this.petDetailsModal);
          this.openAdoptionModal(this.selectedPet);
        }
      });
    }

    const modalBtnAdoptBody = document.getElementById('modal-btn-adopt-body');
    if (modalBtnAdoptBody) {
      modalBtnAdoptBody.addEventListener('click', () => {
        if (this.selectedPet) {
          this.closeModal(this.petDetailsModal);
          this.openAdoptionModal(this.selectedPet);
        }
      });
    }
  }

  handleNavigation(navTarget) {
    if (navTarget === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navTarget === 'mascotas') {
      const section = document.getElementById('adopcion-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else if (navTarget === 'como-adoptar') {
      this.openModal(this.howToAdoptModal);
    } else if (navTarget === 'sobre-nosotros') {
      this.openModal(this.aboutModal);
    } else if (navTarget === 'blog') {
      this.openModal(this.blogModal);
    } else if (navTarget === 'contacto') {
      this.openModal(this.contactModal);
    }
  }

  handleSearch() {
    this.searchQuery = (this.searchQueryInput?.value || '').trim().toLowerCase();
    this.selectedLocation = this.searchLocationSelect?.value || 'Todas las regiones';
    this.selectedType = this.searchTypeSelect?.value || 'Todos';

    if (this.selectedType !== 'Todos') {
      const typeMap = {
        'Perros': 'perro',
        'Gatos': 'gato',
        'Otros': 'otros'
      };
      this.activeCategory = typeMap[this.selectedType] || 'todos';
      this.categoryBtns.forEach((btn) => {
        btn.classList.toggle('active-category', btn.dataset.category === this.activeCategory);
      });
    }

    const section = document.getElementById('adopcion-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }

    this.renderPets();
  }

  resetFilters() {
    this.activeCategory = 'todos';
    this.searchQuery = '';
    this.selectedLocation = 'Todas las regiones';
    this.selectedType = 'Todos';

    if (this.searchQueryInput) this.searchQueryInput.value = '';
    if (this.searchLocationSelect) this.searchLocationSelect.value = 'Todas las regiones';
    if (this.searchTypeSelect) this.searchTypeSelect.value = 'Todos';

    this.categoryBtns.forEach((btn) => {
      btn.classList.toggle('active-category', btn.dataset.category === 'todos');
    });

    this.renderPets();
  }

  renderPets() {
    if (!this.petGrid) return;

    const filtered = this.pets.filter((pet) => {
      // Category filter
      if (this.activeCategory !== 'todos' && pet.species !== this.activeCategory) {
        return false;
      }

      // Location filter
      if (this.selectedLocation !== 'Todas las regiones') {
        const loc = pet.location.toLowerCase();
        const searchLoc = this.selectedLocation.toLowerCase();
        if (!loc.includes(searchLoc)) {
          return false;
        }
      }

      // Search Query filter
      if (this.searchQuery) {
        const combined = `${pet.name} ${pet.breed} ${pet.description} ${pet.location} ${pet.tags.join(' ')}`.toLowerCase();
        if (!combined.includes(this.searchQuery)) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length === 0) {
      this.petGrid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center text-3xl">🐾</div>
          <h3 class="text-xl font-bold text-gray-800">No encontramos mascotas con ese filtro</h3>
          <p class="text-gray-500 mt-2">Intenta buscando por raza (Pastor Alemán, Labrador, Pug, Gran Danés, Mestizo/Criollo, Persa, Siamés, Cuy Inti...).</p>
          <button onclick="window.huellitas.resetFilters()" class="mt-4 px-6 py-2.5 bg-[#1b4d3e] text-white rounded-xl font-medium hover:bg-[#143d31] transition">
            Ver todas las mascotas
          </button>
        </div>
      `;
      return;
    }

    this.petGrid.innerHTML = filtered.map((pet) => this.createPetCardHTML(pet)).join('');

    // Attach click events on the rendered cards
    filtered.forEach((pet) => {
      const card = document.getElementById(`card-${pet.id}`);
      if (!card) return;

      const favBtn = card.querySelector('.btn-fav');
      if (favBtn) {
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFavorite(pet.id);
        });
      }

      // Button 1: "Quiero adoptarlo" -> Opens Apartado de Adopción
      const adoptBtn = card.querySelector('.btn-adopt');
      if (adoptBtn) {
        adoptBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openAdoptionModal(pet);
        });
      }

      // Button 2: "Ver detalles" -> Opens Pet Details with Photos
      const detailsBtn = card.querySelector('.btn-details');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openPetDetails(pet);
        });
      }

      const imgWrapper = card.querySelector('.card-img-wrapper');
      if (imgWrapper) {
        imgWrapper.addEventListener('click', () => {
          this.openPetDetails(pet);
        });
      }
    });
  }

  createPetCardHTML(pet) {
    const isFav = this.favorites.includes(pet.id);
    const heartSvg = isFav
      ? `<svg class="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
      : `<svg class="w-5 h-5 text-gray-500 hover:text-red-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`;

    return `
      <div id="card-${pet.id}" class="pet-card bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        <!-- Image Container: Clean White Background for Full-body Head-to-Paws display -->
        <div class="card-img-wrapper relative h-56 sm:h-60 w-full overflow-hidden bg-white border-b border-gray-100 cursor-pointer flex items-center justify-center p-2.5">
          <img src="${pet.image}" alt="${pet.name} - ${pet.breed}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy">
          
          <!-- Exact Breed Badge (Top-left) -->
          <span class="absolute top-3 left-3 bg-[#1b4d3e] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
            ${pet.breed}
          </span>

          <!-- Favorite Heart Button (Top-right) -->
          <button class="btn-fav absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform" title="Guardar favorito">
            ${heartSvg}
          </button>
        </div>

        <!-- Card Content -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Name & Breed Subtitle -->
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">${pet.name}</h3>
              <span class="text-xs font-bold text-emerald-800 bg-[#d9efe1] px-2.5 py-0.5 rounded-lg">${pet.speciesLabel}</span>
            </div>
            <p class="text-xs text-gray-500 font-medium mt-1">${pet.age} · ${pet.gender} · ${pet.size}</p>

            <!-- Location -->
            <div class="flex items-center text-xs text-gray-500 mt-2 gap-1">
              <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span>${pet.location}</span>
            </div>

            <!-- Description -->
            <p class="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
              ${pet.description}
            </p>
          </div>

          <!-- TWO BUTTONS: "Quiero adoptarlo" & "Ver detalles" -->
          <div class="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <!-- Button 1: Quiero adoptarlo (Abre apartado de adopción dedicado) -->
            <button class="btn-adopt w-full py-2.5 px-3 bg-[#1b4d3e] hover:bg-[#143d31] text-white text-xs font-bold rounded-xl transition duration-200 text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow">
              <span>Quiero adoptarlo</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>

            <!-- Button 2: Ver detalles (Galería de fotos y ficha completa) -->
            <button class="btn-details w-full py-2 px-3 bg-[#e8f5ee] hover:bg-[#d5eddf] text-[#175338] border border-[#bce1cb] text-xs font-bold rounded-xl transition duration-200 text-center flex items-center justify-center gap-1.5">
              <span>Ver detalles</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Opens "Ver detalles" with photo gallery and medical record
  openPetDetails(pet) {
    this.selectedPet = pet;

    document.getElementById('modal-pet-name').textContent = pet.name;
    document.getElementById('modal-pet-breed').textContent = pet.breed;
    document.getElementById('modal-pet-species-badge').textContent = pet.breed;
    document.getElementById('modal-pet-meta').textContent = `${pet.age} · ${pet.gender} · ${pet.size} (${pet.weight || 'Peso estándar'})`;
    document.getElementById('modal-pet-location').textContent = `📍 ${pet.location}`;
    document.getElementById('modal-pet-story').textContent = pet.fullStory;
    document.getElementById('modal-pet-microchip').textContent = pet.medical.microchip;

    const photoBadge = document.getElementById('modal-photo-badge');
    if (photoBadge) photoBadge.textContent = `${pet.breed} - Foto oficial`;

    const tagsContainer = document.getElementById('modal-pet-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = pet.tags
        .map(
          (tag) => `
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          ✨ ${tag}
        </span>
      `
        )
        .join('');
    }

    const gallery = pet.gallery && pet.gallery.length > 0 ? pet.gallery : [pet.image];
    if (this.galleryMainImg) {
      this.galleryMainImg.src = gallery[0];
      this.galleryMainImg.alt = `${pet.name} - ${pet.breed}`;
    }

    if (this.galleryThumbnails) {
      this.galleryThumbnails.innerHTML = gallery
        .map(
          (imgUrl, idx) => `
        <div class="gallery-thumb w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition ${idx === 0 ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-gray-200 opacity-70 hover:opacity-100'} p-1 bg-white" data-thumb-idx="${idx}">
          <img src="${imgUrl}" class="w-full h-full object-contain">
        </div>
      `
        )
        .join('');

      this.galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          this.galleryThumbnails.querySelectorAll('.gallery-thumb').forEach((t) => {
            t.classList.remove('border-emerald-600', 'ring-2', 'ring-emerald-300');
            t.classList.add('border-gray-200', 'opacity-70');
          });
          thumb.classList.remove('border-gray-200', 'opacity-70');
          thumb.classList.add('border-emerald-600', 'ring-2', 'ring-emerald-300');
          const idx = parseInt(thumb.dataset.thumbIdx, 10);
          if (this.galleryMainImg && gallery[idx]) {
            this.galleryMainImg.src = gallery[idx];
          }
        });
      });
    }

    this.openModal(this.petDetailsModal);
  }

  // Opens the dedicated Apartado de Adopción
  openAdoptionModal(pet) {
    this.selectedPet = pet;

    const summaryImg = document.getElementById('adopt-summary-img');
    const summaryName = document.getElementById('adopt-summary-name');
    const summaryMeta = document.getElementById('adopt-summary-meta');
    const petIdInput = document.getElementById('adopt-pet-id');

    if (summaryImg) summaryImg.src = pet.image;
    if (summaryName) summaryName.textContent = `${pet.name} (${pet.breed})`;
    if (summaryMeta) summaryMeta.textContent = `${pet.age} · ${pet.gender} · ${pet.size} · ${pet.location}`;
    if (petIdInput) petIdInput.value = pet.id;

    this.openModal(this.adoptionModal);
  }

  handleAdoptionSubmit(form) {
    const formData = new FormData(form);
    const applicantName = formData.get('fullName') || 'Amigo de los animales';
    const petName = this.selectedPet ? this.selectedPet.name : 'la mascota';
    const ticketCode = 'ADOP-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('success-applicant-name').textContent = applicantName;
    document.getElementById('success-pet-name').textContent = petName;
    document.getElementById('success-ticket-code').textContent = ticketCode;

    this.closeModal(this.adoptionModal);
    this.openModal(this.adoptionSuccessModal);
    form.reset();

    this.showToast(`🎉 ¡Solicitud para adoptar a ${petName} enviada con éxito!`);
  }

  handlePublishPet(form) {
    const formData = new FormData(form);
    const species = formData.get('species') || 'perro';
    const breed = formData.get('breed') || 'Raza a evaluar';
    const name = formData.get('name') || 'Mascota';
    const age = formData.get('age') || '1 año';
    const gender = formData.get('gender') || 'Macho';
    const size = formData.get('size') || 'Mediano';
    const location = formData.get('location') || 'Huánuco, Perú';
    const description = formData.get('description') || 'En búsqueda de una segunda oportunidad.';
    const imageUrl = formData.get('imageUrl') || 'images/pastor-aleman.jpg';

    const speciesLabelMap = {
      perro: 'Perro',
      gato: 'Gato',
      otros: 'Otros'
    };

    const newPet = {
      id: 'custom-' + Date.now(),
      name,
      species,
      speciesLabel: speciesLabelMap[species] || 'Mascota',
      breed,
      age,
      gender,
      size,
      weight: size === 'Grande' ? '25 kg' : size === 'Pequeño' ? '6 kg' : '15 kg',
      location,
      description,
      fullStory: description,
      image: imageUrl,
      gallery: [imageUrl],
      tags: [breed, 'En adopción responsable', 'Huánuco'],
      medical: {
        vaccinated: true,
        neutered: true,
        dewormed: true,
        microchip: 'PE-' + Math.floor(10000 + Math.random() * 90000)
      },
      energy: 'Media',
      coatColor: 'Estándar'
    };

    this.pets.unshift(newPet);
    this.savePets();
    this.closeModal(this.publishModal);
    this.renderPets();
    form.reset();

    this.showToast(`🐾 ¡${name} fue publicado con éxito en el catálogo!`);
  }

  toggleFavorite(petId) {
    const idx = this.favorites.indexOf(petId);
    const pet = this.pets.find((p) => p.id === petId);
    const petName = pet ? pet.name : 'la mascota';

    if (idx > -1) {
      this.favorites.splice(idx, 1);
      this.showToast(`💔 Removiste a ${petName} de tus favoritos`);
    } else {
      this.favorites.push(petId);
      this.showToast(`❤️ ¡${petName} guardado en tus favoritos!`);
    }

    this.saveFavorites();
    this.updateFavoritesCount();
    this.renderPets();

    if (!this.favoritesModal.classList.contains('hidden')) {
      this.renderFavoritesList();
    }
  }

  openFavoritesModal() {
    this.renderFavoritesList();
    this.openModal(this.favoritesModal);
  }

  renderFavoritesList() {
    const container = document.getElementById('favorites-list-container');
    if (!container) return;

    const favoritePets = this.pets.filter((p) => this.favorites.includes(p.id));

    if (favoritePets.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center">
          <div class="w-16 h-16 mx-auto mb-3 bg-red-50 text-red-400 rounded-full flex items-center justify-center text-2xl">❤️</div>
          <p class="font-bold text-gray-800">Aún no tienes mascotas favoritas</p>
          <p class="text-xs text-gray-500 mt-1">Haz clic en el corazón de cualquier ficha para guardarla aquí.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = favoritePets
      .map(
        (pet) => `
      <div class="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 hover:bg-white hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <img src="${pet.image}" alt="${pet.name}" class="w-16 h-16 rounded-xl object-contain bg-white border border-gray-100 p-1">
          <div>
            <h4 class="font-bold text-gray-900 text-sm">${pet.name}</h4>
            <span class="text-xs font-semibold text-emerald-800">${pet.breed}</span>
            <p class="text-[11px] text-gray-500">${pet.age} · ${pet.gender} · ${pet.location}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button onclick="window.huellitas.openPetDetailsById('${pet.id}')" class="px-3 py-1.5 bg-[#e8f5ee] text-[#175338] text-xs font-bold rounded-xl hover:bg-[#d5eddf] transition">
            Ver
          </button>
          <button onclick="window.huellitas.openAdoptionModalById('${pet.id}')" class="px-3 py-1.5 bg-[#1b4d3e] text-white text-xs font-bold rounded-xl hover:bg-[#143d31] transition">
            Adoptar
          </button>
          <button onclick="window.huellitas.toggleFavorite('${pet.id}')" class="w-8 h-8 rounded-xl bg-white border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition" title="Quitar">
            ✕
          </button>
        </div>
      </div>
    `
      )
      .join('');
  }

  openPetDetailsById(id) {
    const pet = this.pets.find((p) => p.id === id);
    if (pet) {
      this.closeModal(this.favoritesModal);
      this.openPetDetails(pet);
    }
  }

  openAdoptionModalById(id) {
    const pet = this.pets.find((p) => p.id === id);
    if (pet) {
      this.closeModal(this.favoritesModal);
      this.openAdoptionModal(pet);
    }
  }

  updateFavoritesCount() {
    if (this.favoritesCountBadge) {
      this.favoritesCountBadge.textContent = this.favorites.length;
      if (this.favorites.length > 0) {
        this.favoritesCountBadge.classList.remove('hidden');
      } else {
        this.favoritesCountBadge.classList.add('hidden');
      }
    }
  }

  openModal(modal) {
    if (!modal) return;
    this.closeAllModals();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    const openModals = document.querySelectorAll('.modal-wrapper:not(.hidden)');
    if (openModals.length === 0) {
      document.body.style.overflow = '';
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-wrapper').forEach((m) => {
      m.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.querySelector('span').textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 3500);
  }

  loadPets() {
    // Return verified INITIAL_PETS catalog
    return INITIAL_PETS;
  }

  savePets() {
    try {
      localStorage.setItem('huellitas_pets', JSON.stringify(this.pets));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  loadFavorites() {
    try {
      const saved = localStorage.getItem('huellitas_favs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('huellitas_favs', JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.huellitas = new HuellitasApp();
});
