import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// =====================================
// SCENE
// =====================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera =
new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
20000
);

const renderer =
new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

document.body.appendChild(
renderer.domElement
);

// =====================================
// LIGHTS
// =====================================

const ambient =
new THREE.AmbientLight(
0xffffff,
0.8
);

scene.add(ambient);

const sun =
new THREE.DirectionalLight(
0xffffff,
1.5
);

sun.position.set(
500,
800,
500
);

sun.castShadow = true;

scene.add(sun);

// =====================================
// GROUND
// =====================================

const ground =
new THREE.Mesh(
new THREE.PlaneGeometry(
15000,
15000
),
new THREE.MeshStandardMaterial({
color:0x2e7d32
})
);

ground.rotation.x =
-Math.PI/2;

ground.receiveShadow = true;

scene.add(ground);

// =====================================
// AIRPORT
// =====================================

function createAirport(
name,
x,
z
)
{
const runway =
new THREE.Mesh(
new THREE.BoxGeometry(
80,
0.1,
1000
),
new THREE.MeshStandardMaterial({
color:0x333333
})
);

runway.position.set(
x,
0.05,
z
);

scene.add(runway);

for(
let i=-450;
i<=450;
i+=40
)
{
const mark =
new THREE.Mesh(
new THREE.BoxGeometry(
4,
0.12,
20
),
new THREE.MeshStandardMaterial({
color:0xffffff
})
);

mark.position.set(
x,
0.12,
z+i
);

scene.add(mark);
}

const terminal =
new THREE.Mesh(
new THREE.BoxGeometry(
120,
25,
60
),
new THREE.MeshStandardMaterial({
color:0xcccccc
})
);

terminal.position.set(
x+120,
12,
z
);

terminal.castShadow = true;

scene.add(
terminal
);

return {
name:name,
position:new THREE.Vector3(
x,
0,
z
)
};
}

// =====================================
// AIRPORTS
// =====================================

const sanaaAirport =
createAirport(
"SANAA",
0,
0
);

const adenAirport =
createAirport(
"ADEN",
2500,
3000
);

const mukallaAirport =
createAirport(
"MUKALLA",
-3200,
2800
);

// =====================================
// CONTROL TOWER
// =====================================

function createTower(
x,
z
)
{
const tower =
new THREE.Mesh(
new THREE.BoxGeometry(
25,
80,
25
),
new THREE.MeshStandardMaterial({
color:0x999999
})
);

tower.position.set(
x,
40,
z
);

tower.castShadow = true;

scene.add(tower);

const top =
new THREE.Mesh(
new THREE.BoxGeometry(
40,
12,
40
),
new THREE.MeshStandardMaterial({
color:0x224466
})
);

top.position.set(
x,
86,
z
);

scene.add(top);
}

createTower(
180,
120
);

createTower(
2680,
3120
);

createTower(
-3020,
2920
);

// =====================================
// CLOUDS
// =====================================

for(
let i=0;
i<120;
i++
)
{
const cloud =
new THREE.Mesh(
new THREE.SphereGeometry(
15 + Math.random()*20,
12,
12
),
new THREE.MeshStandardMaterial({
color:0xffffff
})
);

cloud.position.set(
(Math.random()-0.5)*12000,
150+Math.random()*300,
(Math.random()-0.5)*12000
);

scene.add(cloud);
}

// =====================================
// CITY BUILDINGS
// =====================================
const buildings = [];
for(
let i=0;
i<600;
i++
)
{
const h =
20 + Math.random()*180;

const building =
new THREE.Mesh(
new THREE.BoxGeometry(
15,
h,
15
),
new THREE.MeshStandardMaterial({
color:0x777777
})
);

const x =
(Math.random()-0.5)*8000;

const z =
(Math.random()-0.5)*8000;

building.position.set(
x,
h/2,
z
);

building.castShadow = true;

scene.add(building);
    buildings.push(building);
}

// =====================================
// AIRCRAFT
// =====================================

