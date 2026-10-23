import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);


const armMaterial = new THREE.MeshStandardMaterial({color: 0x3399ff});
const jointMaterial = new THREE.MeshStandardMaterial({color: 0x555555});
const handMaterial = new THREE.MeshStandardMaterial({color: 0xffaa55});
const fingerMaterial = new THREE.MeshStandardMaterial({color: 0xffcc88});


const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);

scene.add(base);


const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);


const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), jointMaterial);

shoulder.add(shoulderJoint);


const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial);

upperArm.position.y = 1.5;

shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), jointMaterial);

elbow.add(elbowJoint);

const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), armMaterial);

forearm.position.y = 1.25;

elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);


const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), jointMaterial);

wrist.add(wristJoint);

const palm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.4), handMaterial);
palm.position.y = 0.9;

wrist.add(palm);


// Secili gisht ka madhesi te vetat (gjatesi dhe trashesi) dhe dy falange
// (baza dhe maja), qe perkulen te dyja kur gishti lëviz.
// Gishti i madh (thumb) eshte ne anen e majte te shputes.
const fingerConfigs = [
    { name: 'thumb',  length: 0.8,  width: 0.3,  x: -0.9,  y: -0.1, tilt: 60 },
    { name: 'index',  length: 1.0,  width: 0.24, x: -0.6,  y: 0.75, tilt: 0 },
    { name: 'middle', length: 1.2,  width: 0.26, x: -0.2,  y: 0.75, tilt: 0 },
    { name: 'ring',   length: 1.05, width: 0.24, x: 0.2,   y: 0.75, tilt: 0 },
    { name: 'pinky',  length: 0.75, width: 0.2,  x: 0.6,   y: 0.75, tilt: 0 }
];

const fingers = [];   // { base, tip, curl, target }

fingerConfigs.forEach(function(config) {

    const baseLength = config.length * 0.55;
    const tipLength = config.length * 0.45;

    // nyja e bazes (kyçi i gishtit me shputen)
    const base = new THREE.Group();
    base.rotation.order = 'ZXY'; // fillimisht perkulet, pastaj anohet
    base.position.set(config.x, config.y, 0);
    base.rotation.z = THREE.MathUtils.degToRad(config.tilt);
    palm.add(base);

    const baseSegment = new THREE.Mesh(
        new THREE.BoxGeometry(config.width, baseLength, config.width),
        fingerMaterial
    );
    baseSegment.position.y = baseLength / 2;
    base.add(baseSegment);

    // nyja e majes (kyçi i dyte)
    const tip = new THREE.Group();
    tip.position.y = baseLength;
    base.add(tip);

    const tipSegment = new THREE.Mesh(
        new THREE.BoxGeometry(config.width * 0.9, tipLength, config.width * 0.9),
        fingerMaterial
    );
    tipSegment.position.y = tipLength / 2;
    tip.add(tipSegment);

    fingers.push({
        name: config.name,
        base: base,
        tip: tip,
        curl: 0,      // vlera aktuale 0 (hapur) ... 1 (i mbyllur)
        target: 0     // vlera qe don te arrije
    });
});

// Sa graden perkulet gishti kur eshte plotesisht i mbyllur
const maxBaseCurl = THREE.MathUtils.degToRad(80);
const maxTipCurl = THREE.MathUtils.degToRad(90);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0xcccccc
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;

scene.add(ground);
 
const grid = new THREE.GridHelper(
    20,
    20
);

scene.add(grid);

 
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.getElementById('scene').appendChild(renderer.domElement);

 
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.target.set(0, 3, 0);

controls.enableDamping = true;

controls.update();


shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);

window.addEventListener('keydown', function(event) {

    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulder.rotation.z += rotationStep;
    }

    if (key === 'a') {
        shoulder.rotation.z -= rotationStep;
    }

    if (key === 'w') {
        elbow.rotation.z += rotationStep;
    }

    if (key === 's') {
        elbow.rotation.z -= rotationStep;
    }

    if (key === 'e') {
        wrist.rotation.z += rotationStep;
    }

    if (key === 'd') {
        wrist.rotation.z -= rotationStep;
    }

    // Gishtat: 1 = i madhi, 2 = tregues, 3 = i mesit, 4 = i unazes, 5 = i vogli
    // (cdo shtypje e hap ose e mbyll gishtin perkates)
    if (key >= '1' && key <= '5') {
        const finger = fingers[Number(key) - 1];
        finger.target = finger.target > 0.5 ? 0 : 1;
    }

    // F = mbyll grushtin, G = hap doren
    if (key === 'f') {
        fingers.forEach(function(finger) { finger.target = 1; });
    }

    if (key === 'g') {
        fingers.forEach(function(finger) { finger.target = 0; });
    }

});

function animate() {

    requestAnimationFrame(animate);

    // levizje e lëmuar e gishtave drejt vleres qe duam (target)
    fingers.forEach(function(finger) {
        finger.curl += (finger.target - finger.curl) * 0.15;
        finger.base.rotation.x = finger.curl * maxBaseCurl;
        finger.tip.rotation.x = finger.curl * maxTipCurl;
    });

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();