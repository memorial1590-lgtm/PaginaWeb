/**
 * Huellitas 3D Interactive Viewer - High Anatomical Realism & Volumetric Engine
 * Custom sculpted procedural 3D models with anatomical volume, muscle structure,
 * textured fur bump maps, realistic glossy eyes, layered coat geometry and lifelike animations.
 *
 * Breeds:
 * 1. Pastor Alemán (Rex)
 * 2. Labrador (Max)
 * 3. Pug (Milo)
 * 4. Gran Danés (Apolo)
 * 5. Mestizo / Criollo (Luna)
 * 6. Persa (Copito)
 * 7. Siamés (Cleo)
 * 8. Cuy Inti (Inti)
 * 9. Conejo blanco (Tambor)
 * 10. Hámster americano (Cheeks)
 */

class PetViewer3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentPetModel = null;
    this.clock = new THREE.Clock();
    this.animState = {
      isAutoRotating: true,
      action: 'idle',
      actionProgress: 0,
      breathSpeed: 2.2
    };
    this.pedestal = null;
    this.particles = null;
    this.lights = {};
    this.currentPetData = null;
    this.furTextures = {};

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6f8f7);
    this.scene.fog = new THREE.FogExp2(0xf6f8f7, 0.035);

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 420;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(2.9, 2.3, 3.9);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 1.7;
    this.controls.maxDistance = 7.5;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.03;
    this.controls.target.set(0, 0.88, 0);
    this.controls.autoRotate = this.animState.isAutoRotating;
    this.controls.autoRotateSpeed = 1.8;

    this.setupLighting();
    this.setupEnvironment();

    window.addEventListener('resize', () => this.onResize());

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.lights.ambient);

    // Key Light with soft shadows
    this.lights.key = new THREE.DirectionalLight(0xfff8ee, 1.25);
    this.lights.key.position.set(4, 7, 4.5);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.width = 1024;
    this.lights.key.shadow.mapSize.height = 1024;
    this.lights.key.shadow.camera.near = 0.5;
    this.lights.key.shadow.camera.far = 16;
    this.lights.key.shadow.bias = -0.001;
    this.scene.add(this.lights.key);

    // Rim light for fur rim contour highlighting
    this.lights.rim = new THREE.DirectionalLight(0xaad8c3, 0.7);
    this.lights.rim.position.set(-4.5, 3.5, -4.5);
    this.scene.add(this.lights.rim);

    // Fill light
    this.lights.fill = new THREE.DirectionalLight(0xffffff, 0.45);
    this.lights.fill.position.set(-3.5, 2.5, 3.5);
    this.scene.add(this.lights.fill);

    // Ground bounce light
    const bounceLight = new THREE.DirectionalLight(0xecfdf5, 0.3);
    bounceLight.position.set(0, -2, 0);
    this.scene.add(bounceLight);
  }

  setLightPreset(preset) {
    if (preset === 'studio') {
      this.scene.background = new THREE.Color(0xf6f8f7);
      this.lights.ambient.color.setHex(0xffffff);
      this.lights.ambient.intensity = 0.8;
      this.lights.key.color.setHex(0xfff8ee);
      this.lights.key.intensity = 1.25;
      this.lights.rim.color.setHex(0xaad8c3);
    } else if (preset === 'sunset') {
      this.scene.background = new THREE.Color(0xfbf3e8);
      this.lights.ambient.color.setHex(0xffe2d1);
      this.lights.ambient.intensity = 0.75;
      this.lights.key.color.setHex(0xffaa5e);
      this.lights.key.intensity = 1.4;
      this.lights.rim.color.setHex(0xff7761);
    } else if (preset === 'nature') {
      this.scene.background = new THREE.Color(0xecf6ef);
      this.lights.ambient.color.setHex(0xe3f9e9);
      this.lights.ambient.intensity = 0.85;
      this.lights.key.color.setHex(0xffffff);
      this.lights.key.intensity = 1.1;
      this.lights.rim.color.setHex(0x52b788);
    }
  }

  setupEnvironment() {
    this.pedestal = new THREE.Group();

    // Base podium
    const baseGeo = new THREE.CylinderGeometry(1.85, 2.0, 0.22, 64);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.11;
    baseMesh.receiveShadow = true;
    this.pedestal.add(baseMesh);

    // Accent ring
    const ringGeo = new THREE.CylinderGeometry(1.75, 1.75, 0.23, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x194a37, roughness: 0.35 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -0.10;
    ringMesh.receiveShadow = true;
    this.pedestal.add(ringMesh);

    // Velvet top turf
    const topGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.24, 64);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xede6dc, roughness: 0.65 });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = -0.09;
    topMesh.receiveShadow = true;
    this.pedestal.add(topMesh);

    // Floor shadow
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const shadowFloor = new THREE.Mesh(shadowGeo, shadowMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.22;
    shadowFloor.receiveShadow = true;
    this.scene.add(shadowFloor);

    // Ambient contact shadow circle directly under animal
    const contactGeo = new THREE.CircleGeometry(1.1, 32);
    const contactMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.14 });
    const contactMesh = new THREE.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.y = 0.035;
    this.pedestal.add(contactMesh);

    this.scene.add(this.pedestal);

    // Soft floating sparkle points
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(40 * 3);
    for (let i = 0; i < 40 * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 5.5;
      posArray[i + 1] = Math.random() * 3 + 0.1;
      posArray[i + 2] = (Math.random() - 0.5) * 5.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    this.particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.045, color: 0x52b788, transparent: true, opacity: 0.45 }));
    this.scene.add(this.particles);
  }

  // Generate procedural fur bump map for realistic coat texture
  getFurTexture(type = 'default') {
    if (this.furTextures[type]) return this.furTextures[type];

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Fine hair strokes
    ctx.strokeStyle = '#909090';
    ctx.lineWidth = 1;
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const len = Math.random() * 8 + 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 2, y + len);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    this.furTextures[type] = tex;
    return tex;
  }

  // Create realistic eyes with cornea gloss, colored iris, and specular highlight
  createRealisticEye(irisColorHex = 0x5c3818, size = 0.08) {
    const eyeGroup = new THREE.Group();

    // Sclera/Eyeball
    const eyeball = new THREE.Mesh(
      new THREE.SphereGeometry(size, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x221b15, roughness: 0.1, metalness: 0.1 })
    );
    eyeGroup.add(eyeball);

    // Iris
    const iris = new THREE.Mesh(
      new THREE.CircleGeometry(size * 0.75, 16),
      new THREE.MeshBasicMaterial({ color: irisColorHex })
    );
    iris.position.set(0, 0, size * 0.95);
    eyeGroup.add(iris);

    // Pupil
    const pupil = new THREE.Mesh(
      new THREE.CircleGeometry(size * 0.45, 16),
      new THREE.MeshBasicMaterial({ color: 0x050505 })
    );
    pupil.position.set(0, 0, size * 0.97);
    eyeGroup.add(pupil);

    // Cornea Specular Highlight (Reflection gleam)
    const gleam = new THREE.Mesh(
      new THREE.CircleGeometry(size * 0.22, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    gleam.position.set(size * 0.22, size * 0.24, size * 0.99);
    eyeGroup.add(gleam);

    return eyeGroup;
  }

  // Create leather-textured nose with nostrils and philtrum groove
  createRealisticNose(width = 0.14, height = 0.1, depth = 0.08, colorHex = 0x18181b) {
    const noseGroup = new THREE.Group();

    const noseMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.45,
      metalness: 0.1
    });

    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), noseMat);
    noseGroup.add(noseMesh);

    // Nostrils
    const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const nGeo = new THREE.CylinderGeometry(width * 0.14, width * 0.14, depth * 1.05, 8);

    const nL = new THREE.Mesh(nGeo, nostrilMat);
    nL.rotation.x = Math.PI / 2;
    nL.position.set(width * 0.25, -height * 0.15, 0);

    const nR = new THREE.Mesh(nGeo, nostrilMat);
    nR.rotation.x = Math.PI / 2;
    nR.position.set(-width * 0.25, -height * 0.15, 0);

    noseGroup.add(nL, nR);
    return noseGroup;
  }

  // Load a model based on exact breed
  loadPet(pet) {
    this.currentPetData = pet;
    if (this.currentPetModel) {
      this.scene.remove(this.currentPetModel);
      this.currentPetModel = null;
    }

    const breedKey = (pet.breed || '').toLowerCase();
    let modelGroup;

    if (breedKey.includes('pastor')) {
      modelGroup = this.createPastorAlemanModel(pet);
    } else if (breedKey.includes('labrador')) {
      modelGroup = this.createLabradorModel(pet);
    } else if (breedKey.includes('pug')) {
      modelGroup = this.createPugModel(pet);
    } else if (breedKey.includes('gran danés') || breedKey.includes('danes')) {
      modelGroup = this.createGranDanesModel(pet);
    } else if (breedKey.includes('persa')) {
      modelGroup = this.createPersianCatModel(pet);
    } else if (breedKey.includes('siames') || breedKey.includes('siamés')) {
      modelGroup = this.createSiameseCatModel(pet);
    } else if (breedKey.includes('mestizo') || breedKey.includes('criollo')) {
      modelGroup = this.createCriolloCatModel(pet);
    } else if (breedKey.includes('cuy')) {
      modelGroup = this.createCuyIntiModel(pet);
    } else if (breedKey.includes('conejo')) {
      modelGroup = this.createWhiteRabbitModel(pet);
    } else if (breedKey.includes('hamster') || breedKey.includes('hámster')) {
      modelGroup = this.createHamsterModel(pet);
    } else {
      modelGroup = this.createLabradorModel(pet);
    }

    this.currentPetModel = modelGroup;
    this.scene.add(this.currentPetModel);

    // Adjust camera according to size
    if (breedKey.includes('gran danés') || breedKey.includes('danes')) {
      this.camera.position.set(3.4, 2.6, 4.2);
      this.controls.target.set(0, 1.25, 0);
    } else if (breedKey.includes('hamster') || breedKey.includes('cuy')) {
      this.camera.position.set(1.9, 1.35, 2.4);
      this.controls.target.set(0, 0.48, 0);
    } else {
      this.camera.position.set(2.8, 2.2, 3.8);
      this.controls.target.set(0, 0.88, 0);
    }
    this.controls.update();
    this.triggerAction('idle');
  }

  // -------------------------------------------------------------
  // 1. PASTOR ALEMÁN (Rex): Slanted topline, erect cupped ears, saddle coat
  // -------------------------------------------------------------
  createPastorAlemanModel(pet) {
    const dog = new THREE.Group();
    dog.name = 'PastorGroup';

    const furBump = this.getFurTexture('pastor');
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1614, roughness: 0.65, bumpMap: furBump, bumpScale: 0.02 });
    const tanMat = new THREE.MeshStandardMaterial({ color: 0xbe7d3b, roughness: 0.65, bumpMap: furBump, bumpScale: 0.02 });
    const chestTanMat = new THREE.MeshStandardMaterial({ color: 0xd89552, roughness: 0.7 });
    const pinkInnerMat = new THREE.MeshStandardMaterial({ color: 0xdf8f8f, roughness: 0.5 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x194a37, roughness: 0.35, metalness: 0.1 });

    // Compound Torso: Deep Ribcage + Tapered Flank + Slanted Croup
    const torsoGroup = new THREE.Group();
    torsoGroup.name = 'TorsoGroup';

    // Ribcage (Deep & Muscular)
    const ribcage = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.75, 24), tanMat);
    ribcage.rotation.z = Math.PI / 2.2;
    ribcage.position.set(0.18, 0.98, 0);
    ribcage.castShadow = true;
    torsoGroup.add(ribcage);

    // Black Saddle Mantle over back
    const saddle = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.51, 0.85, 24), blackMat);
    saddle.rotation.z = Math.PI / 2.2;
    saddle.position.set(0.08, 1.05, 0);
    saddle.castShadow = true;
    torsoGroup.add(saddle);

    // Tapered Muscular Flank & Slanted Croup (German Shepherd characteristic slope)
    const croup = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 20), blackMat);
    croup.scale.set(1.2, 0.85, 0.9);
    croup.position.set(-0.35, 0.88, 0);
    torsoGroup.add(croup);

    // Chest with tan blaze
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), chestTanMat);
    chest.scale.set(0.8, 1.1, 0.9);
    chest.position.set(0.45, 0.92, 0);
    torsoGroup.add(chest);

    dog.add(torsoGroup);

    // Head Group with athletic arch
    const headGroup = new THREE.Group();
    headGroup.position.set(0.62, 1.48, 0);
    headGroup.name = 'Head';

    // Cranium
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), blackMat);
    skull.scale.set(1.15, 1.0, 0.92);
    skull.castShadow = true;
    headGroup.add(skull);

    // Tan cheek ruffs
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), tanMat);
    cheekL.position.set(0.08, -0.1, 0.22);
    const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), tanMat);
    cheekR.position.set(0.08, -0.1, -0.22);
    headGroup.add(cheekL, cheekR);

    // Long athletic muzzle with black mask
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.28), blackMat);
    snout.position.set(0.4, -0.06, 0);
    snout.castShadow = true;
    headGroup.add(snout);

    // Textured Nose
    const nose = this.createRealisticNose(0.13, 0.09, 0.08, 0x111111);
    nose.position.set(0.65, 0.05, 0);
    headGroup.add(nose);

    // Tongue
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.14), new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }));
    tongue.position.set(0.42, -0.2, 0);
    tongue.rotation.z = -0.12;
    headGroup.add(tongue);

    // Realistic Amber Eyes
    const leftEye = this.createRealisticEye(0x78350f, 0.07);
    leftEye.position.set(0.3, 0.14, 0.19);
    leftEye.rotation.y = Math.PI / 4;

    const rightEye = this.createRealisticEye(0x78350f, 0.07);
    rightEye.position.set(0.3, 0.14, -0.19);
    rightEye.rotation.y = -Math.PI / 4;
    headGroup.add(leftEye, rightEye);

    // Erect Cupped Ears with pink interior and black backing
    const makePastorEar = (z, rotZ, name) => {
      const earGroup = new THREE.Group();
      earGroup.name = name;

      const outerCone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.68, 4), blackMat);
      outerCone.rotation.z = -0.1;
      earGroup.add(outerCone);

      const innerCone = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.58, 4), pinkInnerMat);
      innerCone.position.set(0.02, 0, 0.01);
      innerCone.rotation.z = -0.1;
      earGroup.add(innerCone);

      earGroup.position.set(0.04, 0.54, z);
      earGroup.rotation.set(rotZ, 0.1, -0.12);
      return earGroup;
    };

    const leftEar = makePastorEar(0.24, -0.12, 'LeftEar');
    const rightEar = makePastorEar(-0.24, 0.12, 'RightEar');
    headGroup.add(leftEar, rightEar);

    dog.add(headGroup);

    // Collar with gold tag
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.055, 16, 32), collarMat);
    collar.position.set(0.45, 1.24, 0);
    collar.rotation.y = Math.PI / 2;
    collar.rotation.x = 0.35;
    dog.add(collar);

    // Anatomical Legs: Muscular Thighs + Hock + Tan Paws
    const legGeo = new THREE.CylinderGeometry(0.10, 0.12, 0.72, 16);
    const pawGeo = new THREE.SphereGeometry(0.13, 16, 16);

    const makeDogLeg = (x, z, name, isHind = false) => {
      const g = new THREE.Group();
      g.name = name;

      // Upper muscle thigh if hind
      if (isHind) {
        const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), blackMat);
        thigh.scale.set(1.1, 1.4, 0.9);
        thigh.position.set(-0.04, 0.52, 0);
        g.add(thigh);
      }

      const leg = new THREE.Mesh(legGeo, tanMat);
      leg.position.y = 0.36;
      leg.castShadow = true;
      g.add(leg);

      const paw = new THREE.Mesh(pawGeo, tanMat);
      paw.scale.set(1.1, 0.5, 1.15);
      paw.position.set(0.06, 0.07, 0);
      g.add(paw);

      g.position.set(x, 0, z);
      return g;
    };

    dog.add(
      makeDogLeg(0.38, 0.28, 'FrontLeftLeg'),
      makeDogLeg(0.38, -0.28, 'FrontRightLeg'),
      makeDogLeg(-0.46, 0.29, 'BackLeftLeg', true),
      makeDogLeg(-0.46, -0.29, 'BackRightLeg', true)
    );

    // Bushy Black Saber Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.62, 0.98, 0);
    tailGroup.name = 'Tail';
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.15, 0.75, 16), blackMat);
    tail.position.set(-0.28, 0.18, 0);
    tail.rotation.z = -Math.PI / 3.2;
    tailGroup.add(tail);
    dog.add(tailGroup);

    return dog;
  }

  // -------------------------------------------------------------
  // 2. LABRADOR (Max): Golden honey coat, broad otter skull, floppy drop ears
  // -------------------------------------------------------------
  createLabradorModel(pet) {
    const dog = new THREE.Group();
    dog.name = 'LabradorGroup';

    const furBump = this.getFurTexture('labrador');
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xdeb878, roughness: 0.6, bumpMap: furBump, bumpScale: 0.015 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf5ddaa, roughness: 0.65 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x194a37, roughness: 0.35 });

    // Sturdy Barrel Ribcage & Torso
    const torso = new THREE.Group();
    torso.name = 'TorsoGroup';

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 1.12, 24), goldMat);
    body.rotation.z = Math.PI / 2.3;
    body.position.set(0, 0.88, 0);
    body.castShadow = true;
    torso.add(body);

    // Soft creamy chest
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), bellyMat);
    chest.scale.set(0.85, 1.1, 0.95);
    chest.position.set(0.36, 0.84, 0);
    torso.add(chest);

    dog.add(torso);

    // Broad friendly head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.56, 1.38, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), goldMat);
    head.scale.set(1.1, 1.0, 1.04);
    head.castShadow = true;
    headGroup.add(head);

    // Broad muzzle
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.38), bellyMat);
    snout.position.set(0.36, -0.06, 0);
    headGroup.add(snout);

    // Big black leather nose
    const nose = this.createRealisticNose(0.14, 0.1, 0.09, 0x18181b);
    nose.position.set(0.60, 0.05, 0);
    headGroup.add(nose);

    // Happy open tongue
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.18), new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 }));
    tongue.position.set(0.42, -0.22, 0);
    tongue.rotation.z = -0.15;
    headGroup.add(tongue);

    // Kind Hazel/Brown Eyes
    const leftEye = this.createRealisticEye(0x603813, 0.075);
    leftEye.position.set(0.32, 0.15, 0.22);
    leftEye.rotation.y = Math.PI / 4.2;

    const rightEye = this.createRealisticEye(0x603813, 0.075);
    rightEye.position.set(0.32, 0.15, -0.22);
    rightEye.rotation.y = -Math.PI / 4.2;
    headGroup.add(leftEye, rightEye);

    // Triangular Floppy Drop Ears
    const earGeo = new THREE.ConeGeometry(0.2, 0.58, 16);
    const leftEar = new THREE.Mesh(earGeo, goldMat);
    leftEar.position.set(-0.06, 0.34, 0.36);
    leftEar.rotation.set(0.45, 0, 1.85);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, goldMat);
    rightEar.position.set(-0.06, 0.34, -0.36);
    rightEar.rotation.set(-0.45, 0, 1.85);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    dog.add(headGroup);

    // Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.06, 16, 32), collarMat);
    collar.position.set(0.42, 1.15, 0);
    collar.rotation.y = Math.PI / 2;
    dog.add(collar);

    // Strong sturdy legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.65, 16);
    const pawGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const makeLeg = (x, z, name) => {
      const g = new THREE.Group();
      g.name = name;
      const leg = new THREE.Mesh(legGeo, goldMat);
      leg.position.y = 0.32;
      g.add(leg);
      const paw = new THREE.Mesh(pawGeo, bellyMat);
      paw.scale.set(1.1, 0.6, 1.2);
      paw.position.set(0.06, 0.08, 0);
      g.add(paw);
      g.position.set(x, 0, z);
      return g;
    };
    dog.add(makeLeg(0.38, 0.28, 'FrontLeftLeg'), makeLeg(0.38, -0.28, 'FrontRightLeg'), makeLeg(-0.42, 0.3, 'BackLeftLeg'), makeLeg(-0.42, -0.3, 'BackRightLeg'));

    // Thick otter tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.55, 1.02, 0);
    tailGroup.name = 'Tail';
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.65, 16), goldMat);
    tail.position.set(-0.25, 0.22, 0);
    tail.rotation.z = -Math.PI / 3.4;
    tailGroup.add(tail);
    dog.add(tailGroup);

    return dog;
  }

  // -------------------------------------------------------------
  // 3. PUG (Milo): Flat wrinkled face, dark mask, compact cobby body, corkscrew tail
  // -------------------------------------------------------------
  createPugModel(pet) {
    const pug = new THREE.Group();
    pug.name = 'PugGroup';

    const fawnMat = new THREE.MeshStandardMaterial({ color: 0xdeb888, roughness: 0.65 });
    const maskMat = new THREE.MeshStandardMaterial({ color: 0x1f1917, roughness: 0.6 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35 });

    // Heavy cobby barrel body with thick neck
    const torso = new THREE.Group();
    torso.name = 'TorsoGroup';

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), fawnMat);
    body.scale.set(1.22, 0.98, 1.0);
    body.position.set(0, 0.64, 0);
    body.castShadow = true;
    torso.add(body);

    // Thick muscular neck roll
    const neckRoll = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.09, 16, 24), fawnMat);
    neckRoll.position.set(0.28, 0.78, 0);
    neckRoll.rotation.y = Math.PI / 2;
    torso.add(neckRoll);

    pug.add(torso);

    // Large rounded Pug head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.42, 0.96, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), fawnMat);
    head.scale.set(1.05, 0.95, 1.08);
    head.castShadow = true;
    headGroup.add(head);

    // Prominent black facial mask with forehead wrinkle rolls
    const mask = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), maskMat);
    mask.scale.set(0.68, 0.95, 1.18);
    mask.position.set(0.26, -0.05, 0);
    headGroup.add(mask);

    // Wrinkle folds above nose
    const wrinkleFold = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 12, 16, Math.PI), maskMat);
    wrinkleFold.position.set(0.34, 0.12, 0);
    wrinkleFold.rotation.y = Math.PI / 2;
    headGroup.add(wrinkleFold);

    // Flat Pug Nose
    const nose = this.createRealisticNose(0.12, 0.08, 0.06, 0x0a0a0a);
    nose.position.set(0.42, 0.02, 0);
    headGroup.add(nose);

    // Cute pink tongue peeking out
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.1), new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }));
    tongue.position.set(0.39, -0.16, 0.04);
    headGroup.add(tongue);

    // Big expressive dark round eyes (prominent Pug eyes)
    const leftEye = this.createRealisticEye(0x2d1810, 0.09);
    leftEye.position.set(0.26, 0.12, 0.22);
    leftEye.rotation.y = Math.PI / 4.5;

    const rightEye = this.createRealisticEye(0x2d1810, 0.09);
    rightEye.position.set(0.26, 0.12, -0.22);
    rightEye.rotation.y = -Math.PI / 4.5;
    headGroup.add(leftEye, rightEye);

    // Black button ears folded forward
    const earGeo = new THREE.ConeGeometry(0.13, 0.3, 4);
    const leftEar = new THREE.Mesh(earGeo, maskMat);
    leftEar.position.set(-0.02, 0.28, 0.28);
    leftEar.rotation.set(0.4, 0.2, 1.6);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, maskMat);
    rightEar.position.set(-0.02, 0.28, -0.28);
    rightEar.rotation.set(-0.4, -0.2, 1.6);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    pug.add(headGroup);

    // Red Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 16, 24), collarMat);
    collar.position.set(0.32, 0.82, 0);
    collar.rotation.y = Math.PI / 2;
    pug.add(collar);

    // Short stout legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.46, 16);
    const pawGeo = new THREE.SphereGeometry(0.13, 16, 16);
    const makeLeg = (x, z, name) => {
      const g = new THREE.Group();
      g.name = name;
      const leg = new THREE.Mesh(legGeo, fawnMat);
      leg.position.y = 0.23;
      g.add(leg);
      const paw = new THREE.Mesh(pawGeo, fawnMat);
      paw.scale.set(1.1, 0.55, 1.1);
      paw.position.set(0.04, 0.06, 0);
      g.add(paw);
      g.position.set(x, 0, z);
      return g;
    };
    pug.add(makeLeg(0.28, 0.23, 'FrontLeftLeg'), makeLeg(0.28, -0.23, 'FrontRightLeg'), makeLeg(-0.32, 0.23, 'BackLeftLeg'), makeLeg(-0.32, -0.23, 'BackRightLeg'));

    // TIGHT DOUBLE SPIRAL CORKSCREW TAIL (Pug hallmark!)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.48, 0.84, 0);
    tailGroup.name = 'Tail';
    const curlTorus = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.055, 16, 24, Math.PI * 1.6), fawnMat);
    curlTorus.rotation.y = Math.PI / 2;
    curlTorus.rotation.x = -0.55;
    tailGroup.add(curlTorus);
    pug.add(tailGroup);

    return pug;
  }

  // -------------------------------------------------------------
  // 4. GRAN DANÉS (Apolo): Giant majestic proportions, tall legs, chiseled square muzzle
  // -------------------------------------------------------------
  createGranDanesModel(pet) {
    const dane = new THREE.Group();
    dane.name = 'DaneGroup';

    const coatMat = new THREE.MeshStandardMaterial({ color: 0x9b8168, roughness: 0.5, metalness: 0.05 }); // Fawn
    const darkMuzzleMat = new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.6 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x194a37, roughness: 0.35 });

    // Deep brisket and lean athletic flank
    const torso = new THREE.Group();
    torso.name = 'TorsoGroup';

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.44, 1.4, 24), coatMat);
    chest.rotation.z = Math.PI / 2.3;
    chest.position.set(0.05, 1.35, 0);
    chest.castShadow = true;
    torso.add(chest);

    // Tuck-up flank
    const flank = new THREE.Mesh(new THREE.SphereGeometry(0.44, 20, 20), coatMat);
    flank.scale.set(1.3, 0.9, 0.85);
    flank.position.set(-0.45, 1.3, 0);
    torso.add(flank);

    dane.add(torso);

    // Long noble arched neck & Chiseled square head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.75, 2.05, 0);
    headGroup.name = 'Head';

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.5, 0.42), coatMat);
    headGroup.add(skull);

    // Square Dane muzzle with deep dark lips/flews
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.38, 0.36), darkMuzzleMat);
    snout.position.set(0.42, -0.06, 0);
    headGroup.add(snout);

    // Nose
    const nose = this.createRealisticNose(0.15, 0.11, 0.09, 0x111111);
    nose.position.set(0.70, 0.06, 0);
    headGroup.add(nose);

    // Eyes
    const leftEye = this.createRealisticEye(0x452310, 0.075);
    leftEye.position.set(0.3, 0.16, 0.22);
    leftEye.rotation.y = Math.PI / 4.2;

    const rightEye = this.createRealisticEye(0x452310, 0.075);
    rightEye.position.set(0.3, 0.16, -0.22);
    rightEye.rotation.y = -Math.PI / 4.2;
    headGroup.add(leftEye, rightEye);

    // Folded drop ears
    const earGeo = new THREE.ConeGeometry(0.18, 0.55, 16);
    const leftEar = new THREE.Mesh(earGeo, darkMuzzleMat);
    leftEar.position.set(-0.06, 0.34, 0.28);
    leftEar.rotation.set(0.3, 0, 1.8);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, darkMuzzleMat);
    rightEar.position.set(-0.06, 0.34, -0.28);
    rightEar.rotation.set(-0.3, 0, 1.8);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    dane.add(headGroup);

    // Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.06, 16, 32), collarMat);
    collar.position.set(0.52, 1.7, 0);
    collar.rotation.y = Math.PI / 2;
    dane.add(collar);

    // Long powerful limbs (Great Dane stature)
    const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.12, 16);
    const pawGeo = new THREE.SphereGeometry(0.17, 16, 16);
    const makeDaneLeg = (x, z, name) => {
      const g = new THREE.Group();
      g.name = name;
      const leg = new THREE.Mesh(legGeo, coatMat);
      leg.position.y = 0.56;
      leg.castShadow = true;
      g.add(leg);
      const paw = new THREE.Mesh(pawGeo, coatMat);
      paw.scale.set(1.15, 0.55, 1.2);
      paw.position.set(0.06, 0.08, 0);
      g.add(paw);
      g.position.set(x, 0, z);
      return g;
    };
    dane.add(makeDaneLeg(0.5, 0.32, 'FrontLeftLeg'), makeDaneLeg(0.5, -0.32, 'FrontRightLeg'), makeDaneLeg(-0.55, 0.32, 'BackLeftLeg'), makeDaneLeg(-0.55, -0.32, 'BackRightLeg'));

    // Long whip tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.72, 1.45, 0);
    tailGroup.name = 'Tail';
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.9, 16), coatMat);
    tail.position.set(-0.36, 0.28, 0);
    tail.rotation.z = -Math.PI / 3.4;
    tailGroup.add(tail);
    dane.add(tailGroup);

    return dane;
  }

  // -------------------------------------------------------------
  // 5. GATO MESTIZO / CRIOLLO (Luna): Domestic cat with tabby coat & emerald eyes
  // -------------------------------------------------------------
  createCriolloCatModel(pet) {
    const cat = new THREE.Group();
    cat.name = 'CriolloCat';

    const furMat = new THREE.MeshStandardMaterial({ color: 0x907860, roughness: 0.55 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xd4c2b0, roughness: 0.6 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.4 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x194a37, roughness: 0.3 });

    // Sleek domestic cat torso
    const torso = new THREE.Group();
    torso.name = 'TorsoGroup';

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), furMat);
    body.scale.set(1.42, 0.92, 0.82);
    body.position.set(0, 0.74, 0);
    torso.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), bellyMat);
    belly.scale.set(1.2, 0.8, 0.8);
    belly.position.set(0.1, 0.66, 0);
    torso.add(belly);

    cat.add(torso);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.5, 1.18, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), furMat);
    head.scale.set(1.0, 0.92, 1.05);
    headGroup.add(head);

    // Cute muzzle
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bellyMat);
    muzzle.position.set(0.28, -0.06, 0);
    headGroup.add(muzzle);

    const nose = this.createRealisticNose(0.08, 0.05, 0.04, 0xf472b6);
    nose.position.set(0.38, -0.03, 0);
    headGroup.add(nose);

    // Emerald Green Cat Eyes
    const leftEye = this.createRealisticEye(0x65a30d, 0.07);
    leftEye.position.set(0.24, 0.1, 0.18);
    leftEye.rotation.y = Math.PI / 4.5;

    const rightEye = this.createRealisticEye(0x65a30d, 0.07);
    rightEye.position.set(0.24, 0.1, -0.18);
    rightEye.rotation.y = -Math.PI / 4.5;
    headGroup.add(leftEye, rightEye);

    // Pointed ears with inner pink
    const earGeo = new THREE.ConeGeometry(0.14, 0.32, 4);
    const leftEar = new THREE.Mesh(earGeo, furMat);
    leftEar.position.set(0.05, 0.35, 0.22);
    leftEar.name = 'LeftEar';

    const leftInner = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.24, 4), innerEarMat);
    leftInner.position.set(0.07, 0.35, 0.21);

    const rightEar = new THREE.Mesh(earGeo, furMat);
    rightEar.position.set(0.05, 0.35, -0.22);
    rightEar.name = 'RightEar';

    const rightInner = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.24, 4), innerEarMat);
    rightInner.position.set(0.07, 0.35, -0.21);

    headGroup.add(leftEar, leftInner, rightEar, rightInner);
    cat.add(headGroup);

    // Collar with golden bell
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 16, 24), collarMat);
    collar.position.set(0.35, 0.96, 0);
    collar.rotation.y = Math.PI / 2;
    cat.add(collar);

    // Slender legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.55, 16);
    const pawGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const makeLeg = (x, z, name) => {
      const g = new THREE.Group();
      g.name = name;
      const leg = new THREE.Mesh(legGeo, furMat);
      leg.position.y = 0.27;
      g.add(leg);
      const paw = new THREE.Mesh(pawGeo, bellyMat);
      paw.scale.set(1.1, 0.5, 1.05);
      paw.position.set(0.04, 0.05, 0);
      g.add(paw);
      g.position.set(x, 0, z);
      return g;
    };
    cat.add(makeLeg(0.28, 0.22, 'FrontLeftLeg'), makeLeg(0.28, -0.22, 'FrontRightLeg'), makeLeg(-0.35, 0.24, 'BackLeftLeg'), makeLeg(-0.35, -0.24, 'BackRightLeg'));

    // Animated curved tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.52, 0.86, 0);
    tailGroup.name = 'Tail';
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.72, 16), furMat);
    tail.position.set(-0.25, 0.28, 0);
    tail.rotation.z = -Math.PI / 4;
    tailGroup.add(tail);
    cat.add(tailGroup);

    return cat;
  }

  // -------------------------------------------------------------
  // 6. GATO PERSA (Copito): Massive cloud of fluffy fur, flat sweet face, amber eyes
  // -------------------------------------------------------------
  createPersianCatModel(pet) {
    const persian = new THREE.Group();
    persian.name = 'PersianCat';

    const furMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.85 }); // Cloud white
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.5 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.35 });

    // Ultra plush multi-sphere body for real fluffy volume
    const torso = new THREE.Group();
    torso.name = 'TorsoGroup';

    const bodyCore = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24), furMat);
    bodyCore.scale.set(1.3, 1.05, 1.15);
    bodyCore.position.set(0, 0.65, 0);
    torso.add(bodyCore);

    // Fluffy fur clumps (ruff mane around chest)
    const addRuffClump = (x, y, z, s) => {
      const clump = new THREE.Mesh(new THREE.SphereGeometry(0.24 * s, 16, 16), furMat);
      clump.position.set(x, y, z);
      torso.add(clump);
    };
    addRuffClump(0.38, 0.72, 0.25, 1.1);
    addRuffClump(0.38, 0.72, -0.25, 1.1);
    addRuffClump(0.44, 0.65, 0, 1.2);
    addRuffClump(-0.25, 0.62, 0.35, 1.0);
    addRuffClump(-0.25, 0.62, -0.35, 1.0);

    persian.add(torso);

    // Large Round Fluffy Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.46, 1.08, 0);
    headGroup.name = 'Head';

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 24), furMat);
    skull.scale.set(1.0, 0.95, 1.18);
    headGroup.add(skull);

    // Flat Persian Snub Nose
    const nose = this.createRealisticNose(0.07, 0.05, 0.03, 0xfda4af);
    nose.position.set(0.38, 0.02, 0);
    headGroup.add(nose);

    // Big round Copper/Amber Eyes
    const leftEye = this.createRealisticEye(0xd97706, 0.08);
    leftEye.position.set(0.32, 0.12, 0.18);
    leftEye.rotation.y = Math.PI / 5;

    const rightEye = this.createRealisticEye(0xd97706, 0.08);
    rightEye.position.set(0.32, 0.12, -0.18);
    rightEye.rotation.y = -Math.PI / 5;
    headGroup.add(leftEye, rightEye);

    // Small rounded ears with fur tufts
    const earGeo = new THREE.ConeGeometry(0.12, 0.22, 16);
    const leftEar = new THREE.Mesh(earGeo, furMat);
    leftEar.position.set(0.04, 0.38, 0.26);
    leftEar.rotation.set(0.3, 0.2, 0.2);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, furMat);
    rightEar.position.set(0.04, 0.38, -0.26);
    rightEar.rotation.set(-0.3, -0.2, 0.2);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    persian.add(headGroup);

    // Regal Purple Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 16, 24), collarMat);
    collar.position.set(0.34, 0.88, 0);
    collar.rotation.y = Math.PI / 2;
    persian.add(collar);

    // Short stout fluffy legs with breeches
    const legGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.48, 16);
    const makeLeg = (x, z, name) => {
      const g = new THREE.Group();
      g.name = name;
      const leg = new THREE.Mesh(legGeo, furMat);
      leg.position.y = 0.24;
      g.add(leg);
      g.position.set(x, 0, z);
      return g;
    };
    persian.add(makeLeg(0.28, 0.25, 'FrontLeftLeg'), makeLeg(0.28, -0.25, 'FrontRightLeg'), makeLeg(-0.32, 0.26, 'BackLeftLeg'), makeLeg(-0.32, -0.26, 'BackRightLeg'));

    // Huge Fluffy Bottle-Brush Plumose Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.52, 0.78, 0);
    tailGroup.name = 'Tail';
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.78, 16), furMat);
    tail.position.set(-0.25, 0.28, 0);
    tail.rotation.z = -Math.PI / 3.8;
    tailGroup.add(tail);
    persian.add(tailGroup);

    return persian;
  }

  // -------------------------------------------------------------
  // 7. GATO SIAMÉS (Cleo): Oriental svelte body, seal brown points, sapphire blue eyes
  // -------------------------------------------------------------
  createSiameseCatModel(pet) {
    const siam = new THREE.Group();
    siam.name = 'SiameseCat';

    const creamMat = new THREE.MeshStandardMaterial({ color: 0xf6f0e2, roughness: 0.5 }); // Cream/fawn
    const sealMat = new THREE.MeshStandardMaterial({ color: 0x2b1d16, roughness: 0.55 }); // Dark chocolate points
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35 });

    // Svelte tubular torso
    const torso = new THREE.Group();
    torso.name = 'TorsoGroup';

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), creamMat);
    body.scale.set(1.55, 0.86, 0.75);
    body.position.set(0, 0.76, 0);
    torso.add(body);

    siam.add(torso);

    // Wedge-shaped Oriental Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.54, 1.22, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), creamMat);
    head.scale.set(1.15, 0.9, 0.92);
    headGroup.add(head);

    // Dark Seal Mask
    const mask = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.44, 16), sealMat);
    mask.rotation.z = -Math.PI / 2;
    mask.position.set(0.25, -0.06, 0);
    headGroup.add(mask);

    const nose = this.createRealisticNose(0.08, 0.05, 0.04, 0x1a120c);
    nose.position.set(0.45, -0.04, 0);
    headGroup.add(nose);

    // Striking Sapphire Blue Almond Eyes
    const leftEye = this.createRealisticEye(0x0284c7, 0.075);
    leftEye.scale.set(0.7, 1.15, 1.0);
    leftEye.position.set(0.26, 0.1, 0.16);
    leftEye.rotation.y = Math.PI / 4.2;

    const rightEye = this.createRealisticEye(0x0284c7, 0.075);
    rightEye.scale.set(0.7, 1.15, 1.0);
    rightEye.position.set(0.26, 0.1, -0.16);
    rightEye.rotation.y = -Math.PI / 4.2;
    headGroup.add(leftEye, rightEye);

    // Large flaring seal ears (Siamese hallmark)
    const earGeo = new THREE.ConeGeometry(0.16, 0.42, 4);
    const leftEar = new THREE.Mesh(earGeo, sealMat);
    leftEar.position.set(0.04, 0.40, 0.25);
    leftEar.rotation.set(0.25, 0.25, 0.1);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, sealMat);
    rightEar.position.set(0.04, 0.40, -0.25);
    rightEar.rotation.set(-0.25, -0.25, 0.1);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    siam.add(headGroup);

    // Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 16, 24), collarMat);
    collar.position.set(0.36, 1.0, 0);
    collar.rotation.y = Math.PI / 2;
    siam.add(collar);

    // Slender seal-point limbs
    const legGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.6, 16);
    const makeLeg = (x, z, name) => {
      const g = new THREE.Group();
      g.name = name;
      const leg = new THREE.Mesh(legGeo, sealMat);
      leg.position.y = 0.3;
      g.add(leg);
      g.position.set(x, 0, z);
      return g;
    };
    siam.add(makeLeg(0.28, 0.2, 'FrontLeftLeg'), makeLeg(0.28, -0.2, 'FrontRightLeg'), makeLeg(-0.35, 0.22, 'BackLeftLeg'), makeLeg(-0.35, -0.22, 'BackRightLeg'));

    // Long slender seal-point tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.52, 0.88, 0);
    tailGroup.name = 'Tail';
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.065, 0.78, 16), sealMat);
    tail.position.set(-0.28, 0.3, 0);
    tail.rotation.z = -Math.PI / 4;
    tailGroup.add(tail);
    siam.add(tailGroup);

    return siam;
  }

  // -------------------------------------------------------------
  // 8. CUY INTI (Inti): Plump teardrop body, golden-orange and white bi-color patches
  // -------------------------------------------------------------
  createCuyIntiModel(pet) {
    const cuy = new THREE.Group();
    cuy.name = 'CuyGroup';

    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xd97724, roughness: 0.75 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.75 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.4 });

    // Pear / teardrop plump body (white front, gold-orange back)
    const bodyOrange = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), orangeMat);
    bodyOrange.scale.set(1.25, 0.88, 0.98);
    bodyOrange.position.set(-0.12, 0.46, 0);
    bodyOrange.castShadow = true;
    cuy.add(bodyOrange);

    const bodyWhite = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 24), whiteMat);
    bodyWhite.scale.set(0.92, 0.84, 0.94);
    bodyWhite.position.set(0.26, 0.46, 0);
    cuy.add(bodyWhite);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.46, 0.54, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), whiteMat);
    head.scale.set(1.18, 0.92, 0.96);
    headGroup.add(head);

    // Twitching Pink Nose
    const nose = this.createRealisticNose(0.06, 0.04, 0.03, 0xfda4af);
    nose.position.set(0.38, -0.05, 0);
    nose.name = 'RabbitNose';
    headGroup.add(nose);

    // Black bead eyes with gleam
    const leftEye = this.createRealisticEye(0x18181b, 0.05);
    leftEye.position.set(0.18, 0.1, 0.22);
    const rightEye = this.createRealisticEye(0x18181b, 0.05);
    rightEye.position.set(0.18, 0.1, -0.22);
    headGroup.add(leftEye, rightEye);

    // Folded petal ears
    const earGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const leftEar = new THREE.Mesh(earGeo, pinkMat);
    leftEar.scale.set(0.4, 0.9, 0.8);
    leftEar.position.set(-0.06, 0.22, 0.22);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, pinkMat);
    rightEar.scale.set(0.4, 0.9, 0.8);
    rightEar.position.set(-0.06, 0.22, -0.22);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    cuy.add(headGroup);

    // Tiny pink paws
    const pawGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const makePaw = (x, z) => {
      const p = new THREE.Mesh(pawGeo, pinkMat);
      p.scale.set(1.2, 0.5, 0.8);
      p.position.set(x, 0.08, z);
      return p;
    };
    cuy.add(makePaw(0.28, 0.2), makePaw(0.28, -0.2), makePaw(-0.25, 0.24), makePaw(-0.25, -0.24));

    return cuy;
  }

  // -------------------------------------------------------------
  // 9. CONEJO BLANCO (Tambor): Soft white rabbit, erect pink-lined ears, cotton-ball tail
  // -------------------------------------------------------------
  createWhiteRabbitModel(pet) {
    const bunny = new THREE.Group();
    bunny.name = 'RabbitGroup';

    const furBump = this.getFurTexture('rabbit');
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65, bumpMap: furBump, bumpScale: 0.015 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.45 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 });

    // Plump volumetric body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), whiteMat);
    body.scale.set(1.18, 0.96, 0.92);
    body.position.set(0, 0.62, 0);
    body.castShadow = true;
    bunny.add(body);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.44, 1.0, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), whiteMat);
    head.scale.set(1.12, 0.96, 1.02);
    headGroup.add(head);

    // Twitching Pink Nose
    const nose = this.createRealisticNose(0.065, 0.045, 0.035, 0xf472b6);
    nose.position.set(0.36, -0.05, 0);
    nose.name = 'RabbitNose';
    headGroup.add(nose);

    // Ruby / dark rabbit eyes with reflection
    const leftEye = this.createRealisticEye(0x991b1b, 0.065);
    leftEye.position.set(0.2, 0.1, 0.22);
    const rightEye = this.createRealisticEye(0x991b1b, 0.065);
    rightEye.position.set(0.2, 0.1, -0.22);
    headGroup.add(leftEye, rightEye);

    // Long Upright Spoon Ears with delicate pink interior
    const earGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.74, 16);
    const leftEar = new THREE.Mesh(earGeo, whiteMat);
    leftEar.position.set(-0.02, 0.54, 0.15);
    leftEar.rotation.set(0.1, 0, -0.15);
    leftEar.name = 'LeftEar';

    const leftInner = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.64, 16), innerEarMat);
    leftInner.position.set(0.01, 0.54, 0.14);
    leftInner.rotation.set(0.1, 0, -0.15);

    const rightEar = new THREE.Mesh(earGeo, whiteMat);
    rightEar.position.set(-0.02, 0.54, -0.15);
    rightEar.rotation.set(-0.1, 0, -0.15);
    rightEar.name = 'RightEar';

    const rightInner = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.64, 16), innerEarMat);
    rightInner.position.set(0.01, 0.54, -0.14);
    rightInner.rotation.set(-0.1, 0, -0.15);

    headGroup.add(leftEar, leftInner, rightEar, rightInner);
    bunny.add(headGroup);

    // Fluffy Paws
    const pawGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const makePaw = (x, z) => {
      const p = new THREE.Mesh(pawGeo, whiteMat);
      p.scale.set(1.2, 0.6, 0.9);
      p.position.set(x, 0.08, z);
      return p;
    };
    bunny.add(makePaw(0.35, 0.18), makePaw(0.35, -0.18), makePaw(-0.18, 0.32), makePaw(-0.18, -0.32));

    // Cotton-puff tail
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), whiteMat);
    tail.position.set(-0.52, 0.52, 0);
    tail.name = 'Tail';
    bunny.add(tail);

    return bunny;
  }

  // -------------------------------------------------------------
  // 10. HÁMSTER AMERICANO (Cheeks): Chubby seed-stuffed cheeks, cinnamon & white fur
  // -------------------------------------------------------------
  createHamsterModel(pet) {
    const hamster = new THREE.Group();
    hamster.name = 'HamsterGroup';

    const goldenMat = new THREE.MeshStandardMaterial({ color: 0xd98d38, roughness: 0.7 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.4 });

    // Round plump body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 24), goldenMat);
    body.scale.set(1.12, 0.92, 0.96);
    body.position.set(0, 0.44, 0);
    hamster.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), whiteMat);
    belly.scale.set(0.92, 0.92, 0.82);
    belly.position.set(0.16, 0.36, 0);
    hamster.add(belly);

    // Head with Stuffed Chubby Cheeks
    const headGroup = new THREE.Group();
    headGroup.position.set(0.38, 0.6, 0);
    headGroup.name = 'Head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), goldenMat);
    headGroup.add(head);

    // Big chubby cheek pouches
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), whiteMat);
    cheekL.position.set(0.12, -0.06, 0.17);
    const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), whiteMat);
    cheekR.position.set(0.12, -0.06, -0.17);
    headGroup.add(cheekL, cheekR);

    // Tiny pink nose
    const nose = this.createRealisticNose(0.045, 0.035, 0.025, 0xfda4af);
    nose.position.set(0.3, -0.02, 0);
    nose.name = 'RabbitNose';
    headGroup.add(nose);

    // Shiny black eyes with gleam
    const leftEye = this.createRealisticEye(0x111111, 0.045);
    leftEye.position.set(0.18, 0.1, 0.17);
    const rightEye = this.createRealisticEye(0x111111, 0.045);
    rightEye.position.set(0.18, 0.1, -0.17);
    headGroup.add(leftEye, rightEye);

    // Rounded pink ears
    const earGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const leftEar = new THREE.Mesh(earGeo, pinkMat);
    leftEar.scale.set(0.3, 0.9, 0.8);
    leftEar.position.set(-0.06, 0.24, 0.18);
    leftEar.name = 'LeftEar';

    const rightEar = new THREE.Mesh(earGeo, pinkMat);
    rightEar.scale.set(0.3, 0.9, 0.8);
    rightEar.position.set(-0.06, 0.24, -0.18);
    rightEar.name = 'RightEar';

    headGroup.add(leftEar, rightEar);
    hamster.add(headGroup);

    // Tiny pink paws
    const pawGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const makePaw = (x, z) => {
      const p = new THREE.Mesh(pawGeo, pinkMat);
      p.scale.set(1.2, 0.5, 0.8);
      p.position.set(x, 0.06, z);
      return p;
    };
    hamster.add(makePaw(0.24, 0.15), makePaw(0.24, -0.15), makePaw(-0.2, 0.18), makePaw(-0.2, -0.18));

    // Button tail
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), pinkMat);
    tail.position.set(-0.45, 0.4, 0);
    hamster.add(tail);

    return hamster;
  }

  // -------------------------------------------------------------
  // ANIMATION ACTIONS
  // -------------------------------------------------------------
  triggerAction(action) {
    this.animState.action = action;
    if (!this.currentPetModel) return;

    if (action === 'paw') {
      setTimeout(() => {
        if (this.animState.action === 'paw') this.animState.action = 'idle';
      }, 3500);
    }
  }

  setCameraAngle(angleName) {
    if (!this.controls) return;
    const duration = 800;

    let targetPos = { x: 2.8, y: 2.2, z: 3.8 };
    if (angleName === 'front') {
      targetPos = { x: 3.5, y: 1.15, z: 0 };
    } else if (angleName === 'side') {
      targetPos = { x: 0, y: 1.15, z: 3.6 };
    } else if (angleName === 'top') {
      targetPos = { x: 0.2, y: 4.8, z: 0.5 };
    } else if (angleName === 'persp') {
      targetPos = { x: 2.8, y: 2.2, z: 3.8 };
    }

    const startPos = { ...this.camera.position };
    const startTime = performance.now();

    const animateCamera = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * ease;
      this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * ease;
      this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * ease;
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    requestAnimationFrame(animateCamera);
  }

  toggleAutoRotate(enable) {
    if (enable !== undefined) {
      this.animState.isAutoRotating = enable;
    } else {
      this.animState.isAutoRotating = !this.animState.isAutoRotating;
    }
    if (this.controls) {
      this.controls.autoRotate = this.animState.isAutoRotating;
    }
    return this.animState.isAutoRotating;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.05;
    }

    if (this.currentPetModel) {
      const head = this.currentPetModel.getObjectByName('Head');
      const tail = this.currentPetModel.getObjectByName('Tail');
      const leftEar = this.currentPetModel.getObjectByName('LeftEar');
      const rightEar = this.currentPetModel.getObjectByName('RightEar');
      const frontLeftLeg = this.currentPetModel.getObjectByName('FrontLeftLeg');
      const rabbitNose = this.currentPetModel.getObjectByName('RabbitNose');
      const torsoGroup = this.currentPetModel.getObjectByName('TorsoGroup');

      // Subtle lifelike breathing (expansion of torso)
      const breath = Math.sin(elapsedTime * this.animState.breathSpeed);
      this.currentPetModel.position.y = breath * 0.012;

      if (torsoGroup) {
        torsoGroup.scale.set(1 + breath * 0.015, 1 + breath * 0.02, 1 + breath * 0.015);
      }

      // Curious lifelike head movement
      if (head) {
        head.rotation.y = Math.sin(elapsedTime * 0.75) * 0.12;
        head.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;
      }

      // Ear alert twitches
      if (leftEar && rightEar) {
        const twitch = Math.sin(elapsedTime * 3.5) > 0.88 ? 0.06 : 0;
        leftEar.rotation.z += twitch * 0.08;
        rightEar.rotation.z += twitch * 0.08;
      }

      // Small animal rapid nose twitch
      if (rabbitNose) {
        rabbitNose.scale.setScalar(1 + Math.sin(elapsedTime * 15) * 0.14);
      }

      // Tail Wagging
      if (tail) {
        const wagSpeed = this.animState.action === 'wag' ? 14 : 5.5;
        tail.rotation.z = -Math.PI / 3.4 + Math.sin(elapsedTime * wagSpeed) * 0.32;
        tail.rotation.y = Math.cos(elapsedTime * wagSpeed) * 0.22;
      }

      // Give paw animation
      if (this.animState.action === 'paw' && frontLeftLeg) {
        frontLeftLeg.rotation.z = Math.min(frontLeftLeg.rotation.z + delta * 3, 0.85);
        frontLeftLeg.position.y = 0.25;
        if (head) head.rotation.z = -0.15;
      } else if (frontLeftLeg) {
        frontLeftLeg.rotation.z = Math.max(frontLeftLeg.rotation.z - delta * 3, 0);
        frontLeftLeg.position.y = 0;
      }
    }

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.PetViewer3D = PetViewer3D;
