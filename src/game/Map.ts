import { kGridSize, kObstacleSize } from "../utils/Constants";

export class Map {
  width: number;  // Width in terms of number of cubes
  height: number; // Height in terms of number of cubes
  obstacles: Array<{ x: number, y: number }>;

  constructor(width: number, height: number, obstacles: Array<{ x: number, y: number }>) {
      this.width = width;
      this.height = height;
      this.obstacles = obstacles;
  }

  static fromJson(json: { width: number, height: number, obstacles: Array<{ x: number, y: number }> }) {
      return new Map(json.width, json.height, json.obstacles);
  }

  // Method to draw the map and obstacles
  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
      ctx.fillStyle = 'black';
      this.obstacles.forEach(obstacle => {
          ctx.fillRect(obstacle.x * kGridSize - offsetX, obstacle.y * kGridSize - offsetY, kObstacleSize, kObstacleSize);
      });
  }
}
