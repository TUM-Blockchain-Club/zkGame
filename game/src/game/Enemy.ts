import { kBulletSize, kPlayerSize } from "../utils/Constants";
import { Direction } from "./Game";

export class Enemy {
    x: number | null; // position may not be known
    y: number | null; // position may not be known
    direction: Direction;
    playerImage: HTMLImageElement;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.direction = Direction.Right;
        this.playerImage = new Image();
        this.playerImage.src = "assets/enemy.png";
    }

    get bulletX() {
        if (this.x === null || this.y === null) return null;
        switch (this.direction) {
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
        switch (this.direction) {
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

    get isVisible() {
        return this.x !== null && this.y !== null;
    }

    // Additional methods like draw, shoot, etc., can be added here
    draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        if (this.x === null || this.y === null) return; // iff bulletX and bulletY are null
        const centerX = this.x - offsetX + kPlayerSize / 2;
        const centerY = this.y - offsetY + kPlayerSize / 2;

        //       ctx.fillStyle = 'black';
        //       ctx.beginPath();
        //       ctx.arc(centerX, centerY, kPlayerSize / 2, 0, 2 * Math.PI);
        //       ctx.fill()

        //       // Drawing the direction indicator (a small dot)
        //       ctx.beginPath();
        //       ctx.arc(this.bulletX! - offsetX + kBulletSize / 2, this.bulletY! - offsetY + kBulletSize / 2, 2, 0, 2 * Math.PI)
        //       ctx.fill();
        //   }
        const scaledWidth = kPlayerSize * 3;
        const scaledHeight = kPlayerSize * 3;

        // Save the current context
        ctx.save();

        // Translate to the player's center
        ctx.translate(centerX, centerY);

        // Determine if we need to mirror the image
        if (this.direction === Direction.Left) {
            ctx.scale(-1, 1); // Mirror the image
        }

        // Rotate the context
        ctx.rotate(this.getRotationAngle());

        // Draw the image centered
        ctx.drawImage(this.playerImage, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

        // Restore the context
        ctx.restore();
    }

    getRotationAngle() {
        switch (this.direction) {
            case Direction.Up:
                return -Math.PI / 2;
            case Direction.Down:
                return Math.PI / 2;
            case Direction.Left:
                return 0; // No additional rotation needed as we are mirroring
            case Direction.Right:
                return 0;
            default:
                return 0;
        }
    }

}
