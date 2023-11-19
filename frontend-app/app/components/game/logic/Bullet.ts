import { kBulletSize, kBulletSpeed } from '../utils/Constants';
import { Map } from './Map';
import { Direction } from './Game';

export class Bullet {
  x: number;
  y: number;
  direction: Direction;
  friendly: boolean;
  distanceTraveled: number = 0;

  constructor(x: number, y: number, direction: Direction, friendly: boolean) {
      this.x = x;
      this.y = y;
      this.direction = direction;
      this.friendly = friendly;
  }

  isCollidingWithMap(map: Map): boolean {
    // Check map boundaries
    if (this.x < 0 || this.y < 0 || this.x + 5 > map.width * 20 || this.y + 5 > map.height * 20) {
        return true;
    }

    // Check obstacles
    for (let obstacle of map.obstacles) {
        if (this.x < (obstacle.x + 1) * 20 && this.x + 5 > obstacle.x * 20 &&
            this.y < (obstacle.y + 1) * 20 && this.y + 5 > obstacle.y * 20) {
            return true;
        }
    }

    return false;
  }

  isCollidingWithPlayer(x: number, y: number): boolean {
    if (this.x < x + 20 && this.x + 5 > x &&
        this.y < y + 20 && this.y + 5 > y) {
        return true;
    }

    return false;
  }

  update() {
      // Update the projectile's position based on its direction
      switch(this.direction) {
          case Direction.Up:
              this.y -= kBulletSpeed;
              break;
          case Direction.Down:
              this.y += kBulletSpeed;
              break;
          case Direction.Left:
              this.x -= kBulletSpeed;
              break;
          case Direction.Right:
              this.x += kBulletSpeed;
              break;
      }
      this.distanceTraveled += kBulletSpeed;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x - offsetX + kBulletSize / 2, this.y - offsetY + kBulletSize / 2, kBulletSize / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
