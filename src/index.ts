import * as PIXI from "pixi.js";
// webpack v5 error. import { loader } from "webpack";
import { WebpackPluginInstance as loader } from "webpack";
// window.PIXI = PIXI;
import { STAGES, ASSETS, GAMES } from "./constants";
import { setText } from "./setText";
import Stats from "stats.js";

console.log(PIXI);

// stats
let stats: Stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// constant
const WIDTH: number = STAGES.WIDTH;
const HEIGHT: number = STAGES.HEIGHT;
const BG_COLOR: number = STAGES.BG_COLOR;

// renderer
const renderer: PIXI.Renderer = new PIXI.Renderer({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR,
});
document.body.appendChild(renderer.view);

// stage
const stage: PIXI.Container = new PIXI.Container();

// Custom GameLoop(v5), call requestAnimationFrame directly.
let oldTime: number = Date.now();
let ms: number = 1000;
let fps: number = GAMES.FPS;
let animate = () => {
  // console.log("animate()");
  let newTime: number = Date.now();
  let deltaTime: number = newTime - oldTime;
  oldTime = newTime;
  deltaTime < 0 ? (deltaTime = 0) : deltaTime;
  deltaTime > ms ? (deltaTime = ms) : deltaTime;
  renderer.render(stage);
  stats.begin();
  requestAnimationFrame(animate);
  updateParticle();
  if (particlesEmitflag) {
    particleStream();
  }
  stats.end();
};

// loader
let loader: PIXI.Loader = new PIXI.Loader();

// asset
const ASSET_BG: string = ASSETS.ASSET_BG;
const ASSET_OBJ1: string = ASSETS.ASSET_OBJ1;
const ASSET_OBJ2: string = ASSETS.ASSET_OBJ2;
const ASSET_OBJ3: string = ASSETS.ASSET_OBJ3;
const ASSET_OBJ4: string = ASSETS.ASSET_OBJ4;

// init
let bg: PIXI.Sprite;
let particles: PIXI.Sprite[] = [];
let particleResourceAry: PIXI.Texture[] = [];
let particlesEmitflag: Boolean = true;

let pAryGravity: number[] = [];
let pAryScaleSpeed: number[] = [];
let pAryAlphaSpeed: number[] = [];
let pAryRotationSpeed: number[] = [];
let pAryVx: number[] = [];
let pAryVy: number[] = [];
let pAryLifetime: number[] = [];
let pAryLifetimeSpeed: number[] = [];

// container
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
container.interactive = false;
container.interactiveChildren = false;
container.buttonMode = false;
stage.addChild(container);

// container for add particle
let container_effect: PIXI.Container = new PIXI.Container();

// text
let text_libVersion: PIXI.Text,
  text_description: PIXI.Text,
  text_message: PIXI.Text,
  text_fps: PIXI.Text;
  let text_loading: PIXI.Text;

if (ASSET_BG === "") {
  console.log("Don't use background image.");
} else {
  loader.add("bg_data", ASSET_BG);
}
loader.add("obj_1_data", ASSET_OBJ1);
loader.add("obj_2_data", ASSET_OBJ2);
loader.add("obj_3_data", ASSET_OBJ3);
loader.add("obj_4_data", ASSET_OBJ4);

// Text loading
text_loading = new PIXI.Text(`Loading asset data ....`, {
  fontFamily: "Arial",
  fontSize: 20,
  fill: 0x999999,
  align: "left",
  fontWeight: "bold",
  stroke: "#000000",
  strokeThickness: 4,
  dropShadow: false,
  dropShadowColor: "#666666",
  lineJoin: "round",
});
container.addChild(text_loading);
text_loading.x = 10;
text_loading.y = 10;
requestAnimationFrame(animate);

