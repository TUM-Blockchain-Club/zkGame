import map from '../../assets/map.json';
import { Player } from './Player';
import { Bullet } from './Bullet';
import { Map } from './Map';
import { handleKeyboardInput } from '../utils/Keyboard';
import { kBulletMaxDistance, kGridSize } from '../utils/Constants';

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    bullets: Bullet[];
    map: Map;

  constructor(canvasId: string) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.canvas.width = 800; // Set canvas width
      this.canvas.height = 600; // Set canvas height
      this.player = new Player(100, 100, 20, 1); // Starting position and speed of player
      this.bullets = []; // Array of bullets
      window.addEventListener('keydown', (e) => this.handleInput(e));
      this.map = Map.fromJson(map); // Create map from JSON
  }


  getCameraOffset() {
    let offsetX = Math.max(0, Math.min(this.player.x - this.canvas.width / 2, this.map.width * kGridSize - this.canvas.width));
    let offsetY = Math.max(0, Math.min(this.player.y - this.canvas.height / 2, this.map.height * kGridSize - this.canvas.height));
    return { offsetX, offsetY };
  }

  handleInput(event: KeyboardEvent) {
      if (event.key === ' ') { // Spacebar pressed
          // Fire a bullet
          this.bullets.push(new Bullet(this.player.bulletX, this.player.bulletY, 10, this.player.direction));
      } else {
          // Remaining keyboard input (movement)
          handleKeyboardInput(event, this.map, this.player);
      }
  }

  update() {
      // Update game state, if needed
      this.bullets.forEach(bullet => bullet.update()); // Update all bullets
      this.bullets = this.bullets.filter(bullet => bullet.distanceTraveled < kBulletMaxDistance && !bullet.isColliding(this.map)); // Remove bullets that are out of bounds
  }

  draw() {
    const { offsetX, offsetY } = this.getCameraOffset();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw player, bulltets, and map with offset
    this.player.draw(this.ctx, offsetX, offsetY);
    this.bullets.forEach(bullet => bullet.draw(this.ctx, offsetX, offsetY));
    this.map.draw(this.ctx, offsetX, offsetY);
  }

  run() {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.run());
  }
}
