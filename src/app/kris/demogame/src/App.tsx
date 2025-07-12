import React, { useState, useEffect } from 'react'
import { GameWorld, GameWorldState } from '../core/GameWorld'
import { WorldView } from './components/WorldView'
import { PlayerSprite, EnemySprite } from './components/PlayerSprite'
import { ItemRarity } from '../types/Item'
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
  Gem
} from 'lucide-react'

interface GameState {
  player: Player
  enemies: Enemy[]
  inventory: InventorySystem
  questSystem: QuestSystem
  achievementSystem: AchievementSystem
  combatLog: string[]
  currentView: 'main' | 'inventory' | 'shop' | 'skills' | 'quests' | 'achievements'
  message: string
  gameOver: boolean
}

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const player = new Player("Hero", 100, 20, 10)
    const enemies = [
      new Enemy("Goblin", 50, 15, 5, "normal"),
      new Enemy("Orc Warrior", 80, 25, 8, "elite"),
      new Enemy("Dragon", 200, 40, 15, "boss"),
      new Enemy("Dark Knight", 120, 30, 12, "rare"),
      new Enemy("Forest Troll", 150, 35, 10, "elite")
    ]
    const inventory = new InventorySystem()
    const questSystem = new QuestSystem()
    const achievementSystem = new AchievementSystem()

    return {
      player,
      enemies,
      inventory,
      questSystem,
      achievementSystem,
      combatLog: [],
      currentView: 'main',
      message: '',
      gameOver: false
    }
  })

  const combatSystem = new CombatSystem()

  const handleAttack = () => {
    if (gameState.enemies.length === 0) {
      setGameState(prev => ({ ...prev, message: "Không còn quái vật nào để chiến đấu!" }))
      return
    }

    const enemy = gameState.enemies[0]
    const result = combatSystem.fight(gameState.player, enemy)
    
    setGameState(prev => ({
      ...prev,
      combatLog: [...prev.combatLog, ...result.combatLog],
      message: ''
    }))

    if (result.enemyDefeated) {
      // Remove defeated enemy
      const newEnemies = gameState.enemies.slice(1)
      
      // Add random items
      let newMessage = `🎉 Đánh bại ${enemy.getName()}!`
      if (Math.random() < 0.4) {
        const randomItem = Math.random() < 0.7 ? 
          ItemFactory.getRandomPotion() : 
          ItemFactory.getRandomWeapon(gameState.player.getLevel())
        gameState.inventory.addItem(randomItem)
        newMessage += ` 🎁 Nhận được: ${randomItem.name}!`
      }

      // Update quest progress
      gameState.questSystem.updateQuestProgress('kill', enemy.getName())
      gameState.achievementSystem.updateProgress('kill_count', 'total_kills')
      
      if (enemy.getEnemyType() === 'boss') {
        gameState.achievementSystem.updateProgress('kill_count', 'boss_kills')
      }

      // Check quest completion
      const completedQuests = gameState.questSystem.checkQuestCompletion(gameState.player)
      if (completedQuests.length > 0) {
        completedQuests.forEach(quest => {
          gameState.questSystem.claimQuestReward(quest, gameState.player)
        })
        newMessage += ` 📜 Hoàn thành ${completedQuests.length} nhiệm vụ!`
      }

      // Check achievements
      const newAchievements = gameState.achievementSystem.updateProgress('level_reach', 'level', gameState.player.getLevel())
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          gameState.achievementSystem.claimAchievementReward(achievement, gameState.player)
        })
        newMessage += ` 🏆 Unlock ${newAchievements.length} thành tựu!`
      }

      setGameState(prev => ({
        ...prev,
        enemies: newEnemies,
        message: newMessage
      }))

      // Respawn enemies if all defeated
      if (newEnemies.length === 0) {
        setTimeout(() => {
          const respawnedEnemies = [
            new Enemy("Goblin", 50, 15, 5, "normal"),
            new Enemy("Orc Warrior", 80, 25, 8, "elite"),
            new Enemy("Dragon", 200, 40, 15, "boss"),
            new Enemy("Dark Knight", 120, 30, 12, "rare"),
            new Enemy("Forest Troll", 150, 35, 10, "elite")
          ]
          setGameState(prev => ({
            ...prev,
            enemies: respawnedEnemies,
            message: "🔄 Quái vật đã hồi sinh! Tiếp tục chiến đấu!"
          }))
        }, 2000)
      }
    } else if (result.playerDefeated) {
      setGameState(prev => ({ ...prev, gameOver: true }))
    }
  }

  const handleRest = () => {
    gameState.player.rest()
    setGameState(prev => ({ ...prev, message: "😴 Bạn đã nghỉ ngơi và hồi phục sức khỏe!" }))
  }

  const handleUseItem = (itemId: string) => {
    const success = gameState.inventory.useItem(itemId, gameState.player)
    setGameState(prev => ({ 
      ...prev, 
      message: success ? "✅ Item đã được sử dụng!" : "❌ Không thể sử dụng item này!"
    }))
  }

  const handleBuyItem = (itemIndex: number) => {
    const shopItems = [
      ItemFactory.createPotion("Health Potion", "heal", 50),
      ItemFactory.createPotion("Mana Potion", "mana", 40),
      ItemFactory.createWeapon("Iron Sword", 20, 1, ItemRarity.COMMON),
      ItemFactory.createWeapon("Steel Sword", 30, 2, ItemRarity.UNCOMMON),
      ItemFactory.createPotion("Strength Elixir", "strength", 5)
    ]

    const item = shopItems[itemIndex]
    const cost = ItemFactory.getItemValue(item)
    
    if (gameState.player.spendGold(cost)) {
      gameState.inventory.addItem(item)
      setGameState(prev => ({ 
        ...prev, 
        message: `🛒 Đã mua ${item.name} với giá ${cost} gold!`
      }))
    } else {
      setGameState(prev => ({ 
        ...prev, 
        message: "❌ Không đủ gold để mua item này!"
      }))
    }
  }

  const getRarityIcon = (rarity: ItemRarity) => {
    switch (rarity) {
      case ItemRarity.COMMON: return "⚪"
      case ItemRarity.UNCOMMON: return "🟢"
      case ItemRarity.RARE: return "🔵"
      case ItemRarity.EPIC: return "🟣"
      case ItemRarity.LEGENDARY: return "🟡"
      default: return "⚪"
    }
  }

  const getEnemyIcon = (enemyType: string) => {
    switch (enemyType) {
      case "normal": return "👹"
      case "elite": return "⭐"
      case "boss": return "👑"
      case "rare": return "💎"
      default: return "👹"
    }
  }

  const renderMainView = () => (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">🎮 RPG Adventure Game</h1>
        <p>📍 Khu vực: Forest</p>
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

      {/* Current Enemy */}
      {gameState.enemies.length > 0 && (
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h3>👹 Quái vật hiện tại</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
            <EnemySprite 
              type={gameState.enemies[0].getName().toLowerCase().includes('goblin') ? 'goblin' : 
                    gameState.enemies[0].getName().toLowerCase().includes('orc') ? 'orc' :
                    gameState.enemies[0].getName().toLowerCase().includes('dragon') ? 'dragon' :
                    gameState.enemies[0].getName().toLowerCase().includes('knight') ? 'dark-knight' : 'troll'}
              animation="idle"
              pixelSize={6}
              className="enemy-display"
            />
            <div style={{ marginLeft: '15px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {getEnemyIcon(gameState.enemies[0].getEnemyType())} {gameState.enemies[0].getName()}
              </div>
              <div>HP: {gameState.enemies[0].getHealth()}/{gameState.enemies[0].getMaxHealth()}</div>
              <div>ATK: {gameState.enemies[0].getAttack()} | DEF: {gameState.enemies[0].getDefense()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Game Menu */}
      <div className="game-menu">
        <button className="menu-button" onClick={handleAttack}>
          <Sword size={20} />
          Tấn công
        </button>
        <button className="menu-button" onClick={() => setGameState(prev => ({ ...prev, currentView: 'inventory' }))}>
          <Package size={20} />
          Túi đồ
        </button>
        <button className="menu-button" onClick={handleRest}>
          <Heart size={20} />
          Nghỉ ngơi
        </button>
        <button className="menu-button" onClick={() => setGameState(prev => ({ ...prev, currentView: 'shop' }))}>
          <Coins size={20} />
          Shop
        </button>
        <button className="menu-button" onClick={() => setGameState(prev => ({ ...prev, currentView: 'skills' }))}>
          <Zap size={20} />
          Skills
        </button>
        <button className="menu-button" onClick={() => setGameState(prev => ({ ...prev, currentView: 'quests' }))}>
          <BookOpen size={20} />
          Quests
        </button>
        <button className="menu-button" onClick={() => setGameState(prev => ({ ...prev, currentView: 'achievements' }))}>
          <Trophy size={20} />
          Achievements
        </button>
      </div>

      {/* Message */}
      {gameState.message && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '10px', 
          borderRadius: '8px', 
          marginTop: '10px' 
        }}>
          {gameState.message}
        </div>
      )}
    </div>
  )

  const renderInventory = () => (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">🎒 Túi đồ</h2>
          <button 
            className="close-button" 
            onClick={() => setGameState(prev => ({ ...prev, currentView: 'main' }))}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="inventory-grid">
          {gameState.inventory.getItems().map((item, index) => (
            <div 
              key={item.id} 
              className={`item-card ${item.rarity.toLowerCase()}`}
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
      { name: "Iron Sword", effect: "Tăng 20 ATK", cost: 200, icon: "⚔️" },
      { name: "Steel Sword", effect: "Tăng 30 ATK", cost: 300, icon: "🗡️" },
      { name: "Strength Elixir", effect: "Tăng 5 STR trong 5 phút", cost: 150, icon: "💪" }
    ]

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">🏪 Shop</h2>
            <button 
              className="close-button" 
              onClick={() => setGameState(prev => ({ ...prev, currentView: 'main' }))}
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
            onClick={() => setGameState(prev => ({ ...prev, currentView: 'main' }))}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <p>🎯 Skill Points: {gameState.player.getSkillPoints()}</p>
        </div>
        
        <div>
          <h3>Skills đã học:</h3>
          {gameState.player.getSkills().map((skill, index) => (
            <div key={index} style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '10px', 
              margin: '5px 0', 
              borderRadius: '8px' 
            }}>
              ✅ {skill}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Skills có thể học:</h3>
          <p>Fireball, Ice Bolt, Lightning Strike</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Nhập tên skill để học (cần 1 skill point)
          </p>
        </div>
      </div>
    </div>
  )

  const renderQuests = () => (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">📜 Quests</h2>
          <button 
            className="close-button" 
            onClick={() => setGameState(prev => ({ ...prev, currentView: 'main' }))}
          >
            <X size={24} />
          </button>
        </div>
        
        <div>
          <h3>Nhiệm vụ đang thực hiện:</h3>
          {gameState.questSystem.getActiveQuests().map((quest, index) => (
            <div key={index} className="quest-item">
              <div className="quest-title">{quest.name}</div>
              <div className="quest-description">{quest.description}</div>
              <div>Tiến độ: {quest.currentAmount}/{quest.targetAmount}</div>
              <div className="quest-progress">
                <div 
                  className="quest-progress-fill" 
                  style={{ width: `${(quest.currentAmount / quest.targetAmount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          
          {gameState.questSystem.getActiveQuests().length === 0 && (
            <p>Không có nhiệm vụ nào đang thực hiện</p>
          )}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Nhiệm vụ đã hoàn thành: {gameState.questSystem.getTotalQuestsCompleted()}</h3>
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
            onClick={() => setGameState(prev => ({ ...prev, currentView: 'main' }))}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <p>Hoàn thành: {gameState.achievementSystem.getCompletedAchievementsCount()}/{gameState.achievementSystem.getTotalAchievements()}</p>
          <p>Tỷ lệ: {gameState.achievementSystem.getCompletionRate().toFixed(1)}%</p>
        </div>
        
        <div>
          <h3>Thành tựu đã unlock:</h3>
          {gameState.achievementSystem.getCompletedAchievements().map((achievement, index) => (
            <div key={index} className="achievement-badge">
              {achievement.icon} {achievement.name}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Thành tựu sắp hoàn thành:</h3>
          {gameState.achievementSystem.getNextAchievements(gameState.player).map((achievement, index) => (
            <div key={index} style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '10px', 
              margin: '5px 0', 
              borderRadius: '8px' 
            }}>
              <div>{achievement.icon} {achievement.name}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{achievement.description}</div>
              <div>Tiến độ: {achievement.currentAmount}/{achievement.targetAmount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (gameState.gameOver) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">💀 GAME OVER</h1>
          <p>Bạn đã bị đánh bại! Game kết thúc.</p>
          <button 
            className="menu-button" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px' }}
          >
            Chơi lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {gameState.currentView === 'main' && renderMainView()}
      {gameState.currentView === 'inventory' && renderInventory()}
      {gameState.currentView === 'shop' && renderShop()}
      {gameState.currentView === 'skills' && renderSkills()}
      {gameState.currentView === 'quests' && renderQuests()}
      {gameState.currentView === 'achievements' && renderAchievements()}
    </div>
  )
}

export default App 