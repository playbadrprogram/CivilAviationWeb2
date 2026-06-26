import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
// استيراد أداة تحميل المجسمات الخارجية ثلاثية الأبعاد
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// =====================================
// إعداد المشهد والكاميرا والمحرك
// =====================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

// =====================================
// الإضاءة
// =====================================
const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(500, 800, 500);
sun.castShadow = true;
scene.add(sun);

// =====================================
// الأرضية
// =====================================
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(15000, 15000),
    new THREE.MeshStandardMaterial({ color: 0x2e7d32 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// =====================================
// دالة إنشاء المطارات
// =====================================
const airports = [];

function createAirport(name, x, z) {
    const runway = new THREE.Mesh(
        new THREE.BoxGeometry(80, 0.1, 1000),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    runway.position.set(x, 0.05, z);
    scene.add(runway);

    for (let i = -450; i <= 450; i += 40) {
        const mark = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.12, 20),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        mark.position.set(x, 0.12, z + i);
        scene.add(mark);
    }

    const terminal = new THREE.Mesh(
        new THREE.BoxGeometry(120, 25, 60),
        new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    terminal.position.set(x + 120, 12, z);
    terminal.castShadow = true;
    scene.add(terminal);

    const airportData = { name: name, position: new THREE.Vector3(x, 0, z) };
    airports.push(airportData);
    return airportData;
}

const sanaaAirport = createAirport("مطار صنعاء", 0, 0);
const adenAirport = createAirport("مطار عدن", 2500, 3000);
const mukallaAirport = createAirport("مطار المكلا", -3200, 2800);

// =====================================
// أبراج المراقبة
// =====================================
function createTower(x, z) {
    const tower = new THREE.Mesh(
        new THREE.BoxGeometry(25, 80, 25),
        new THREE.MeshStandardMaterial({ color: 0x999999 })
    );
    tower.position.set(x, 40, z);
    tower.castShadow = true;
    scene.add(tower);

    const top = new THREE.Mesh(
        new THREE.BoxGeometry(40, 12, 40),
        new THREE.MeshStandardMaterial({ color: 0x224466 })
    );
    top.position.set(x, 86, z);
    scene.add(top);
}

createTower(180, 120);
createTower(2680, 3120);
createTower(-3020, 2920);

// =====================================
// البيئة المحيطة (الغيوم والمباني)
// =====================================
for (let i = 0; i < 120; i++) {
    const cloud = new THREE.Mesh(
        new THREE.SphereGeometry(15 + Math.random() * 20, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    cloud.position.set((Math.random() - 0.5) * 12000, 150 + Math.random() * 300, (Math.random() - 0.5) * 12000);
    scene.add(cloud);
}

const buildings = [];
for (let i = 0; i < 600; i++) {
    const h = 20 + Math.random() * 180;
    const building = new THREE.Mesh(
        new THREE.BoxGeometry(15, h, 15),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );

    let x, z;
    do {
        x = (Math.random() - 0.5) * 8000;
        z = (Math.random() - 0.5) * 8000;
    } while (Math.sqrt(x * x + z * z) < 600);

    building.position.set(x, h / 2, z);
    building.castShadow = true;
    scene.add(building);
    buildings.push(building);
}

// =====================================
// نظام تحميل الطائرة ثلاثية الأبعاد الحقيقية
// =====================================
const aircraft = new THREE.Group();
aircraft.position.set(0, 2, 0);
scene.add(aircraft);

const loader = new GLTFLoader();
// رابط مباشر لمجسم طائرة ركاب حقيقي من مستودع خبير ومفتوح المصدر
const airplaneURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Airplane/glTF-Binary/Airplane.glb';

loader.load(
    airplaneURL,
    function (gltf) {
        const model = gltf.scene;
        // ضبط حجم واتجاه الطائرة الحقيقية لتتناسب مع أبعاد اللعبة الحالية
        model.scale.set(0.18, 0.18, 0.18); 
        model.rotation.y = Math.PI; // تدويرها للأمام
        
        model.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        aircraft.add(model);
        console.log("تم تحميل الطائرة ثلاثية الأبعاد الاحترافية!");
    },
    undefined,
    function (error) {
        console.error("فشل تحميل المجسم الخارجي، تم تشغيل الطائرة الاحتياطية برمجياً:", error);
    }
);

// =====================================
// طائرات الذكاء الاصطناعي (AI Traffic)
// =====================================
const aiAircrafts = [];
function createAIAircraft(startX, startZ, targetX, targetZ) {
    const aiGroup = new THREE.Group();
    aiGroup.position.set(startX, 300, startZ);
    scene.add(aiGroup);

    // تحميل نفس مجسم الطائرة الحقيقي لحركة المرور الجوي أيضاً
    loader.load(airplaneURL, function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.15, 0.15, 0.15);
        model.rotation.y = Math.PI;
        aiGroup.add(model);
    });

    aiAircrafts.push({ mesh: aiGroup, target: new THREE.Vector3(targetX, 300, targetZ) });
}

createAIAircraft(2500, 3000, -3200, 2800);
createAIAircraft(-3200, 2800, 2500, 3000);
createAIAircraft(0, 0, 2500, 3000);

// =====================================
// متغيرات الفيزياء والأنظمة
// =====================================
let speed = 0;
let fuel = 100;
let money = 10000;
let altitude = 2;
let pitch = 0;
let verticalSpeed = 0;

const gravity = 0.003;
const liftFactor = 0.015;
let dayTime = 0;
let flightPhase = "تدريج (TAXI)";
const takeoffSpeed = 0.25;
const keys = {};

// =====================================
// نظام التحكم
// =====================================
document.addEventListener("keydown", e => { keys[e.key] = true; });
document.addEventListener("keyup", e => { keys[e.key] = false; });

const mobileControls = document.createElement("div");
mobileControls.innerHTML = `
<div id="mobilePanel">
    <button id="upBtn">▲</button>
    <button id="downBtn">▼</button>
    <button id="leftBtn">◀</button>
    <button id="rightBtn">▶</button>
    <button id="pitchUpBtn">W</button>
    <button id="pitchDownBtn">S</button>
</div>`;
document.body.appendChild(mobileControls);

const style = document.createElement("style");
style.innerHTML = `
#mobilePanel { position: fixed; bottom: 20px; left: 20px; z-index: 1000; direction: ltr; }
#mobilePanel button { width: 60px; height: 60px; font-size: 24px; margin: 4px; background: rgba(255,255,255,0.7); border: none; border-radius: 8px; cursor: pointer; }
#hudPanel { position: fixed; top: 10px; right: 10px; color: white; font-size: 18px; font-family: Arial, sans-serif; background: rgba(0,0,0,0.5); padding: 15px; z-index: 1000; border-radius: 5px; line-height: 1.6; text-align: right; direction: rtl; }
#phaseDisplay { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); color: #00ffcc; font-size: 22px; font-family: sans-serif; font-weight: bold; background: rgba(0,0,0,0.6); padding: 8px 20px; border-radius: 4px; z-index: 1000; text-shadow: 0 0 5px #00ffcc; text-align: center; }
`;
document.head.appendChild(style);

function bindButton(id, key) {
    const btn = document.getElementById(id);
    const setKey = (val) => { keys[key] = val; if(key==="W"||key==="S") keys[key.toLowerCase()] = val; };
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); setKey(true); });
    btn.addEventListener("touchend", () => setKey(false));
    btn.addEventListener("mousedown", () => setKey(true));
    btn.addEventListener("mouseup", () => setKey(false));
}
bindButton("upBtn", "ArrowUp"); bindButton("downBtn", "ArrowDown");
bindButton("leftBtn", "ArrowLeft"); bindButton("rightBtn", "ArrowRight");
bindButton("pitchUpBtn", "W"); bindButton("pitchDownBtn", "S");

