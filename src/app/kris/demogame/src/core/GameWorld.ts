import { World, Position } from './World';

// Simple interfaces for basic functionality
interface SimplePlayer {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  gold: number;
  mana: number;
  maxMana: number;
  getName(): string;
  getHealth(): number;
  getMaxHealth(): number;
  getAttack(): number;
  getDefense(): number;
  getLevel(): number;
  getExperience(): number;
  getGold(): number;
  getMana(): number;
  getMaxMana(): number;
  getHealthPercentage(): number;
  getManaPercentage(): number;
  getExperienceProgress(): number;
  gainExperience(exp: number): void;
  addGold(amount: number): void;
  spendGold(amount: number): boolean;
  heal(amount: number): void;
  setHealth(health: number): void;
  takeDamage(damage: number): void;
  isDead(): boolean;
}

interface SimpleEnemy {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  level: number;
  getName(): string;
  getHealth(): number;
  getMaxHealth(): number;
  getAttack(): number;
  getDefense(): number;
  getLevel(): number;
  takeDamage(damage: number): void;
  isDead(): boolean;
}

interface SimpleItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  quantity?: number;
}

interface SimpleInventory {
  items: SimpleItem[];
  getItems(): SimpleItem[];
  addItem(item: SimpleItem): void;
  useItem(itemId: string, player: SimplePlayer): boolean;
  getInventoryValue(): number;
  getInventorySpace(): number;
}

export interface GameWorldState {
  player: SimplePlayer;
  world: World;
  inventory: SimpleInventory;
  combatLog: string[];
  currentView: 'world' | 'inventory' | 'shop' | 'skills' | 'quests' | 'achievements' | 'combat';
  message: string;
  gameOver: boolean;
  inCombat: boolean;
  currentEnemy: SimpleEnemy | null;
}

// Simple combat system
class SimpleCombatSystem {
  fight(attacker: SimplePlayer | SimpleEnemy, defender: SimplePlayer | SimpleEnemy): {
    damageDealt: number;
    criticalHit: boolean;
    dodge: boolean;
    enemyDefeated: boolean;
    playerDefeated: boolean;
  } {
    const attack = attacker.getAttack();
    const defense = defender.getDefense();
    const damage = Math.max(1, attack - defense);
    
    // Simple combat logic
    const criticalHit = Math.random() < 0.1; // 10% chance
    const dodge = Math.random() < 0.05; // 5% chance
    
    let finalDamage = damage;
    if (criticalHit) finalDamage *= 2;
    if (dodge) finalDamage = 0;
    
    defender.takeDamage(finalDamage);
    
    return {
      damageDealt: finalDamage,
      criticalHit,
      dodge,
      enemyDefeated: defender.isDead(),
      playerDefeated: defender.isDead()
    };
  }
}

// Simple item factory
class SimpleItemFactory {
  static createPotion(name: string, effect: string, value: number): SimpleItem {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: effect,
      rarity: 'common',
      quantity: 1
    };
  }
  
  static getRandomPotion(): SimpleItem {
    const potions = [
      { name: "Health Potion", effect: "Hồi phục 50 HP", value: 50 },
      { name: "Mana Potion", effect: "Hồi phục 40 MP", value: 40 }
    ];
    const potion = potions[Math.floor(Math.random() * potions.length)];
    return this.createPotion(potion.name, potion.effect, potion.value);
  }
  
  static getItemValue(item: SimpleItem): number {
    return 100; // Simple fixed value
  }
}

export class GameWorld {
  private state: GameWorldState;
  private combatSystem: SimpleCombatSystem;

