import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { PokemonService } from '../pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rotating-image',
  templateUrl: './rotating-image.component.html',
  styleUrls: ['./rotating-image.component.css'],
})
export class RotatingImageComponent implements OnInit, OnDestroy {
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private cube: THREE.Mesh | undefined;
  private sourceLinksSubscription: Subscription = new Subscription();
  private sprites_front = '';
  private sprites_back = '';

  constructor(private el: ElementRef, private ngZone: NgZone, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.initScene();
    this.animate();
    
    this.sourceLinksSubscription = this.pokemonService.sourceLinks$.subscribe((links: string[]) => {
      this.sprites_front = links[0];
      this.sprites_back = links[0];
      this.createCube();
    });


    this.el.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.sourceLinksSubscription.unsubscribe();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    const canvasWidth = 1000;
    const canvasHeight = 500;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);
  }

  private createCube(): void {
    if (this.cube) {
      this.scene.remove(this.cube);
    }

    const frontTexture = new THREE.TextureLoader().load(this.sprites_front);
    const backTexture = new THREE.TextureLoader().load(this.sprites_back);

    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const materials = [
      new THREE.MeshBasicMaterial({ map: frontTexture, transparent: true }),
      new THREE.MeshBasicMaterial({ map: backTexture, transparent: true }),
    ];
    
    this.cube = new THREE.Mesh(geometry, materials);
    this.cube.position.set(0, 0, 0);
    this.cube.rotation.set(0, 0, 0);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene.add(this.cube);
  }

  private onMouseMove(event: MouseEvent): void {
    const rotationSpeed = 0.01;
    if (this.cube) {
      this.cube.rotation.y -= (event.movementX || (event as any).mozMovementX || 0) * rotationSpeed;
      this.cube.rotation.x -= (event.movementY || (event as any).mozMovementY || 0) * rotationSpeed;
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };

      animateFn();
    });
  }
}