function createAircraft()
{
const aircraft =
new THREE.Group();

const material =
new THREE.MeshStandardMaterial({
color:0xf5f5f5
});

const body =
new THREE.Mesh(
new THREE.CylinderGeometry(
1,
1,
24,
24
),
material
);

body.rotation.z =
Math.PI/2;

aircraft.add(body);

const nose =
new THREE.Mesh(
new THREE.ConeGeometry(
1,
4,
24
),
material
);

nose.rotation.z =
-Math.PI/2;

nose.position.x = 14;

aircraft.add(nose);

const wing =
new THREE.Mesh(
new THREE.BoxGeometry(
28,
0.4,
6
),
material
);

aircraft.add(wing);

const tailWing =
new THREE.Mesh(
new THREE.BoxGeometry(
10,
0.3,
3
),
material
);

tailWing.position.set(
-10,
0,
0
);

aircraft.add(tailWing);

const fin =
new THREE.Mesh(
new THREE.BoxGeometry(
0.5,
4,
3
),
new THREE.MeshStandardMaterial({
color:0xff3333
})
);

fin.position.set(
-10,
3,
0
);

aircraft.add(fin);

// engines

for(let i=-1;i<=1;i+=2)
{
const engine =
new THREE.Mesh(
new THREE.CylinderGeometry(
1.2,
1.2,
4,
20
),
new THREE.MeshStandardMaterial({
color:0x444444
})
);

engine.rotation.z =
Math.PI/2;

engine.position.set(
0,
-1,
i*5
);

aircraft.add(engine);
}

// landing gears

for(let i=-1;i<=1;i+=2)
{
const wheel =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.7,
0.7,
0.5,
16
),
new THREE.MeshStandardMaterial({
color:0x111111
})
);

wheel.rotation.z =
Math.PI/2;

wheel.position.set(
-2,
-1.2,
i*2
);

aircraft.add(wheel);
}

const noseWheel =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.6,
0.6,
0.4,
16
),
new THREE.MeshStandardMaterial({
color:0x111111
})
);

noseWheel.rotation.z =
Math.PI/2;

noseWheel.position.set(
8,
-1.2,
0
);

aircraft.add(
noseWheel
);

return aircraft;
}

const aircraft =
createAircraft();

aircraft.position.set(
0,
2,
0
);
aircraft.scale.set(
0.25,
0.25,
0.25
);

scene.add(
aircraft
);

// =====================================
// VARIABLES
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
let isFlying = false;

let flightPhase = "TAXI";

const takeoffSpeed = 0.25;

const landingSpeedLimit = 0.18;

const keys = {};


/////____<_<__<<<
/////____<_>__<<<2

//
// =====================================
// KEYBOARD CONTROL
// =====================================
//

document.addEventListener(
"keydown",
e=>{
keys[e.key]=true;
}
);

document.addEventListener(
"keyup",
e=>{
keys[e.key]=false;
}
);

//
// =====================================
// MOBILE CONTROLS
// =====================================
//

const mobileControls =
document.createElement("div");

mobileControls.innerHTML = `
<div id="mobilePanel">

<button id="upBtn">▲</button>
<button id="downBtn">▼</button>
<button id="leftBtn">◀</button>
<button id="rightBtn">▶</button>

<button id="pitchUpBtn">W</button>
<button id="pitchDownBtn">S</button>

</div>
`;

document.body.appendChild(
mobileControls
);

const style =
document.createElement("style");

style.innerHTML = `
#mobilePanel{
position:fixed;
bottom:20px;
left:20px;
z-index:1000;
}

#mobilePanel button{
width:60px;
height:60px;
font-size:24px;
margin:4px;
}
`;

document.head.appendChild(
style
);

function bindButton(
id,
key
)
{
const btn =
document.getElementById(id);

btn.addEventListener(
"touchstart",
()=>{
keys[key]=true;
}
);

btn.addEventListener(
"touchend",
()=>{
keys[key]=false;
}
);

btn.addEventListener(
"mousedown",
()=>{
keys[key]=true;
}
);

btn.addEventListener(
"mouseup",
()=>{
keys[key]=false;
}
);
}

bindButton(
"upBtn",
"ArrowUp"
);

bindButton(
"downBtn",
"ArrowDown"
);

bindButton(
"leftBtn",
"ArrowLeft"
);

bindButton(
"rightBtn",
"ArrowRight"
);

bindButton(
"pitchUpBtn",
"W"
);

bindButton(
"pitchDownBtn",
"S"
);

//
// =====================================
// HUD
// =====================================
//

const hud =
document.createElement("div");

hud.style.position =
"fixed";

hud.style.top =
"10px";

hud.style.left =
"10px";

hud.style.color =
"white";

hud.style.fontSize =
"18px";

hud.style.fontFamily =
"Arial";

hud.style.background =
"rgba(0,0,0,0.4)";

hud.style.padding =
"10px";

hud.style.zIndex =
"1000";

