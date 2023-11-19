import { kGridSize, kObstacleSize } from "../utils/Constants";

export class Map {
    width: number;  // Width in terms of number of cubes
    height: number; // Height in terms of number of cubes
    obstacles: Array<{ x: number, y: number }>;
    obstacleImage: HTMLImageElement;


    constructor(width: number, height: number, obstacles: Array<{ x: number, y: number }>) {
        this.width = width;
        this.height = height;
        this.obstacles = obstacles;
        this.obstacleImage = new Image();
        this.obstacleImage.src = "/tree.png";
    }

    static fromJson(json: { width: number, height: number, obstacles: Array<{ x: number, y: number }> }) {
        return new Map(json.width, json.height, json.obstacles);
    }

    // Method to draw the map and obstacles
    draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        //   ctx.fillStyle = 'green';
        this.obstacles.forEach(obstacle => {
            //   ctx.fillRect(obstacle.x * kGridSize - offsetX, obstacle.y * kGridSize - offsetY, kObstacleSize, kObstacleSize);
            const x = obstacle.x * kGridSize - offsetX;
            const y = obstacle.y * kGridSize - offsetY;
            if (this.obstacleImage.complete) {
                ctx.drawImage(this.obstacleImage, x, y, kObstacleSize*2, kObstacleSize*2);
            } else {
                this.obstacleImage.onload = () => {
                    ctx.drawImage(this.obstacleImage, x, y, kObstacleSize*2, kObstacleSize*2);
                };
            }
        });
    }
}
