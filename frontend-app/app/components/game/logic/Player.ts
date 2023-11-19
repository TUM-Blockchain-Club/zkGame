import { kBulletSize, kPlayerSize, kPlayerSpeed, kVisibleDistance } from "../utils/Constants";
import { Map } from "./Map";
import { Direction } from "./Game";

export class Player {
    x: number;
    y: number;
    direction: Direction;
    playerImage: HTMLImageElement;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.direction = Direction.Right;
        this.playerImage = new Image();
        this.playerImage.src = "/player.png";
    }

    get bulletX() {
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
        let newX = this.x - kPlayerSpeed;
        if (this.canMove(newX, this.y, map)) {
            this.x = newX;
        }
        this.direction = Direction.Left;
    }

    moveRight(map: Map) {
        let newX = this.x + kPlayerSpeed;
        if (this.canMove(newX, this.y, map)) {
            this.x = newX;
        }
        this.direction = Direction.Right;
    }

    moveUp(map: Map) {
        let newY = this.y - kPlayerSpeed;
        if (this.canMove(this.x, newY, map)) {
            this.y = newY;
        }
        this.direction = Direction.Up;
    }

    moveDown(map: Map) {
        let newY = this.y + kPlayerSpeed;
        if (this.canMove(this.x, newY, map)) {
            this.y = newY;
        }
        this.direction = Direction.Down;
    }

    draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        const centerX = this.x - offsetX + kPlayerSize / 2;
        const centerY = this.y - offsetY + kPlayerSize / 2;
    
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, kVisibleDistance, 0, 2 * Math.PI);
        ctx.fill();
    
        const scaledWidth = kPlayerSize * 2;
        const scaledHeight = kPlayerSize * 2;
    
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
        if (this.playerImage.complete) {
            ctx.drawImage(this.playerImage, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight); // Adjust width and height as needed
        } else {
            this.playerImage.onload = () => {
                ctx.drawImage(this.playerImage, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight); // Adjust width and height as needed
            };
        }
    
        // Restore the context
        ctx.restore();
    
        // Drawing the direction indicator (a small dot)
        ctx.beginPath();
        ctx.arc(this.bulletX - offsetX + kBulletSize / 2, this.bulletY - offsetY + kBulletSize / 2, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Helper method to get the rotation angle based on the direction
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
