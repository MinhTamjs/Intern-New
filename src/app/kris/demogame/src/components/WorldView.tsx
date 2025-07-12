import React, { useEffect, useRef, useState } from 'react';
import { World, Position, WorldTile } from '../core/World';
import { PlayerSprite, EnemySprite } from './PlayerSprite';

interface WorldViewProps {
  world: World;
  onPlayerMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onTileClick?: (position: Position) => void;
  className?: string;
}

export const WorldView: React.FC<WorldViewProps> = ({
  world,
  onPlayerMove,
  onTileClick,
  className = ''
}) => {
  const [playerPos, setPlayerPos] = useState(world.getPlayerPosition());
  const [enemies, setEnemies] = useState(world.getEnemies());
  const [worldMap, setWorldMap] = useState(world.getWorldMap());
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const TILE_SIZE = 32;
  const VIEW_WIDTH = 15;
  const VIEW_HEIGHT = 10;

  // Tile colors
  const tileColors = {
    grass: '#90EE90',
    forest: '#228B22',
    mountain: '#8B4513',
    water: '#4169E1',
    cave: '#2F4F4F',
    town: '#FFD700'
  };

  // Tile symbols
  const tileSymbols = {
    grass: '🌱',
    forest: '🌲',
    mountain: '⛰️',
    water: '💧',
    cave: '🕳️',
    town: '🏘️'
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
      }

      if (direction) {
        event.preventDefault();
        onPlayerMove(direction);
        updateView();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayerMove]);

  const updateView = () => {
    setPlayerPos(world.getPlayerPosition());
    setEnemies(world.getEnemies());
    setWorldMap(world.getWorldMap());
    
    // Update view offset to center on player
    const newOffset = {
      x: Math.max(0, Math.min(playerPos.x - Math.floor(VIEW_WIDTH / 2), world.getWorldDimensions().width - VIEW_WIDTH)),
      y: Math.max(0, Math.min(playerPos.y - Math.floor(VIEW_HEIGHT / 2), world.getWorldDimensions().height - VIEW_HEIGHT))
    };
    setViewOffset(newOffset);
  };

  useEffect(() => {
    updateView();
  }, [world]);

  const renderWorld = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render tiles
    for (let y = 0; y < VIEW_HEIGHT; y++) {
      for (let x = 0; x < VIEW_WIDTH; x++) {
        const worldX = x + viewOffset.x;
        const worldY = y + viewOffset.y;
        
        if (worldX < worldMap[0]?.length && worldY < worldMap.length) {
          const tile = worldMap[worldY][worldX];
          const screenX = x * TILE_SIZE;
          const screenY = y * TILE_SIZE;

          // Draw tile background
          ctx.fillStyle = tileColors[tile.type];
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

          // Draw tile border
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

          // Draw tile symbol
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000';
          ctx.fillText(
            tileSymbols[tile.type],
            screenX + TILE_SIZE / 2,
            screenY + TILE_SIZE / 2
          );
        }
      }
    }

    // Render enemies
    enemies.forEach(enemy => {
      const screenX = (enemy.position.x - viewOffset.x) * TILE_SIZE;
      const screenY = (enemy.position.y - viewOffset.y) * TILE_SIZE;
      
      if (screenX >= 0 && screenX < VIEW_WIDTH * TILE_SIZE && 
          screenY >= 0 && screenY < VIEW_HEIGHT * TILE_SIZE) {
        
        // Draw enemy indicator
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.fillText('👹', screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2);
      }
    });

    // Render player
    const playerScreenX = (playerPos.x - viewOffset.x) * TILE_SIZE;
    const playerScreenY = (playerPos.y - viewOffset.y) * TILE_SIZE;
    
    if (playerScreenX >= 0 && playerScreenX < VIEW_WIDTH * TILE_SIZE && 
        playerScreenY >= 0 && playerScreenY < VIEW_HEIGHT * TILE_SIZE) {
      
      // Draw player indicator
      ctx.fillStyle = '#00FF00';
      ctx.beginPath();
      ctx.arc(playerScreenX + TILE_SIZE / 2, playerScreenY + TILE_SIZE / 2, 10, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText('👤', playerScreenX + TILE_SIZE / 2, playerScreenY + TILE_SIZE / 2);
    }

    animationRef.current = requestAnimationFrame(renderWorld);
  };

  useEffect(() => {
    renderWorld();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [worldMap, enemies, playerPos, viewOffset]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onTileClick) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);
    
    const worldX = x + viewOffset.x;
    const worldY = y + viewOffset.y;
    
    onTileClick({ x: worldX, y: worldY });
  };

  return (
    <div className={`world-view ${className}`}>
      <div className="world-info">
        <div>Vị trí: ({playerPos.x}, {playerPos.y})</div>
        <div>Khu vực: {world.getTile(playerPos).description}</div>
        <div>Quái vật còn lại: {enemies.length}</div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={VIEW_WIDTH * TILE_SIZE}
        height={VIEW_HEIGHT * TILE_SIZE}
        onClick={handleCanvasClick}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          cursor: 'pointer',
          imageRendering: 'pixelated'
        }}
      />
      
      <div className="controls-info">
        <p>🎮 Điều khiển: WASD hoặc Arrow Keys</p>
        <p>🌱 Cỏ | 🌲 Rừng | ⛰️ Núi | 💧 Nước | 🕳️ Hang | 🏘️ Thị trấn</p>
        <p>👤 Bạn | 👹 Quái vật</p>
      </div>
    </div>
  );
}; 