loader.load((loader: PIXI.Loader, resources: any) => {
  console.log(loader);
  console.log(resources);

  container.removeChild(text_loading);

  // bg
  if (ASSET_BG !== "") {
    bg = new PIXI.Sprite(resources.bg_data.texture);
    container.addChild(bg);
  }

  // particle resource reference
  particleResourceAry[0] = resources.obj_1_data.texture;
  particleResourceAry[1] = resources.obj_2_data.texture;
  particleResourceAry[2] = resources.obj_3_data.texture;
  particleResourceAry[3] = resources.obj_4_data.texture;

  // text
  let offset: number = 10;

  // text version
  // let version: string = "PixiJS: 5.3.3\nwebpack: 4.44.0\nTypeScript: 4.0.2";
  let version: string = `PixiJS: ver.${PIXI.VERSION}`;
  text_libVersion = setText(version, "Arial", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_libVersion);
  text_libVersion.x = offset;
  text_libVersion.y = offset;

  // text description
  let description: string = "Particle Effect Test 'Spark'";
  text_description = setText(
    description,
    "Arial",
    24,
    0xffd700,
    "center",
    "bold",
    "#000000",
    4,
    false,
    "#666666",
    "round"
  );
  container.addChild(text_description);
  text_description.x = WIDTH / 2 - text_description.width / 2;
  text_description.y = offset;

  // text message
  let message: string = "Automatic generation";
  text_message = setText(
    message,
    "Arial",
    24,
    0xff0033,
    "center",
    "bold",
    "#000000",
    5,
    false,
    "#666666",
    "round"
  );
  container.addChild(text_message);
  text_message.x = WIDTH / 2 - text_message.width / 2;
  text_message.y = HEIGHT - text_message.height - offset;

  // text fps
  text_fps = setText(`FPS: ${fps}`, "Impact", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_fps);
  text_fps.x = offset;
  text_fps.y = HEIGHT - text_fps.height - offset;

  // app start
  // requestAnimationFrame(animate);
});

// err
loader.onError.add(() => {
  throw Error("load error ...");
});

// helper function
let randomFloat = (min: number, max: number) =>
  min + Math.random() * (max - min); // Make Random floating point number(min～max)
let randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min; // Make Random integer(min～max)

/**
 * A module that make particle
 * @export particleEffect
 * @param {number} [x=0] x position(default=0)
 * @param {number} [y=0] y position(default=0)
 * @param {number} [numberOfParticles=10] Maximum number of particles(default=10)
 * @param {number} [gravity=0] gravity(default=0)
 * @param {boolean} [randomSpacing=true] Should particles be random? To be evenly spaced?(default=true)
 * @param {number} [minAngle=0] Minimum angle(radian, default=0=→, 1.57=↓, 3.14=←, 4.71=↑, 6.28=→=0)
 * @param {number} [maxAngle=6.28] Maximum angle(radian, default=6.28=→=0)
 * @param {number} [minSize=4] Minimum size(default=4)
 * @param {number} [maxSize=16] Maximumsize(default=16)
 * @param {number} [minSpeed=0.1] Minimum speed(default=0.1)
 * @param {number} [maxSpeed=1] Maximum speed(default=1)
 * @param {number} [minScaleSpeed=0.01] Minimum scale change speed(default=0.01)
 * @param {number} [maxScaleSpeed=0.05] Maximum scale change speed(default=0.05)
 * @param {number} [minAlphaSpeed=0.02] Minimum alpha change speed(default=0.02)
 * @param {number} [maxAlphaSpeed=0.02] Maximum alpha change speed(default=0.02)
 * @param {number} [minRotationSpeed=0.01] Minimum rotation change speed(default=0.01)
 * @param {number} [maxRotationSpeed=0.03] Maximum rotation change speed(default=0.03)
 */
