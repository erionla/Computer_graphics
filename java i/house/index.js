import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Shtepia ndertohet vetem me dy primitiva: CILINDER dhe KON.
// Cilinder/kon me 4 segmente rrethore japin prizem/piramide katrore,
// prandaj muret dhe çatia jane katrore, ndersa oxhaku dhe pema jane te rrumbullakta.

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fd3f5);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(6, 4.5, 9);

// ---------- Materialet ----------
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf2e4c9 });
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xb03a2e });
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x6b3f1d });
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x8fd0ff });
const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x8a4b3a });
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x7a4a21 });
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2e8b3d });
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x6abf5a });
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xc9b38a });

// Cilinder katror (4 segmente) me brinje te drejtuara sipas akseve.
// side = gjeresia e brinjes, height = lartesia
function squareCylinder(side, height, material) {
    const radius = side / Math.SQRT2;
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 4);
    geometry.rotateY(Math.PI / 4);
    return new THREE.Mesh(geometry, material);
}

const house = new THREE.Group();
scene.add(house);

// ---------- Toka (cilinder shume i sheshte) ----------
const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9, 0.3, 64),
    grassMaterial
);
ground.position.y = -0.15;
scene.add(ground);

// ---------- Muret (cilinder) ----------
const wallSide = 4;
const wallHeight = 2.6;
const walls = squareCylinder(wallSide, wallHeight, wallMaterial);
walls.position.y = wallHeight / 2;
house.add(walls);

// ---------- Çatia (kon) ----------
const roofHeight = 2;
const roofSide = wallSide + 0.8; // del pak jashte mureve
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(roofSide / Math.SQRT2, roofHeight, 4),
    roofMaterial
);
roof.rotation.y = Math.PI / 4;
roof.position.y = wallHeight + roofHeight / 2;
house.add(roof);

// ---------- Oxhaku (cilinder) + kapaku (kon i vogel) ----------
const chimney = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1.6, 24),
    chimneyMaterial
);
chimney.position.set(1.1, wallHeight + 1.3, -0.8);
house.add(chimney);

const chimneyCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 0.25, 24),
    roofMaterial
);
chimneyCap.position.set(1.1, wallHeight + 2.22, -0.8);
house.add(chimneyCap);

// ---------- Dera (cilinder katror i hollë) ----------
const doorHeight = 1.8;
const door = squareCylinder(1, doorHeight, doorMaterial);
door.scale.z = 0.1;
door.position.set(0, doorHeight / 2, wallSide / 2 + 0.03);
house.add(door);

// doreza e deres (cilinder i vogel i shtrire)
const knob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16),
    frameMaterial
);
knob.rotation.x = Math.PI / 2;
knob.position.set(0.3, 0.9, wallSide / 2 + 0.1);
house.add(knob);

// shtegu para deres (cilinder katror i sheshte)
const path = squareCylinder(1.2, 0.04, pathMaterial);
path.scale.z = 3.2;
path.position.set(0, 0.02, wallSide / 2 + 1.7);
scene.add(path);

// ---------- Dritaret (cilindra katror te hollë) ----------
function addWindow(x, y, z, rotationY) {
    const group = new THREE.Group();

    const frame = squareCylinder(1.1, 1.1, frameMaterial);
    frame.scale.z = 0.08;
    group.add(frame);

    const glass = squareCylinder(0.9, 0.9, windowMaterial);
    glass.scale.z = 0.12;
    group.add(glass);

    // kryqi i dritares
    const bar1 = squareCylinder(0.06, 0.9, frameMaterial);
    bar1.scale.z = 1;
    bar1.position.z = 0.04;
    group.add(bar1);

    const bar2 = squareCylinder(0.06, 0.9, frameMaterial);
    bar2.rotation.z = Math.PI / 2;
    bar2.position.z = 0.04;
    group.add(bar2);

    group.position.set(x, y, z);
    group.rotation.y = rotationY;
    house.add(group);
}

const half = wallSide / 2 + 0.03;
addWindow(-1.9 + 0.4, 1.5, half, 0);         // para, majtas nga dera
addWindow(1.9 - 0.4, 1.5, half, 0);          // para, djathtas nga dera
addWindow(0, 1.5, -half, Math.PI);           // pas
addWindow(half, 1.5, 0, Math.PI / 2);        // ane djathtas
addWindow(-half, 1.5, 0, -Math.PI / 2);      // ane majtas

// ---------- Pemet (cilinder = trung, kon = kurore) ----------
function addTree(x, z, scale = 1) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.25, 1, 16),
        trunkMaterial
    );
    trunk.position.y = 0.5;
    tree.add(trunk);

    // dy kone te vendosur njeri mbi tjetrin
    const lower = new THREE.Mesh(new THREE.ConeGeometry(1, 1.8, 24), leavesMaterial);
    lower.position.y = 1.7;
    tree.add(lower);

    const upper = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.5, 24), leavesMaterial);
    upper.position.y = 2.5;
    tree.add(upper);

    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);
    scene.add(tree);
}

addTree(-4.5, 2.5, 1.1);
addTree(4.8, 3, 0.9);
addTree(-5, -3, 1.3);
addTree(5, -3.5, 1);

// ---------- Drita ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
sunLight.position.set(6, 10, 8);
scene.add(sunLight);

// ---------- Renderer dhe kontrollet ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, 0);
controls.enableDamping = true;
controls.update();

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
