import './style.css'
import './timeline.css'
import './reset.css'
import './bootstrap.min.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

const dev_mode = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Portal light material
const emissionMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

/**
 * Model
 */
gltfLoader.load(
    'room.glb',
    (roomGLB) =>
    {
        roomGLB.scene.rotation.y = 135
        scene.add(roomGLB.scene)

        // Get each object
        const bakedMesh = roomGLB.scene.children.find((child) => child.name === 'baked')
        const emissionDoorMesh = roomGLB.scene.children.find((child) => child.name === 'emissionDoor')
        const emissionWindowMesh = roomGLB.scene.children.find((child) => child.name === 'emissionWindow')

        // Apply materials
        bakedMesh.material = bakedMaterial
        emissionDoorMesh.material = emissionMaterial
        emissionWindowMesh.material = emissionMaterial
    }
)

let mixer = null

gltfLoader.load(
    'animations.glb',
    (animationsGLB) =>
    {
        animationsGLB.scene.rotation.y = 135
        scene.add(animationsGLB.scene)
    
        // Animation
        mixer = new THREE.AnimationMixer(animationsGLB.scene)
        const animCharbonA = mixer.clipAction(animationsGLB.animations[0])
        const animBaguette = mixer.clipAction(animationsGLB.animations[1])
        const animPotDeCendre = mixer.clipAction(animationsGLB.animations[2])
        const animCuillere = mixer.clipAction(animationsGLB.animations[3])
        const animBouilloire = mixer.clipAction(animationsGLB.animations[4])
        const animCouvercleBouilloire = mixer.clipAction(animationsGLB.animations[5])
        const animCuillereEau = mixer.clipAction(animationsGLB.animations[6])
        const animBolMatcha = mixer.clipAction(animationsGLB.animations[7])
        const animTouillette = mixer.clipAction(animationsGLB.animations[8])
        const animSphere = mixer.clipAction(animationsGLB.animations[9])
        const animCharbonB = mixer.clipAction(animationsGLB.animations[10])

        animBaguette.setLoop(THREE.LoopRepeat, 1)
        animBaguette.play()
        animCharbonB.setLoop(THREE.LoopRepeat, 1)
        animCharbonB.play()
        animCharbonA.setLoop(THREE.LoopRepeat, 1)
        animCharbonA.play()

        mixer.addEventListener( 'finished', (e) => {

            if (e.action._clip.name == "baguette")
            {
                animPotDeCendre.setLoop(THREE.LoopRepeat , 1);
                animPotDeCendre.play();
                animCuillere.setLoop(THREE.LoopRepeat , 1);
                animCuillere.play();
            }
            else if (e.action._clip.name == "Cuillere")
            {
                animBouilloire.setLoop(THREE.LoopRepeat , 1);
                animBouilloire.play();
                animCouvercleBouilloire.setLoop(THREE.LoopRepeat , 1);
                animCouvercleBouilloire.play();
                animSphere.setLoop(THREE.LoopRepeat , 1);
                animSphere.play();
            }
            else if (e.action._clip.name == "couvercle_bouilloire")
            {
                animCuillereEau.setLoop(THREE.LoopRepeat , 1);
                animCuillereEau.play();
            }
            else if (e.action._clip.name == "cuillere_eau")
            {
                animBolMatcha.setLoop(THREE.LoopRepeat , 1);
                animBolMatcha.play();
            }
            else if (e.action._clip.name == "bol_matcha")
            {
                animTouillette.setLoop(THREE.LoopRepeat , 1);
                animTouillette.play();
            }
            else if (e.action._clip.name == "Touilette")
            {
                e.target.stopAllAction()
                animBaguette.setLoop(THREE.LoopRepeat, 1)
                animBaguette.play()
                animCharbonB.setLoop(THREE.LoopRepeat, 1)
                animCharbonB.play()
                animCharbonA.setLoop(THREE.LoopRepeat, 1)
                animCharbonA.play()
            }
        } );
    }
)

/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
 scene.add(ambientLight)
 
 const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
 directionalLight.castShadow = true
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.camera.left = - 7
 directionalLight.shadow.camera.top = 7
 directionalLight.shadow.camera.right = 7
 directionalLight.shadow.camera.bottom = - 7
 directionalLight.position.set(- 5, 5, 0)
 scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100.0)
camera.position.set(3.0, 2.5, -2.6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.5;
controls.minAzimuthAngle = Math.PI  * 0.5;
controls.maxAzimuthAngle = Math.PI;
controls.target.set(0, 2, 0)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Debug
 */
 const gui = new dat.GUI({
    width: 400
})

if (!dev_mode) {
    gui.destroy()
}

var debug = new function () {
    this.cameraX = camera.position.x;
    this.cameraY = camera.position.y;
    this.cameraZ = camera.position.z;
}
gui.add(debug, 'cameraX', -10, 10);
gui.add(debug, 'cameraY', -10, 10);
gui.add(debug, 'cameraZ', -10, 10);


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    if (dev_mode) {
        camera.position.x = debug.cameraX;
        camera.position.y = debug.cameraY;
        camera.position.z = debug.cameraZ;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Fonction listener interaction avec un objet
 */
function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(scene.children[4].children, true);
    console.log("click")

    if (intersects.length > 0) {
        console.log("1")

        intersects[0].object.material.transparent = !intersects[0].object.material.transparent;

        if(!intersects[0].object.parent.selected)
        {
            console.log("2")
            document.getElementById("music").play(); 
            document.getElementById('info').style.display = "block";
            document.getElementById('info').innerText = intersects[0].object.parent.description;
            intersects[0].object.material.opacity = 0.1;
        }
        else
        {
            console.log("3")
            document.getElementById('info').style.display = "none";
            intersects[0].object.material.opacity = 1;
        }

        intersects[0].object.parent.selected = !intersects[0].object.parent.selected;
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
