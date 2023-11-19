import map from '@/public/game_map.json';
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
    private webSocket: WebSocket;
    private animationFrameId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
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
        if (this.enemy.isVisible && bullet.isCollidingWithPlayer(this.enemy.x!, this.enemy.y!)) {
          console.log('Enemy hit!');
          this.bullets = this.bullets.filter(b => b !== bullet);
          this.enemy.x = null;
          this.enemy.y = null;
          this.stop();
        }
      });
      this.bullets.filter(bullet => !bullet.friendly).forEach(bullet => {
          if (bullet.isCollidingWithPlayer(this.player.x, this.player.y)) {
            console.log('You are hit!');
            this.bullets = this.bullets.filter(b => b !== bullet);
            this.stop();
          }
        });
      this.bullets = this.bullets.filter(bullet => bullet.distanceTraveled < kBulletMaxDistance && !bullet.isCollidingWithMap(this.map)); // Remove bullets that are out of bounds
  }

  draw() {
    const { offsetX, offsetY } = this.getCameraOffset();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw player, bulltets, and map with offset
    this.player.draw(this.ctx, offsetX, offsetY);
    this.enemy.draw(this.ctx, offsetX, offsetY);
    this.bullets.forEach(bullet => bullet.draw(this.ctx, offsetX, offsetY));
    this.map.draw(this.ctx, offsetX, offsetY);
  }

  run() {
      this.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(() => this.run());
  }

  stop() {
      console.log('Stopping game');
      // Stop running the game
      this.webSocket.close();
      cancelAnimationFrame(this.animationFrameId);
  }
}
