import map from '../../assets/map.json';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { Map } from './Map';
import { handleKeyboardInput } from '../utils/Keyboard';
import { kBulletMaxDistance, kGridSize } from '../utils/Constants';

export enum Direction {
  Up,
  Down,
  Left,
  Right
}

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  enemy: Enemy;
  bullets: Bullet[];
  map: Map;
  backgroundImage: HTMLImageElement;
  backgroundLoaded: boolean = false;
  backgroundPattern: CanvasPattern | null = null;



  private webSocket: WebSocket;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width = 800; // Set canvas width
    this.canvas.height = 600; // Set canvas height
    this.player = new Player(100, 100); // Starting position player
    this.enemy = new Enemy(200, 200); // Starting position enemy
    this.bullets = []; // Array of bullets
    window.addEventListener('keydown', (e) => this.handleInput(e));
    this.map = Map.fromJson(map); // Create map from JSON
    this.webSocket = new WebSocket('ws://localhost:8080');
    this.setupWebSocket();
    this.backgroundImage = new Image();
    this.backgroundImage.onload = () => {
      this.backgroundLoaded = true;
      this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
    };
    this.backgroundImage.src = 'assets/ground.png';
  }

  private setupWebSocket() {
    this.webSocket.onopen = (event) => {
      console.log('Connected to WebSocket server');
    };

    this.webSocket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Handle incoming messages
      const data = JSON.parse(event.data);

      if (data.type === 'playerUpdate') {
        this.updateEnemyState(data);
      }

      if (data.type === 'bullet') {
        this.bullets.push(new Bullet(data.data.x, data.data.y, data.data.direction, false));
      }
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  updateEnemyState(data: any) {
    // Update enemy state
    this.enemy.x = data.data.x;
    this.enemy.y = data.data.y;
    this.enemy.direction = data.data.direction;
  }

  handleInput(event: KeyboardEvent) {
    if (event.key === ' ') { // Spacebar pressed
      // Fire a bullet
      this.bullets.push(new Bullet(this.player.bulletX, this.player.bulletY, this.player.direction, true));
      const msg = JSON.stringify({
        type: 'bullet',
        data: {
          x: this.player.bulletX,
          y: this.player.bulletY,
          direction: this.player.direction,
        }
      });
      this.webSocket.send(msg);
    } else {
      // Remaining keyboard input (movement)
      handleKeyboardInput(event, this.map, this.player);
      // Send message to server
      if (this.webSocket.readyState === WebSocket.OPEN) {
        const msg = JSON.stringify({
          type: 'playerUpdate',
          data: {
            x: this.player.x,
            y: this.player.y,
            direction: this.player.direction
          }
        });
        this.webSocket.send(msg);
      }
    }

  }

  getCameraOffset() {
    let offsetX = Math.max(0, Math.min(this.player.x - this.canvas.width / 2, this.map.width * kGridSize - this.canvas.width));
    let offsetY = Math.max(0, Math.min(this.player.y - this.canvas.height / 2, this.map.height * kGridSize - this.canvas.height));
    return { offsetX, offsetY };
  }

  update() {
    // Update game state, if needed
    this.bullets.forEach(bullet => bullet.update()); // Update all bullets
    this.bullets.filter(bullet => bullet.friendly).forEach(bullet => {
      console.log(`Bullet at ${bullet.x}, ${bullet.y}`);
      console.log(`Enemy at ${this.enemy.x} ${this.enemy.y}`);
      if (this.enemy.isVisible && bullet.isCollidingWithPlayer(this.enemy.x!, this.enemy.y!)) {
        console.log('Enemy hit!');
        this.bullets = this.bullets.filter(b => b !== bullet);
        this.enemy.x = null;
        this.enemy.y = null;
      }
    });
    this.bullets.filter(bullet => !bullet.friendly).forEach(bullet => {
      console.log(`Bullet at ${bullet.x}, ${bullet.y}`);
      console.log(`Player at ${this.player.x} ${this.player.y}`);
      if (bullet.isCollidingWithPlayer(this.player.x, this.player.y)) {
        console.log('You are hit!');
        this.bullets = this.bullets.filter(b => b !== bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => bullet.distanceTraveled < kBulletMaxDistance && !bullet.isCollidingWithMap(this.map)); // Remove bullets that are out of bounds
  }

  draw() {
    const { offsetX, offsetY } = this.getCameraOffset();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw the background image
    if (this.backgroundLoaded && this.backgroundPattern) {
      this.ctx.fillStyle = this.backgroundPattern;
      // Translate the context to make the background scroll
      this.ctx.save(); // Save the current context state
      this.ctx.translate(-offsetX, -offsetY);
      this.ctx.fillRect(offsetX, offsetY, this.canvas.width, this.canvas.height);
      this.ctx.restore(); // Restore the context to its original state
    }
    // Draw the semi-transparent black overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Adjust the alpha value for darkness
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


    // Draw player, bulltets, and map with offset
    this.player.draw(this.ctx, offsetX, offsetY);
    this.enemy.draw(this.ctx, offsetX, offsetY);
    this.bullets.forEach(bullet => bullet.draw(this.ctx, offsetX, offsetY));
    this.map.draw(this.ctx, offsetX, offsetY);
  }

  run() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.run());
  }
}
