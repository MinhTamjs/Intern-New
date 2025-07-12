import React, { useState, useEffect } from 'react';
import { World3D } from './components/World3D';
import { Character3D } from './components/Character3D';
import { GameWorld } from './core/GameWorld';
import { Position } from './core/World';
import './App3D.css';

export const App3D: React.FC = () => {
  const [gameWorld] = useState(() => new GameWorld());
  const [playerPosition, setPlayerPosition] = useState(gameWorld.getPlayerPosition());
  const [enemies, setEnemies] = useState(gameWorld.getEnemies());
  const [isAttacking, setIsAttacking] = useState(false);
  const [gameStats, setGameStats] = useState({
    health: 100,
    level: 1,
    experience: 0,
    enemiesDefeated: 0
  });

  const handlePlayerMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    console.log('App3D: Moving player', direction);
    const oldPosition = gameWorld.getPlayerPosition();
    gameWorld.movePlayer(direction);
    const newPosition = gameWorld.getPlayerPosition();
    
    if (oldPosition.x !== newPosition.x || oldPosition.y !== newPosition.y) {
      console.log('Player moved from', oldPosition, 'to', newPosition);
      setPlayerPosition(newPosition);
      setEnemies(gameWorld.getEnemies());
      
      // Check for combat
      const currentTile = gameWorld.getTile(newPosition);
      if (currentTile.enemies && currentTile.enemies.length > 0) {
        handleCombat(currentTile.enemies[0]);
      }
    } else {
      console.log('Player movement blocked');
    }
  };

  const handleCombat = (enemy: any) => {
    setIsAttacking(true);
    
    // Simulate combat
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 20) + 10;
      const newHealth = Math.max(0, gameStats.health - damage);
      const newExperience = gameStats.experience + 25;
      const newLevel = Math.floor(newExperience / 100) + 1;
      
      setGameStats({
        ...gameStats,
        health: newHealth,
        experience: newExperience,
        level: newLevel,
        enemiesDefeated: gameStats.enemiesDefeated + 1
      });
      
      setIsAttacking(false);
      
      // Remove enemy from world
      gameWorld.removeEnemy(enemy);
      setEnemies(gameWorld.getEnemies());
    }, 1000);
  };

  const handleTileClick = (position: Position) => {
    console.log('Clicked tile at:', position);
    // Future: Add interaction with tiles
  };

  const getEnemyType = (enemy: any): 'goblin' | 'orc' | 'troll' | 'dark-knight' => {
    const types: ('goblin' | 'orc' | 'troll' | 'dark-knight')[] = ['goblin', 'orc', 'troll', 'dark-knight'];
    return types[enemy.id % types.length];
  };

  return (
    <div className="app-3d">
      <div className="game-header">
        <h1>🎮 RPG Adventure 3D</h1>
        <div className="game-stats">
          <div className="stat">
            <span>❤️ HP:</span>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${gameStats.health}%` }}
              />
            </div>
            <span>{gameStats.health}/100</span>
          </div>
          <div className="stat">
            <span>⭐ Level:</span>
            <span>{gameStats.level}</span>
          </div>
          <div className="stat">
            <span>📈 EXP:</span>
            <span>{gameStats.experience}</span>
          </div>
          <div className="stat">
            <span>⚔️ Defeated:</span>
            <span>{gameStats.enemiesDefeated}</span>
          </div>
        </div>
      </div>

      <div className="game-content">
              <div className="world-section">
        <h2>🌍 Thế Giới 3D</h2>
        <div className="player-indicator">
          <div className="player-marker">👤</div>
          <span>Bạn đang ở đây: ({playerPosition.x}, {playerPosition.y})</span>
          <div className="tile-info">
            Khu vực: {gameWorld.getTile(playerPosition).description}
          </div>
        </div>
        <World3D
          world={gameWorld}
          onPlayerMove={handlePlayerMove}
          onTileClick={handleTileClick}
          className="world-3d-container"
        />
      </div>

        <div className="characters-section">
          <h2>👥 Nhân Vật</h2>
          <div className="characters-grid">
            <div className="character-card">
              <h3>👤 Người Chơi</h3>
              <Character3D
                type="player"
                position={{ x: 0, y: 0, z: 0 }}
                isAttacking={isAttacking}
              />
              <div className="character-info">
                <p>Vị trí: ({playerPosition.x}, {playerPosition.y})</p>
                <p>Khu vực: {gameWorld.getTile(playerPosition).description}</p>
              </div>
            </div>

            {enemies.slice(0, 4).map((enemy, index) => (
              <div key={enemy.id} className="character-card">
                <h3>👹 {enemy.name}</h3>
                <Character3D
                  type="enemy"
                  enemyType={getEnemyType(enemy)}
                  position={{ x: index * 2, y: 0, z: 0 }}
                  isAttacking={false}
                />
                <div className="character-info">
                  <p>HP: {enemy.health}</p>
                  <p>Vị trí: ({enemy.position.x}, {enemy.position.y})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="game-controls">
        <h3>🎮 Điều Khiển</h3>
        <div className="controls-grid">
          <div className="control-group">
            <h4>Di Chuyển</h4>
            <div className="control-buttons">
              <button onClick={() => handlePlayerMove('up')}>⬆️ W/↑</button>
              <button onClick={() => handlePlayerMove('down')}>⬇️ S/↓</button>
              <button onClick={() => handlePlayerMove('left')}>⬅️ A/←</button>
              <button onClick={() => handlePlayerMove('right')}>➡️ D/→</button>
            </div>
          </div>
          
          <div className="control-group">
            <h4>Camera</h4>
            <p>🖱️ Click và kéo để xoay camera</p>
            <p>🔍 Scroll để zoom in/out</p>
          </div>
        </div>
      </div>

      <div className="game-info">
        <h3>ℹ️ Thông Tin Game</h3>
        <div className="info-grid">
          <div className="info-section">
            <h4>🌱 Khu Vực</h4>
            <ul>
              <li>🌱 Cỏ - Di chuyển bình thường</li>
              <li>🌲 Rừng - Tăng EXP khi khám phá</li>
              <li>⛰️ Núi - Chậm hơn nhưng có kho báu</li>
              <li>💧 Nước - Không thể đi qua</li>
              <li>🕳️ Hang - Nhiều quái vật</li>
              <li>🏘️ Thị trấn - An toàn, hồi phục HP</li>
            </ul>
          </div>
          
          <div className="info-section">
            <h4>⚔️ Chiến Đấu</h4>
            <ul>
              <li>Di chuyển vào ô có quái vật để chiến đấu</li>
              <li>Mỗi quái vật cho 25 EXP</li>
              <li>100 EXP = Level up</li>
              <li>Level up = Tăng HP và sức mạnh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 