  constructor() {
    this.combatSystem = new SimpleCombatSystem();
    
    // Create simple player
    const player: SimplePlayer = {
      name: "Hero",
      health: 100,
      maxHealth: 100,
      attack: 20,
      defense: 10,
      level: 1,
      experience: 0,
      gold: 100,
      mana: 50,
      maxMana: 50,
      getName: function() { return this.name; },
      getHealth: function() { return this.health; },
      getMaxHealth: function() { return this.maxHealth; },
      getAttack: function() { return this.attack; },
      getDefense: function() { return this.defense; },
      getLevel: function() { return this.level; },
      getExperience: function() { return this.experience; },
      getGold: function() { return this.gold; },
      getMana: function() { return this.mana; },
      getMaxMana: function() { return this.maxMana; },
      getHealthPercentage: function() { return (this.health / this.maxHealth) * 100; },
      getManaPercentage: function() { return (this.mana / this.maxMana) * 100; },
      getExperienceProgress: function() { return (this.experience % 100); },
      gainExperience: function(exp: number) { 
        this.experience += exp;
        if (this.experience >= 100) {
          this.level++;
          this.experience -= 100;
          this.maxHealth += 10;
          this.health = this.maxHealth;
          this.attack += 2;
          this.defense += 1;
        }
      },
      addGold: function(amount: number) { this.gold += amount; },
      spendGold: function(amount: number) { 
        if (this.gold >= amount) {
          this.gold -= amount;
          return true;
        }
        return false;
      },
      heal: function(amount: number) { 
        this.health = Math.min(this.maxHealth, this.health + amount);
      },
      setHealth: function(health: number) { this.health = health; },
      takeDamage: function(damage: number) { 
        this.health = Math.max(0, this.health - damage);
      },
      isDead: function() { return this.health <= 0; }
    };

    // Create simple inventory
    const inventory: SimpleInventory = {
      items: [],
      getItems: function() { return this.items; },
      addItem: function(item: SimpleItem) { this.items.push(item); },
      useItem: function(itemId: string, player: SimplePlayer) {
        const item = this.items.find(i => i.id === itemId);
        if (item && item.name.includes("Health")) {
          player.heal(50);
          this.items = this.items.filter(i => i.id !== itemId);
          return true;
        }
        return false;
      },
      getInventoryValue: function() { return this.items.length * 100; },
      getInventorySpace: function() { return 20 - this.items.length; }
    };

    this.state = {
      player,
      world: new World(20, 15),
      inventory,
      combatLog: [],
      currentView: 'world',
      message: '',
      gameOver: false,
      inCombat: false,
      currentEnemy: null
    };

    this.initializeGame();
  }

  private initializeGame(): void {
    // Add starting items
    this.state.inventory.addItem(SimpleItemFactory.createPotion("Health Potion", "Hồi phục 50 HP", 50));
    this.state.inventory.addItem(SimpleItemFactory.createPotion("Mana Potion", "Hồi phục 40 MP", 40));
    
    this.addMessage("🎮 Chào mừng đến với RPG Adventure World!");
    this.addMessage("🎯 Sử dụng WASD hoặc Arrow Keys để di chuyển");
    this.addMessage("⚔️ Di chuyển vào quái vật để chiến đấu");
  }

  public getState(): GameWorldState {
    return { ...this.state };
  }

  public movePlayer(direction: 'up' | 'down' | 'left' | 'right'): void {
    if (this.state.inCombat || this.state.gameOver) return;

    const moved = this.state.world.movePlayer(direction);
    
    if (moved) {
      this.addMessage(`Di chuyển ${direction}`);
      
      // Check for enemy encounter
      const enemy = this.state.world.checkForEnemy();
      if (enemy) {
        this.startCombat(enemy);
        return;
      }

      // Check for random encounter
      if (this.state.world.checkRandomEncounter()) {
        this.startRandomEncounter();
        return;
      }
    } else {
      this.addMessage("Không thể di chuyển đến vị trí này!");
    }
  }

  private startCombat(enemyData: {position: Position, type: string}): void {
    const enemy = this.createEnemyFromType(enemyData.type);
    this.state.currentEnemy = enemy;
    this.state.inCombat = true;
    this.state.currentView = 'combat';
    
    this.addMessage(`⚔️ Gặp phải ${enemy.getName()}!`);
    this.addMessage(`HP: ${enemy.getHealth()}/${enemy.getMaxHealth()}`);
  }

