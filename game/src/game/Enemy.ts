import { kBulletSize, kPlayerSize } from "../utils/Constants";
import { Direction } from "./Game";

export class Enemy {
  x: number | null; // position may not be known
  y: number | null; // position may not be known
  direction: Direction;

  constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.direction = Direction.Right;
  }

  get bulletX() {
    if (this.x === null || this.y === null) return null;
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
    if (this.x === null || this.y === null) return null;
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

  // Additional methods like draw, shoot, etc., can be added here
  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
      if (this.x === null || this.y === null) return; // iff bulletX and bulletY are null
      const centerX = this.x - offsetX + kPlayerSize / 2;
      const centerY = this.y - offsetY + kPlayerSize / 2;

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX, centerY, kPlayerSize / 2, 0, 2 * Math.PI);
      ctx.fill()

      // Drawing the direction indicator (a small dot)
      ctx.beginPath();
      ctx.arc(this.bulletX! - offsetX + kBulletSize / 2, this.bulletY! - offsetY + kBulletSize / 2, 2, 0, 2 * Math.PI)
      ctx.fill();
  }
}