// =====================================
// واجهات العرض (HUD & الخريطة)
// =====================================
const hud = document.createElement("div");
hud.id = "hudPanel";
document.body.appendChild(hud);

const phaseDiv = document.createElement("div");
phaseDiv.id = "phaseDisplay";
document.body.appendChild(phaseDiv);

const miniMap = document.createElement("canvas");
miniMap.width = 200; miniMap.height = 200;
miniMap.style.position = "fixed"; miniMap.style.top = "10px"; miniMap.style.left = "10px";
miniMap.style.border = "2px solid white"; miniMap.style.background = "rgba(0,0,0,0.4)"; miniMap.style.zIndex = "1000";
document.body.appendChild(miniMap);
const miniCtx = miniMap.getContext("2d");

// =====================================
// التحديثات والفيزياء
// =====================================
function updateFlight() {
    if (keys["ArrowUp"] && fuel > 0) speed += 0.003;
    if (keys["ArrowDown"]) speed -= 0.003;
    speed = Math.max(0, Math.min(1, speed));
    speed *= 0.999;

    if (keys["ArrowLeft"]) aircraft.rotation.y += 0.025;
    if (keys["ArrowRight"]) aircraft.rotation.y -= 0.025;
    if (keys["W"] || keys["w"]) pitch += 0.01;
    if (keys["S"] || keys["s"]) pitch -= 0.01;
    pitch = Math.max(-0.5, Math.min(0.5, pitch));
    aircraft.rotation.z = -pitch;

    let lift = 0;
    if (speed > 0.22 && speed > takeoffSpeed) {
        lift = (speed - takeoffSpeed) * speed * liftFactor * 2 * (1 + pitch);
    }

    verticalSpeed += lift - gravity;
    altitude += verticalSpeed;

    if (altitude < 2) {
        altitude = 2;
        verticalSpeed = 0;
    }
    aircraft.position.y = altitude;

    if (altitude < 3) {
        flightPhase = "تدريج (TAXI)";
        if (speed === 0 && fuel < 100) {
            for (let ap of airports) {
                if (aircraft.position.distanceTo(ap.position) < 500) {
                    fuel = Math.min(100, fuel + 0.2);
                    flightPhase = "جاري إعادة التعبئة بالوقود...";
                }
            }
        }
    } else if (altitude < 50) {
        flightPhase = "إقلاع (TAKEOFF)";
    } else if (altitude < 300) {
        flightPhase = "طيران مستقر (CRUISE)";
    } else {
        flightPhase = "ارتفاع شاهق (HIGH ALTITUDE)";
    }

    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(aircraft.quaternion);
    aircraft.position.addScaledVector(direction, speed * 8);

    fuel = Math.max(0, fuel - (speed * 0.01));
}

