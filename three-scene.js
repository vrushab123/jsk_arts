import * as THREE from 'three';

let scene, camera, renderer, object, particles;

// Variables for mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

export function initThreeScene() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a); // Deep Charcoal
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03); // Subtle fog for depth

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.5;
    camera.position.x = 0; // Centered
    // We adjust camera x based on screen size later if needed

    // 3. Renderer Setup
    const canvas = document.querySelector('#bg-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting - Critical for the "Luxurious" look
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffdfba, 10); // Warm light
    mainSpot.position.set(5, 5, 5);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.5;
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const rimLight = new THREE.SpotLight(0xd4af37, 8); // Gold Rim light
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // 5. Object (The "Masterpiece")
    // Generate Procedural Marble Texture
    const marbleTexture = createMarbleTexture();
    const texture = new THREE.CanvasTexture(marbleTexture);

    // Complex twisted geometry
    const geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 200, 32, 2, 3);

    const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        color: 0xffffff,
        roughness: 0.2, // Smooth polished stone
        metalness: 0.1,
        clearcoat: 1.0, // High gloss finish
        clearcoatRoughness: 0.1,
        flatShading: false,
    });

    object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);

    // 6. Particles (Gold Dust)
    addParticles(scene);

    // 7. Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function createMarbleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; // Higher res for better quality
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base: Creamy White
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, 1024, 1024);

    // Vein Configuration
    ctx.lineCap = 'round';

    // Function to draw a single vein
    const drawVein = (color, width, alpha, volatility) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;

        let x = Math.random() * 1024;
        let y = Math.random() * 1024;
        ctx.moveTo(x, y);

        for (let j = 0; j < 20; j++) {
            x += (Math.random() - 0.5) * volatility;
            y += (Math.random() - 0.5) * volatility;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    // Layer 1: Soft Grey Veins
    ctx.filter = 'blur(5px)';
    for (let i = 0; i < 15; i++) {
        drawVein('#888888', Math.random() * 8 + 2, 0.15, 200);
    }

    // Layer 2: Medium Grey/Brown Veins
    ctx.filter = 'blur(2px)';
    for (let i = 0; i < 10; i++) {
        drawVein('#6b6b6b', Math.random() * 4 + 1, 0.2, 150);
    }

    // Layer 3: Sharp Gold Veins
    ctx.filter = 'none';
    for (let i = 0; i < 6; i++) {
        drawVein('#d4af37', Math.random() * 2 + 0.5, 0.8, 100);
    }

    return canvas;
}

function addParticles(scene) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 150; i++) {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 10;
        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
        color: 0xd4af37, // Gold dust
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (object) {
        // Continuous Rotation
        object.rotation.y += 0.003;
        object.rotation.x += 0.001;

        // Smooth Mouse Parallax
        targetRotationX = mouseY * 0.2;
        targetRotationY = mouseX * 0.2;

        // Linear interpolation for smoothness
        object.rotation.x += (targetRotationX - object.rotation.x * 0.0) * 0.05; // Gentle tilt
        object.rotation.y += (targetRotationY - object.rotation.y * 0.0) * 0.05;
    }

    if (particles) {
        particles.rotation.y -= 0.001; // Particles drift slowly
    }

    renderer.render(scene, camera);
}
