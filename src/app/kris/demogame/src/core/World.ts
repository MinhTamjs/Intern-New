export interface Position {
  x: number;
  y: number;
}

export interface WorldTile {
  type: 'grass' | 'water' | 'mountain' | 'forest' | 'cave' | 'town';
  walkable: boolean;
  encounterRate: number;
  description: string;
}

export class World {
  private width: number;
  private height: number;
  private tiles: WorldTile[][];
  private playerPosition: Position;
  private enemies: Array<{position: Position, type: string}>;

  constructor(width: number = 20, height: number = 15) {
    this.width = width;
    this.height = height;
    this.enemies = [];
    this.tiles = this.generateWorld();
    this.playerPosition = this.findWalkablePosition(); // Find walkable position
    this.spawnEnemies();
  }

  private generateWorld(): WorldTile[][] {
    const tiles: WorldTile[][] = [];
    
    for (let y = 0; y < this.height; y++) {
      tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        // Generate different terrain types
        const rand = Math.random();
        
        if (rand < 0.7) {
          tiles[y][x] = {
            type: 'grass',
            walkable: true,
            encounterRate: 0.1,
            description: 'Cỏ xanh mượt mà'
          };
        } else if (rand < 0.85) {
          tiles[y][x] = {
            type: 'forest',
            walkable: true,
            encounterRate: 0.2,
            description: 'Rừng rậm rạp'
          };
        } else if (rand < 0.92) {
          tiles[y][x] = {
            type: 'mountain',
            walkable: false,
            encounterRate: 0,
            description: 'Núi cao hiểm trở'
          };
        } else if (rand < 0.97) {
          tiles[y][x] = {
            type: 'water',
            walkable: false,
            encounterRate: 0,
            description: 'Hồ nước trong xanh'
          };
        } else {
          tiles[y][x] = {
            type: 'cave',
            walkable: true,
            encounterRate: 0.3,
            description: 'Hang động tối tăm'
          };
        }
      }
    }

    // Add town in center
    tiles[7][10] = {
      type: 'town',
      walkable: true,
      encounterRate: 0,
      description: 'Thị trấn nhỏ'
    };

    return tiles;
  }

  private spawnEnemies() {
    this.enemies = [];
    const enemyTypes = ['goblin', 'orc', 'troll', 'dark-knight'];
    
    for (let i = 0; i < 8; i++) {
      let position: Position;
      do {
        position = {
          x: Math.floor(Math.random() * this.width),
          y: Math.floor(Math.random() * this.height)
        };
      } while (
        !this.isWalkable(position) || 
        this.getDistance(position, this.playerPosition) < 3 ||
        this.enemies.some(e => e.position.x === position.x && e.position.y === position.y)
      );

      this.enemies.push({
        position,
        type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
      });
    }
  }

  public getPlayerPosition(): Position {
    return { ...this.playerPosition };
  }

  public getEnemies(): Array<{position: Position, type: string}> {
    return this.enemies.map(e => ({
      position: { ...e.position },
      type: e.type
    }));
  }

  public getTile(position: Position): WorldTile {
    if (this.isValidPosition(position)) {
      return this.tiles[position.y][position.x];
    }
    return {
      type: 'mountain',
      walkable: false,
      encounterRate: 0,
      description: 'Vùng không thể đi'
    };
  }

  public getWorldDimensions(): {width: number, height: number} {
    return { width: this.width, height: this.height };
  }

  public movePlayer(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const newPosition = { ...this.playerPosition };
    
    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case 'down':
        newPosition.y = Math.min(this.height - 1, newPosition.y + 1);
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - 1);
        break;
      case 'right':
        newPosition.x = Math.min(this.width - 1, newPosition.x + 1);
        break;
    }

    // Debug movement
    console.log(`Moving ${direction}:`, {
      from: this.playerPosition,
      to: newPosition,
      isValid: this.isValidPosition(newPosition),
      isWalkable: this.isWalkable(newPosition),
      tileType: this.getTile(newPosition).type
    });

    if (this.isWalkable(newPosition)) {
      this.playerPosition = newPosition;
      console.log('Movement successful:', this.playerPosition);
      return true;
    }
    
    console.log('Movement blocked by:', this.getTile(newPosition).type);
    return false;
  }

  public checkForEnemy(): {position: Position, type: string} | null {
    const enemy = this.enemies.find(e => 
      e.position.x === this.playerPosition.x && 
      e.position.y === this.playerPosition.y
    );
    
    if (enemy) {
      // Remove enemy from world after encounter
      this.enemies = this.enemies.filter(e => e !== enemy);
      return enemy;
    }
    
    return null;
  }

  public checkRandomEncounter(): boolean {
    const tile = this.getTile(this.playerPosition);
    return Math.random() < tile.encounterRate;
  }

  private isWalkable(position: Position): boolean {
    if (!this.isValidPosition(position)) return false;
    return this.tiles[position.y][position.x].walkable;
  }

  private isValidPosition(position: Position): boolean {
    return position.x >= 0 && position.x < this.width && 
           position.y >= 0 && position.y < this.height;
  }

  private getDistance(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  public getWorldMap(): WorldTile[][] {
    return this.tiles.map(row => row.map(tile => ({ ...tile })));
  }

  public respawnEnemies() {
    this.spawnEnemies();
  }

  private findWalkablePosition(): Position {
    // Try center first
    const centerX = Math.floor(this.width / 2);
    const centerY = Math.floor(this.height / 2);
    
    if (this.isWalkable({ x: centerX, y: centerY })) {
      return { x: centerX, y: centerY };
    }
    
    // Search for walkable position
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isWalkable({ x, y })) {
          return { x, y };
        }
      }
    }
    
    // Fallback to first position
    return { x: 0, y: 0 };
  }
} 