document.body.appendChild(
hud
);

//
// =====================================
// MINI MAP
// =====================================
//

const miniMap =
document.createElement("canvas");

miniMap.width = 200;
miniMap.height = 200;

miniMap.style.position =
"fixed";

miniMap.style.top =
"10px";

miniMap.style.right =
"10px";

miniMap.style.border =
"2px solid white";

miniMap.style.background =
"rgba(0,0,0,0.4)";

document.body.appendChild(
miniMap
);

const miniCtx =
miniMap.getContext("2d");

//
// =====================================
// FLIGHT PHYSICS
// =====================================
//

function updateFlight()
{

// throttle

if(
keys["ArrowUp"] &&
fuel > 0
)
{
speed += 0.003;
}

if(
keys["ArrowDown"]
)
{
speed -= 0.003;
}

speed =
Math.max(
0,
Math.min(
1,
speed
)
);

// drag

speed *= 0.999;

// turn

if(
keys["ArrowLeft"]
)
{
aircraft.rotation.y +=
0.025;
}

if(
keys["ArrowRight"]
)
{
aircraft.rotation.y -=
0.025;
}

// pitch

if(
keys["W"] ||
keys["w"]
)
{
pitch += 0.01;
}

if(
keys["S"] ||
keys["s"]
)
{
pitch -= 0.01;
}

pitch =
Math.max(
-0.5,
Math.min(
0.5,
pitch
)
);

aircraft.rotation.z =
-pitch;

// lift





// لا يمكن الإقلاع إلا بعد الوصول لسرعة كافية
if(speed > 0.22)
{
    let lift = 0;

if(speed > takeoffSpeed)
{
    lift =
    (speed - takeoffSpeed) *
    speed *
    liftFactor *
    2 *
    (1 + pitch);
}
}
  ///_____
  //=========

verticalSpeed +=
lift;

verticalSpeed -=
gravity;

altitude +=
verticalSpeed;

if(
altitude < 2
)
{
altitude = 2;
verticalSpeed = 0;
}

aircraft.position.y =
altitude;


    if(altitude < 3)
{
    flightPhase = "TAXI";
}
else if(altitude < 50)
{
    flightPhase = "TAKEOFF";
}
else if(altitude < 300)
{
    flightPhase = "CRUISE";
}
else
{
    flightPhase = "HIGH ALTITUDE";
}

// direction

const direction =
new THREE.Vector3(
0,
0,
-1
);

direction.applyQuaternion(
aircraft.quaternion
);

aircraft.position.addScaledVector(
direction,
speed * 8
);

// fuel

fuel -=
speed * 0.01;

fuel =
Math.max(
0,
fuel
);
}

//
// =====================================
// CAMERA SYSTEM
// =====================================
//

function updateCamera()
{
const offset =
new THREE.Vector3(
0,
12,
60
);

offset.applyQuaternion(
aircraft.quaternion
);

camera.position.copy(
aircraft.position
).add(
offset
);

const lookPoint =
aircraft.position.clone();

const direction =
new THREE.Vector3(
0,
0,
-1
);

direction.applyQuaternion(
aircraft.quaternion
);

lookPoint.add(
direction.multiplyScalar(
150
)
);

camera.lookAt(
lookPoint
);
}

//
// =====================================
// MINI MAP UPDATE
// =====================================
//

function updateMiniMap()
{
miniCtx.clearRect(
0,
0,
200,
200
);

miniCtx.fillStyle =
"green";

miniCtx.fillRect(
0,
0,
200,
200
);

function drawAirport(
x,
z,
color
)
{
miniCtx.fillStyle =
color;

miniCtx.beginPath();

miniCtx.arc(
100 + x/80,
100 + z/80,
4,
0,
Math.PI*2
);

miniCtx.fill();
}

drawAirport(
0,
0,
"white"
);

drawAirport(
2500,
3000,
"yellow"
);

drawAirport(
-3200,
2800,
"orange"
);

miniCtx.fillStyle =
"red";

miniCtx.beginPath();

miniCtx.arc(
100 +
aircraft.position.x/80,
100 +
aircraft.position.z/80,
4,
0,
Math.PI*2
);

miniCtx.fill();
}

//
// =====================================
// HUD UPDATE
// =====================================
//

function updateHUD()
{
hud.innerHTML = `
Speed:
${Math.round(speed*1000)}
<br>

Altitude:
${Math.round(altitude)}
<br>

Fuel:
${Math.round(fuel)}
%
<br>

Money:
$${money}
`;
}