  private startRandomEncounter(): void {
    const enemyTypes = ['goblin', 'orc', 'troll', 'dark-knight'];
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemy = this.createEnemyFromType(randomType);
    
    this.state.currentEnemy = enemy;
    this.state.inCombat = true;
    this.state.currentView = 'combat';
    
    this.addMessage(`👹 Gặp phải ${enemy.getName()}!`);
    this.addMessage(`HP: ${enemy.getHealth()}/${enemy.getMaxHealth()}`);
  }

  private createEnemyFromType(type: string): SimpleEnemy {
    let enemyData: any;
    
    switch (type) {
      case 'goblin':
        enemyData = { name: "Goblin", health: 50, maxHealth: 50, attack: 15, defense: 5, level: 1 };
        break;
      case 'orc':
        enemyData = { name: "Orc Warrior", health: 80, maxHealth: 80, attack: 25, defense: 8, level: 2 };
        break;
      case 'troll':
        enemyData = { name: "Forest Troll", health: 150, maxHealth: 150, attack: 35, defense: 10, level: 3 };
        break;
      case 'dark-knight':
        enemyData = { name: "Dark Knight", health: 120, maxHealth: 120, attack: 30, defense: 12, level: 4 };
        break;
      default:
        enemyData = { name: "Unknown", health: 60, maxHealth: 60, attack: 20, defense: 6, level: 1 };
    }

    return {
      ...enemyData,
      getName: function() { return this.name; },
      getHealth: function() { return this.health; },
      getMaxHealth: function() { return this.maxHealth; },
      getAttack: function() { return this.attack; },
      getDefense: function() { return this.defense; },
      getLevel: function() { return this.level; },
      takeDamage: function(damage: number) { this.health = Math.max(0, this.health - damage); },
      isDead: function() { return this.health <= 0; }
    };
  }

  public handleCombatAction(action: 'attack' | 'skill' | 'item' | 'flee'): void {
    if (!this.state.inCombat || !this.state.currentEnemy) return;

    switch (action) {
      case 'attack':
        this.performAttack();
        break;
      case 'skill':
        this.performSkill();
        break;
      case 'item':
        this.useItemInCombat();
        break;
      case 'flee':
        this.fleeFromCombat();
        break;
    }
  }

  private performAttack(): void {
    if (!this.state.currentEnemy) return;

    const result = this.combatSystem.fight(this.state.player, this.state.currentEnemy);
    
    // Add combat log
    this.state.combatLog.push(`⚔️ ${this.state.player.getName()} tấn công ${this.state.currentEnemy.getName()}`);
    if (result.criticalHit) {
      this.state.combatLog.push(`💥 Critical Hit! Gây ${result.damageDealt} sát thương!`);
    } else if (result.dodge) {
      this.state.combatLog.push(`🛡️ ${this.state.currentEnemy.getName()} né tránh!`);
    } else {
      this.state.combatLog.push(`💥 Gây ${result.damageDealt} sát thương!`);
    }

    if (result.enemyDefeated) {
      this.handleEnemyDefeat();
    } else {
      // Enemy counter-attack
      const enemyResult = this.combatSystem.fight(this.state.currentEnemy, this.state.player);
      this.state.combatLog.push(`👹 ${this.state.currentEnemy.getName()} tấn công ${this.state.player.getName()}`);
      this.state.combatLog.push(`💥 Gây ${enemyResult.damageDealt} sát thương!`);

      if (enemyResult.enemyDefeated) {
        this.handlePlayerDefeat();
      }
    }

    // Keep only last 10 combat log entries
    if (this.state.combatLog.length > 10) {
      this.state.combatLog = this.state.combatLog.slice(-10);
    }
  }

  private performSkill(): void {
    this.addMessage("🔮 Skill system chưa được implement!");
  }

  private useItemInCombat(): void {
    this.addMessage("🎒 Item system chưa được implement!");
  }

