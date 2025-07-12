import React, { useState, useEffect } from 'react'
import { GameWorld, GameWorldState } from './core/GameWorld'
import { WorldView } from './components/WorldView'
import { PlayerSprite, EnemySprite } from './components/PlayerSprite'
// Simple ItemRarity enum
enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon', 
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Coins, 
  Target, 
  Package, 
  BookOpen, 
  Trophy,
  X,
  Crown,
  Star,
  Gem,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

function AppWorld() {
  const [gameWorld, setGameWorld] = useState<GameWorld>(new GameWorld())
  const [gameState, setGameState] = useState<GameWorldState>(gameWorld.getState())

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(gameWorld.getState())
    }, 100)

    return () => clearInterval(interval)
  }, [gameWorld])

  const handlePlayerMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    gameWorld.movePlayer(direction)
    setGameState(gameWorld.getState())
  }

  const handleCombatAction = (action: 'attack' | 'skill' | 'item' | 'flee') => {
    gameWorld.handleCombatAction(action)
    setGameState(gameWorld.getState())
  }

  const handleUseItem = (itemId: string) => {
    gameWorld.useItem(itemId)
    setGameState(gameWorld.getState())
  }

  const handleBuyItem = (itemIndex: number) => {
    gameWorld.buyItem(itemIndex)
    setGameState(gameWorld.getState())
  }

  const handleChangeView = (view: GameWorldState['currentView']) => {
    gameWorld.changeView(view)
    setGameState(gameWorld.getState())
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⚪'
      case 'uncommon': return '🟢'
      case 'rare': return '🔵'
      case 'epic': return '🟣'
      case 'legendary': return '🟡'
      default: return '⚪'
    }
  }

  const getEnemyIcon = (enemyType: string) => {
    switch (enemyType.toLowerCase()) {
      case 'goblin': return '👹'
      case 'orc': return '👹'
      case 'dragon': return '🐉'
      case 'dark knight': return '⚔️'
      case 'troll': return '👹'
      default: return '👹'
    }
  }

  const renderWorldView = () => (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">🗺️ RPG Adventure World</h1>
        <p>📍 Khu vực: {gameState.world.getTile(gameState.world.getPlayerPosition()).description}</p>
      </div>

      {/* Player Character Display */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <PlayerSprite 
          animation="idle"
          pixelSize={6}
          className="player-display"
          effects={{
            glow: gameState.player.getLevel() > 5,
            glowColor: '#FFD700'
          }}
        />
      </div>

      {/* Player Stats */}
      <div className="player-stats">
        <div className="stat-card">
          <div className="stat-label">❤️ HP</div>
          <div className="stat-value">{gameState.player.getHealth()}/{gameState.player.getMaxHealth()}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill progress-hp" 
              style={{ width: `${gameState.player.getHealthPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">🔮 MP</div>
          <div className="stat-value">{gameState.player.getMana()}/{gameState.player.getMaxMana()}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill progress-mp" 
              style={{ width: `${gameState.player.getManaPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">⚔️ ATK</div>
          <div className="stat-value">{gameState.player.getAttack()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">🛡️ DEF</div>
          <div className="stat-value">{gameState.player.getDefense()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">💰 Gold</div>
          <div className="stat-value">{gameState.player.getGold()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">📊 Level</div>
          <div className="stat-value">{gameState.player.getLevel()}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill progress-exp" 
              style={{ width: `${gameState.player.getExperienceProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* World View */}
      <WorldView 
        world={gameState.world}
        onPlayerMove={handlePlayerMove}
        className="world-view-container"
      />

      {/* Game Menu */}
      <div className="game-menu">
        <button className="menu-button" onClick={() => handleChangeView('inventory')}>
          <Package size={20} />
          Túi đồ
        </button>
        <button className="menu-button" onClick={() => handleChangeView('shop')}>
          <Coins size={20} />
          Shop
        </button>
        <button className="menu-button" onClick={() => handleChangeView('skills')}>
          <Zap size={20} />
          Skills
        </button>
        <button className="menu-button" onClick={() => handleChangeView('quests')}>
          <BookOpen size={20} />
          Quests
        </button>
        <button className="menu-button" onClick={() => handleChangeView('achievements')}>
          <Trophy size={20} />
          Achievements
        </button>
        <button className="menu-button" onClick={() => gameWorld.respawnEnemies()}>
          <Target size={20} />
          Respawn
        </button>
      </div>

      {/* Message */}
      {gameState.message && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '10px', 
          borderRadius: '8px', 
          marginTop: '10px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {gameState.message}
        </div>
      )}
    </div>
  )

  const renderCombatView = () => (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">⚔️ Combat</h1>
      </div>

      {/* Combat Scene */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <PlayerSprite 
            animation="attack"
            pixelSize={8}
            className="player-display"
          />
          <div style={{ marginTop: '10px' }}>
            <div>👤 {gameState.player.getName()}</div>
            <div>HP: {gameState.player.getHealth()}/{gameState.player.getMaxHealth()}</div>
          </div>
        </div>

        <div style={{ fontSize: '2rem' }}>⚔️</div>

        <div style={{ textAlign: 'center' }}>
          <EnemySprite 
            type={gameState.currentEnemy?.getName().toLowerCase().includes('goblin') ? 'goblin' : 
                  gameState.currentEnemy?.getName().toLowerCase().includes('orc') ? 'orc' :
                  gameState.currentEnemy?.getName().toLowerCase().includes('dragon') ? 'dragon' :
                  gameState.currentEnemy?.getName().toLowerCase().includes('knight') ? 'dark-knight' : 'troll'}
            animation="attack"
            pixelSize={8}
            className="enemy-display"
          />
          <div style={{ marginTop: '10px' }}>
            <div>👹 {gameState.currentEnemy?.getName()}</div>
            <div>HP: {gameState.currentEnemy?.getHealth()}/{gameState.currentEnemy?.getMaxHealth()}</div>
          </div>
        </div>
      </div>

      {/* Combat Log */}
      {gameState.combatLog.length > 0 && (
        <div className="combat-log">
          <h3>⚔️ Combat Log</h3>
          {gameState.combatLog.slice(-5).map((log, index) => (
            <div key={index} className="log-entry normal">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Combat Actions */}
      <div className="game-menu">
        <button className="menu-button" onClick={() => handleCombatAction('attack')}>
          <Sword size={20} />
          Tấn công
        </button>
        <button className="menu-button" onClick={() => handleCombatAction('skill')}>
          <Zap size={20} />
          Skill
        </button>
        <button className="menu-button" onClick={() => handleCombatAction('item')}>
          <Package size={20} />
          Item
        </button>
        <button className="menu-button" onClick={() => handleCombatAction('flee')}>
          <ArrowLeft size={20} />
          Chạy
        </button>
      </div>
    </div>
  )

  const renderInventory = () => (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">🎒 Túi đồ</h2>
          <button 
            className="close-button" 
            onClick={() => handleChangeView('world')}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="inventory-grid">
          {gameState.inventory.getItems().map((item, index) => (
            <div 
              key={item.id} 
              className={`item-card ${item.rarity}`}
              onClick={() => handleUseItem(item.id)}
            >
              <div className="item-icon">{getRarityIcon(item.rarity)}</div>
              <div className="item-name">{item.name}</div>
              <div className="item-description">{item.description}</div>
              {item.quantity && <div>Qty: {item.quantity}</div>}
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Tổng giá trị: {gameState.inventory.getInventoryValue()} gold</p>
          <p>Còn {gameState.inventory.getInventorySpace()} slot</p>
        </div>
      </div>
    </div>
  )

  const renderShop = () => {
    const shopItems = [
      { name: "Health Potion", effect: "Hồi phục 50 HP", cost: 100, icon: "❤️" },
      { name: "Mana Potion", effect: "Hồi phục 40 MP", cost: 80, icon: "🔮" },
      { name: "Strength Elixir", effect: "Tăng 5 STR trong 5 phút", cost: 150, icon: "💪" }
    ]

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">🏪 Shop</h2>
            <button 
              className="close-button" 
              onClick={() => handleChangeView('world')}
            >
              <X size={24} />
            </button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p>💰 Gold hiện có: {gameState.player.getGold()}</p>
          </div>
          
          <div className="inventory-grid">
            {shopItems.map((item, index) => {
              const canAfford = gameState.player.getGold() >= item.cost
              return (
                <div 
                  key={index}
                  className={`item-card ${canAfford ? 'common' : 'legendary'}`}
                  onClick={() => canAfford && handleBuyItem(index)}
                  style={{ opacity: canAfford ? 1 : 0.5, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                >
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-description">{item.effect}</div>
                  <div style={{ color: canAfford ? '#4ade80' : '#ef4444' }}>
                    {item.cost} gold {!canAfford && '(Không đủ)'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderSkills = () => (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">📚 Skills</h2>
          <button 
            className="close-button" 
            onClick={() => handleChangeView('world')}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>🔮 Skill system sẽ được implement trong phiên bản tiếp theo!</p>
        </div>
      </div>
    </div>
  )

  const renderQuests = () => (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">🎯 Quests</h2>
          <button 
            className="close-button" 
            onClick={() => handleChangeView('world')}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>🎯 Quest system sẽ được implement trong phiên bản tiếp theo!</p>
        </div>
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">🏆 Achievements</h2>
          <button 
            className="close-button" 
            onClick={() => handleChangeView('world')}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>🏆 Achievement system sẽ được implement trong phiên bản tiếp theo!</p>
        </div>
      </div>
    </div>
  )

  // Render based on current view
  switch (gameState.currentView) {
    case 'combat':
      return renderCombatView()
    case 'inventory':
      return renderInventory()
    case 'shop':
      return renderShop()
    case 'skills':
      return renderSkills()
    case 'quests':
      return renderQuests()
    case 'achievements':
      return renderAchievements()
    default:
      return renderWorldView()
  }
}

export default AppWorld 