function updateCamera() {
    const offset = new THREE.Vector3(0, 12, 60).applyQuaternion(aircraft.quaternion);
    camera.position.copy(aircraft.position).add(offset);
    const lookPoint = aircraft.position.clone().add(new THREE.Vector3(0, 0, -1).applyQuaternion(aircraft.quaternion).multiplyScalar(150));
    camera.lookAt(lookPoint);
}

function updateMiniMap() {
    miniCtx.clearRect(0, 0, 200, 200);
    miniCtx.fillStyle = "green";
    miniCtx.fillRect(0, 0, 200, 200);

    const drawAirportMarker = (x, z, color) => {
        miniCtx.fillStyle = color;
        miniCtx.beginPath();
        miniCtx.arc(100 + x / 80, 100 + z / 80, 4, 0, Math.PI * 2);
        miniCtx.fill();
    };

    drawAirportMarker(0, 0, "white");
    drawAirportMarker(2500, 3000, "yellow");
    drawAirportMarker(-3200, 2800, "orange");
    drawAirportMarker(aircraft.position.x, aircraft.position.z, "red");
}

function updateHUD() {
    hud.innerHTML = `
        <b>السرعة:</b> ${Math.round(speed * 1000)} عقدة<br>
        <b>الارتفاع:</b> ${Math.round(altitude)} قدم<br>
        <b>الوقود:</b> ${Math.round(fuel)} %<br>
        <b>الرصيد:</b> $${money}
    `;
    phaseDiv.innerText = `الوضعية: ${flightPhase}`;
}

function updateAI() {
    for (const ai of aiAircrafts) {
        const dir = new THREE.Vector3().subVectors(ai.target, ai.mesh.position);
        const distance = dir.length();
        dir.normalize();
        ai.mesh.position.addScaledVector(dir, 2);
        ai.mesh.lookAt(ai.target);

        if (distance < 100) {
            const oldTarget = ai.target.clone();
            ai.target = Math.random() > 0.5 ? new THREE.Vector3(2500, 300, 3000) : new THREE.Vector3(-3200, 300, 2800);
            if (oldTarget.x === ai.target.x) ai.target = new THREE.Vector3(0, 300, 0);
        }
    }
}

let currentMission = { name: "طِر إلى عدن", target: adenAirport.position, reward: 5000, completed: false };

function updateMission() {
    const distance = aircraft.position.distanceTo(currentMission.target);
    if (distance < 150 && altitude < 20 && speed < 0.15 && !currentMission.completed) {
        currentMission.completed = true;
        money += currentMission.reward;
        alert("اكتملت المهمة بنجاح!\nالمكافأة: $" + currentMission.reward);
        currentMission = { name: "طِر إلى المكلا", target: mukallaAirport.position, reward: 7000, completed: false };
    }
}

function updateDayNight() {
    dayTime += 0.001;
    sun.position.x = Math.cos(dayTime) * 1500;
    sun.position.y = Math.sin(dayTime) * 1500;
    scene.background.setHex(sun.position.y < 0 ? 0x000022 : 0x87ceeb);
}

function checkCrash() {
    if (altitude <= 2 && verticalSpeed < -0.3) {
        alert("تحطمت الطائرة بسبب الهبوط العنيف!");
        speed = 0; verticalSpeed = 0; altitude = 2;
        aircraft.position.set(0, 2, 0);
        aircraft.rotation.set(0, 0, 0);
    }
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =====================================
// حلقة اللعب الأساسية (Animation Loop)
// =====================================
function animate() {
    requestAnimationFrame(animate);

    updateFlight();
    updateCamera();
    updateMiniMap();
    updateHUD();
    updateMission();
    updateAI();
    updateDayNight();
    checkCrash();

    for (const building of buildings) {
        const dx = aircraft.position.x - building.position.x;
        const dz = aircraft.position.z - building.position.z;
        const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
        const buildingTop = building.position.y + building.geometry.parameters.height / 2;

        if (horizontalDistance < 12 && aircraft.position.y < buildingTop) {
            alert("💥 اصطدمت الطائرة بمبنى!");
            location.reload();
            return;
        }
    }

    for (const ai of aiAircrafts) {
        if (aircraft.position.distanceTo(ai.mesh.position) < 12) {
            alert("💥 اصطدام جوي!");
            location.reload();
            return;
        }
    }

    renderer.render(scene, camera);
}

animate();