////________
////________ 3

//
// =====================================
// AI AIRCRAFT
// =====================================
//

const aiAircrafts = [];

function createAIAircraft(
startX,
startZ,
targetX,
targetZ
)
{
const ai =
createAircraft();

ai.scale.set(
0.8,
0.8,
0.8
);

ai.position.set(
startX,
300,
startZ
);

scene.add(ai);

aiAircrafts.push({
mesh:ai,
target:new THREE.Vector3(
targetX,
300,
targetZ
)
});
}

createAIAircraft(
2500,
3000,
-3200,
2800
);

createAIAircraft(
-3200,
2800,
2500,
3000
);

createAIAircraft(
0,
0,
2500,
3000
);

//
// =====================================
// MISSIONS
// =====================================
//

let currentMission =
{
name:"Fly To Aden",
target:adenAirport.position,
reward:5000,
completed:false
};

function updateMission()
{
const distance =
aircraft.position.distanceTo(
currentMission.target
);

if(
distance < 150 &&
altitude < 20 &&
speed < 0.15 &&
!currentMission.completed
)
{
currentMission.completed =
true;

money +=
currentMission.reward;

alert(
"Mission Completed!\nReward: $" +
currentMission.reward
);

currentMission =
{
name:"Fly To Mukalla",
target:mukallaAirport.position,
reward:7000,
completed:false
};
}
}

//
// =====================================
// AI UPDATE
// =====================================
//

function updateAI()
{
for(
const ai of aiAircrafts
)
{
const dir =
new THREE.Vector3();

dir.subVectors(
ai.target,
ai.mesh.position
);

const distance =
dir.length();

dir.normalize();

ai.mesh.position.addScaledVector(
dir,
2
);

ai.mesh.lookAt(
ai.target
);

if(distance < 100)
{
const old =
ai.target.clone();

if(
Math.random() > 0.5
)
{
ai.target =
new THREE.Vector3(
2500,
300,
3000
);
}
else
{
ai.target =
new THREE.Vector3(
-3200,
300,
2800
);
}

if(
old.x === ai.target.x
)
{
ai.target =
new THREE.Vector3(
0,
300,
0
);
}
}
}
}

//
// =====================================
// DAY / NIGHT
// =====================================
//

function updateDayNight()
{
dayTime +=
0.001;

sun.position.x =
Math.cos(dayTime)
* 1500;

sun.position.y =
Math.sin(dayTime)
* 1500;

if(
sun.position.y < 0
)
{
scene.background =
new THREE.Color(
0x000022
);
}
else
{
scene.background =
new THREE.Color(
0x87ceeb
);
}
}

//
// =====================================
// COLLISION SYSTEM
// =====================================
//

function checkCrash()
{
if(
altitude <= 2 &&
verticalSpeed < -0.3
)
{
alert(
"Aircraft Crashed!"
);

speed = 0;
verticalSpeed = 0;
altitude = 2;

aircraft.position.set(
0,
2,
0
);
}
}

//
// =====================================
// RESIZE
// =====================================
//

window.addEventListener(
"resize",
()=>{
camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);
}
);

//
// =====================================
// MAIN LOOP
// =====================================
//

function animate()
{

const phaseElement =
document.getElementById(
"phase"
);

if(phaseElement)
{
    phaseElement.innerText =
    flightPhase;
}
    
requestAnimationFrame(
animate
);

updateFlight();

updateCamera();

updateMiniMap();

updateHUD();

updateMission();

updateAI();

updateDayNight();

for(const building of buildings)
{
    const dx =
    aircraft.position.x -
    building.position.x;

    const dz =
    aircraft.position.z -
    building.position.z;

    const horizontalDistance =
    Math.sqrt(
        dx*dx +
        dz*dz
    );

    const buildingTop =
    building.position.y +
    building.geometry.parameters.height / 2;

    if(
        horizontalDistance < 12 &&
        aircraft.position.y < buildingTop
    )
    {
        alert(
            "💥 اصطدمت الطائرة بمبنى!"
        );

        location.reload();

        return;
    }
}
for(const ai of aiAircrafts)
{
    if(
        aircraft.position.distanceTo(
            ai.mesh.position
        ) < 10
    )
    {
        alert(
            "💥 اصطدام جوي!"
        );

        location.reload();

        return;
    }
}
    
renderer.render(
scene,
camera
);
}

animate();