  private fleeFromCombat(): void {
    const fleeChance = 0.5; // 50% chance to flee
    if (Math.random() < fleeChance) {
      this.addMessage("🏃‍♂️ Bạn đã chạy thoát thành công!");
      this.endCombat();
    } else {
      this.addMessage("❌ Không thể chạy thoát!");
      // Enemy gets a free attack
      if (this.state.currentEnemy) {
        const result = this.combatSystem.fight(this.state.currentEnemy, this.state.player);
        this.state.combatLog.push(`👹 ${this.state.currentEnemy.getName()} tấn công khi bạn chạy!`);
        this.state.combatLog.push(`💥 Gây ${result.damageDealt} sát thương!`);
        
        if (result.enemyDefeated) {
          this.handlePlayerDefeat();
        }
      }
    }
  }

  private handleEnemyDefeat(): void {
    if (!this.state.currentEnemy) return;

    const enemy = this.state.currentEnemy;
    const exp = enemy.getLevel() * 10;
    const gold = enemy.getLevel() * 5;

    this.state.player.gainExperience(exp);
    this.state.player.addGold(gold);

    this.addMessage(`🎉 Đánh bại ${enemy.getName()}!`);
    this.addMessage(`📈 Nhận ${exp} EXP và ${gold} Gold!`);

    // Random item drop
    if (Math.random() < 0.3) { // 30% chance
      const item = SimpleItemFactory.getRandomPotion();
      this.state.inventory.addItem(item);
      this.addMessage(`🎁 Nhận được: ${item.name}!`);
    }

    this.endCombat();
  }

  private handlePlayerDefeat(): void {
    this.addMessage("💀 Bạn đã bị đánh bại!");
    this.addMessage("🔄 Hồi sinh với 50% HP...");
    
    this.state.player.setHealth(Math.floor(this.state.player.getMaxHealth() * 0.5));
    this.endCombat();
  }

  private endCombat(): void {
    this.state.inCombat = false;
    this.state.currentEnemy = null;
    this.state.currentView = 'world';
  }

  public changeView(view: GameWorldState['currentView']): void {
    this.state.currentView = view;
  }

  public useItem(itemId: string): void {
    const success = this.state.inventory.useItem(itemId, this.state.player);
    if (success) {
      this.addMessage("✅ Item đã được sử dụng!");
    } else {
      this.addMessage("❌ Không thể sử dụng item này!");
    }
  }

  public buyItem(itemIndex: number): void {
    const shopItems = this.getShopItems();
    if (itemIndex >= 0 && itemIndex < shopItems.length) {
      const item = shopItems[itemIndex];
      const cost = SimpleItemFactory.getItemValue(item);
      
      if (this.state.player.spendGold(cost)) {
        this.state.inventory.addItem(item);
        this.addMessage(`🛒 Đã mua ${item.name} với giá ${cost} gold!`);
      } else {
        this.addMessage("❌ Không đủ gold!");
      }
    }
  }

  private getShopItems() {
    return [
      SimpleItemFactory.createPotion("Health Potion", "Hồi phục 50 HP", 50),
      SimpleItemFactory.createPotion("Mana Potion", "Hồi phục 40 MP", 40),
      SimpleItemFactory.createPotion("Strength Elixir", "Tăng 5 STR trong 5 phút", 5)
    ];
  }

  private addMessage(message: string): void {
    this.state.message = message;
    // Clear message after 3 seconds
    setTimeout(() => {
      this.state.message = '';
    }, 3000);
  }

  public respawnEnemies(): void {
    this.state.world.respawnEnemies();
    this.addMessage("👹 Quái vật đã hồi sinh!");
  }

  // Methods for 3D world integration
  public getPlayerPosition(): Position {
    return this.state.world.getPlayerPosition();
  }

  public getEnemies(): any[] {
    return this.state.world.getEnemies();
  }

  public getTile(position: Position): any {
    return this.state.world.getTile(position);
  }

  public removeEnemy(enemy: any): void {
    // Remove enemy from world by filtering
    const enemies = this.state.world.getEnemies();
    const filteredEnemies = enemies.filter(e => 
      e.position.x !== enemy.position.x || e.position.y !== enemy.position.y
    );
    // Note: This is a simplified approach since World doesn't have removeEnemy method
  }

  public getWorldMap(): any[][] {
    return this.state.world.getWorldMap();
  }

  public getWorldDimensions(): { width: number; height: number } {
    return this.state.world.getWorldDimensions();
  }
} 