let makeParticle = (
  x: number = 0,
  y: number = 0,
  numberOfParticles: number = 10,
  gravity: number = 0,
  randomSpacing: boolean = true,
  minAngle: number = 0,
  maxAngle: number = 3.14,
  minSize: number = 2,
  maxSize: number = 10,
  minSpeed: number = 0.2,
  maxSpeed: number = 1.5,
  minScaleSpeed: number = 0.05,
  maxScaleSpeed: number = 0.1,
  minAlphaSpeed: number = 0.1,
  maxAlphaSpeed: number = 0.2,
  minRotationSpeed: number = 0.02,
  maxRotationSpeed: number = 0.05
) => {
  // console.log("makeParticle()");
  if (!particlesEmitflag) {
    // console.log("it is being generated ...");
    return;
  }
  particlesEmitflag = false;

  container_effect = new PIXI.Container();
  stage.addChild(container_effect);

  let angles: number[] = [];
  let angle: number | undefined;
  let spacing: number = (maxAngle - minAngle) / (numberOfParticles - 1);
  for (let i: number = 0; i < numberOfParticles; i++) {
    if (randomSpacing) {
      angle = randomFloat(minAngle, maxAngle);
      angles.push(angle);
    } else {
      if (angle === undefined) angle = minAngle;
      angles.push(angle);
      angle += spacing;
    }
  }

  // for auto emitte at random place
  let areaOffset: number = 50;
  x = randomInt(0 + areaOffset, WIDTH - areaOffset);
  y = randomInt(0 + areaOffset, HEIGHT - areaOffset);

  /**
   * Create individual particles
   * @param angle
   * @param idx
   * @param gravity
   * @param minScaleSpeed
   * @param maxScaleSpeed
   */
  let make = (
    angle: number,
    idx: number,
    gravity: number,
    minScaleSpeed: number,
    maxScaleSpeed: number
  ) => {
    // console.log("make()");
    if (numberOfParticles <= particles.length) return;

    // set sprite
    let num: number = randomInt(0, 3);
    let particle: PIXI.Sprite = new PIXI.Sprite(particleResourceAry[num]);
    particle.blendMode = PIXI.BLEND_MODES.ADD;
    container_effect.addChild(particle);

    // set parameter
    particle.x = x + randomInt(-10, 10);
    particle.y = y + randomInt(-10, 10);
    let size: number = randomInt(minSize, maxSize);
    particle.width = size;
    particle.height = size;
    pAryScaleSpeed[idx] = randomFloat(minScaleSpeed, maxScaleSpeed);
    pAryAlphaSpeed[idx] = randomFloat(minAlphaSpeed, maxAlphaSpeed);
    pAryRotationSpeed[idx] = randomFloat(minRotationSpeed, maxRotationSpeed);
    let speed: number = randomFloat(minSpeed, maxSpeed);
    pAryVx[idx] = speed * Math.cos(angle);
    pAryVy[idx] = speed * Math.sin(angle);
    pAryGravity[idx] = gravity;

    pAryLifetime[idx] = 60;
    pAryLifetimeSpeed[idx] = randomInt(0.1, 0.5);

    particles.push(particle);
    // console.log("particle: ", particle);
    // console.log("particles.length: ", particles.length);
  };

  // create particles for each angle
  angles.map((elem: number, idx: number) => {
    make(elem, idx, gravity, minScaleSpeed, maxScaleSpeed);
  });
};

let removeParticle = (...spritesToRemove: Array<PIXI.Sprite> | any) => {
  // console.log("removeParticle()");
  spritesToRemove.map((elm: PIXI.Sprite) => {
    removeChild(elm);
  });
};

/**
 * Delete sprite from array
 * @param sprite
 */
let removeChild = (sprite: PIXI.Sprite | any) => {
  // console.log("removeChild()");
  if (sprite !== null) {
    particles.splice(sprite);
    // console.log("remove end, particles.length: ", particles.length);
    if (particles.length <= 0) {
      container_effect.destroy({
        children: true,
        texture: false,
        baseTexture: false,
      });
      stage.removeChild(container_effect);
      particlesEmitflag = true;
    }
    sprite = null;
  }
};

/**
 * Update particles
 */
let updateParticle = () => {
  particles
    //.filter((elem: PIXI.Sprite) => elem !== undefined)
    .map((p, idx: number) => {
      //console.log(p); // Sprite {_events: Events, _eventsCount: 0, tempDisplayObjectParent: null, transform: Transform, alpha: 1, …}

      // calculate movement
      pAryVx[idx] += pAryGravity[idx];
      p.x += pAryVx[idx];
      p.y += pAryVy[idx];
      if (p.scale.x - pAryScaleSpeed[idx] > 0) {
        p.scale.x -= pAryScaleSpeed[idx];
      }
      if (p.scale.y - pAryScaleSpeed[idx] > 0) {
        p.scale.y -= pAryScaleSpeed[idx];
      }
      p.rotation += pAryRotationSpeed[idx];
      p.alpha -= pAryAlphaSpeed[idx];

      // lifetime check
      pAryLifetime[idx] -= pAryLifetimeSpeed[idx];
      if (pAryLifetime[idx] <= 0) {
        removeParticle(p);
      }
    });
};

/**
 * emitte by AUTO
 */
let particleStream = () =>
  makeParticle(
    WIDTH / 2, // x position
    HEIGHT / 2, // y position
    500, // number of particles
    0.0, // gravity
    true, // random spacing
    0, // min anglemakeParticle
    6.28, // max anglec
    12, // min size
    24, // max size
    5, // min speed (spread small)
    20, // max speed (spread big)
    0.005, // min scale speed
    0.01, // max scale speed
    0.005, // min alpha speed
    0.01, // max alpha speed
    0, // min rotation speed
    0 // max rotation speed
  );
