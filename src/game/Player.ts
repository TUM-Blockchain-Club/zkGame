import { kBulletSize, kPlayerSize, kVisibleDistance } from "../utils/Constants";
import { Map } from "./Map";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export class Player {
  x: number;
  y: number;
  speed: number;
  direction: Direction;

  constructor(x: number, y: number, speed: number) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.direction = Direction.Right;
  }

  get bulletX() {
    switch(this.direction) {
        case Direction.Up:
            return this.x + 8;
        case Direction.Down:
            return this.x + 8;
        case Direction.Left:
            return this.x - 8;
        case Direction.Right:
            return this.x + 24;
    }
  }

  get bulletY() {
    switch(this.direction) {
        case Direction.Up:
            return this.y - 8;
        case Direction.Down:
            return this.y + 24;
        case Direction.Left:
            return this.y + 8;
        case Direction.Right:
            return this.y + 8;
    }   
  }

  canMove(newX: number, newY: number, map: Map): boolean {
    // Check map boundaries
    if (newX < 0 || newY < 0 || newX + 20 > map.width * 20 || newY + 20 > map.height * 20) {
        return false;
    }

    // Check obstacles
    for (let obstacle of map.obstacles) {
        if (newX < (obstacle.x + 1) * 20 && newX + 20 > obstacle.x * 20 &&
            newY < (obstacle.y + 1) * 20 && newY + 20 > obstacle.y * 20) {
            return false;
        }
    }
    return true;
  }

  moveLeft(map: Map) {
    let newX = this.x - this.speed;
    if (this.canMove(newX, this.y, map)) {
        this.x = newX;
    }
    this.direction = Direction.Left;
  }

  moveRight(map: Map) {
    let newX = this.x + this.speed;
    if (this.canMove(newX, this.y, map)) {
        this.x = newX;
    }
    this.direction = Direction.Right;
  }

  moveUp(map: Map) {
    let newY = this.y - this.speed;
    if (this.canMove(this.x, newY, map)) {
        this.y = newY;
    }
    this.direction = Direction.Up;
  }

  moveDown(map: Map) {
    let newY = this.y + this.speed;
    if (this.canMove(this.x, newY, map)) {
        this.y = newY;
    }
    this.direction = Direction.Down;
  }

  // Additional methods like draw, shoot, etc., can be added here
  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
      const centerX = this.x - offsetX + kPlayerSize / 2;
      const centerY = this.y - offsetY + kPlayerSize / 2;

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, kVisibleDistance, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX, centerY, kPlayerSize / 2, 0, 2 * Math.PI);
      ctx.fill()

      // Drawing the direction indicator (a small dot)
      ctx.beginPath();
      ctx.arc(this.bulletX - offsetX + kBulletSize / 2, this.bulletY - offsetY + kBulletSize / 2, 2, 0, 2 * Math.PI)
      ctx.fill();
  }
}
