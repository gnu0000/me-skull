//
// skull demo
// This is my first demo using three.js
// Craig Fitzgerald

import $ from "jquery";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/examples/jsm/loaders/GLTFLoader.js';


class PageHandler {
   constructor() {
      $(window).on("resize", () => this.Resize());
      this.SetupThree();
   }

   SetupThree() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 50);
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 10;

      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
      this.scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      this.camera.add(pointLight);
      this.scene.add(this.camera);

      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 0, - 0.2);
      controls.minDistance = 3;
      controls.maxDistance = 50;
      controls.update();

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('textures/7q01kwn-a-360-view-of-a-river.jpg', (texture) => {
         texture.encoding = THREE.sRGBEncoding;
         texture.mapping = THREE.EquirectangularReflectionMapping;
         this.scene.background = texture;
      });

      const loader = new GLTFLoader();
      loader.load('models/skull/scene.gltf', (gltf) => {
         this.scene.add(gltf.scene);
         this.Render();
      }, undefined, function (error) {
         this.console.error(error);
      });
   }

   Animate() {
      requestAnimationFrame(() => this.Animate());
      this.Render();
   }

   Render() {
      let time = Date.now();
      let delta = (time - this.lastTime) * 0.00025;
      this.lastTime = time;

      this.scene.traverse(function (object) {
         if (object.isMesh === true) {
            object.rotation.z +=  delta;
         }
      });
      this.renderer.render(this.scene, this.camera);
   }

   Resize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.updateProjectionMatrix();

      this.Render();
   }
}


$(function() {
   let p = new PageHandler();
   p.Animate();
});
