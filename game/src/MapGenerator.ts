import * as fs from 'fs';

type Obstacle = { x: number, y: number };
type Line = { x1: number, y1: number, x2: number, y2: number };

class MapGenerator {
    width: number;
    height: number;
    obstacles: Obstacle[] = [];
    lines: Line[] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    generateLines() {
      const lineCount = Math.round(Math.sqrt(this.width * this.height) / 10); // Example line count
      for (let i = 0; i < lineCount; i++) {
          const isHorizontal = Math.random() > 0.5;
          if (isHorizontal) {
              const y = Math.floor(Math.random() * this.height);
              this.lines.push({ x1: 0, y1: y, x2: this.width - 1, y2: y });
          } else {
              const x = Math.floor(Math.random() * this.width);
              this.lines.push({ x1: x, y1: 0, x2: x, y2: this.height - 1 });
          }
      }
    }

    isNearLine(x: number, y: number): boolean {
      const distance = 2; // Two-block distance
      return this.lines.some(line => {
          if (line.x1 === line.x2) { // Vertical line
              return Math.abs(x - line.x1) <= distance;
          } else { // Horizontal line
              return Math.abs(y - line.y1) <= distance;
          }
      });
    }

    generateClusters() {
      const clusterCount = this.width * this.height / 100; // Example cluster density
      for (let i = 0; i < clusterCount; i++) {
          const centerX = Math.floor(Math.random() * this.width);
          const centerY = Math.floor(Math.random() * this.height);

          if (this.isNearLine(centerX, centerY)) continue;

          const clusterRadius = Math.floor(Math.random() * 3) + 1; // Random radius between 1 and 3
          for (let dx = -clusterRadius; dx <= clusterRadius; dx++) {
              for (let dy = -clusterRadius; dy <= clusterRadius; dy++) {
                  const x = centerX + dx;
                  const y = centerY + dy;
                  if (x >= 0 && x < this.width && y >= 0 && y < this.height && !this.isNearLine(x, y)) {
                      this.obstacles.push({ x, y });
                  }
              }
          }
      }
    }

    generateMap() {
        this.generateLines();
        this.generateClusters();
    }

    saveToFile(filename: string) {
        const mapData = {
            width: this.width,
            height: this.height,
            obstacles: this.obstacles
        };
        fs.writeFileSync(filename, JSON.stringify(mapData, null, 2));
    }
}

// Usage
const width = parseInt(process.argv[2]);
const height = parseInt(process.argv[3]);
const mapGenerator = new MapGenerator(width, height);
mapGenerator.generateMap();
mapGenerator.saveToFile('assets/map.json');
