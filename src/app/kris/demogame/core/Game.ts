import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { CombatSystem } from '../systems/CombatSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { GameUI } from '../ui/GameUI';
import { GameState } from './GameState';
import { ItemFactory } from '../utils/ItemFactory';
import { ItemRarity } from '../types/Item';

export class Game {
    private player: Player;
    private enemies: Enemy[] = [];
    private combatSystem: CombatSystem;
    private inventorySystem: InventorySystem;
    private ui: GameUI;
    private gameState: GameState;
    private isRunning: boolean = false;
    private currentArea: string = "Forest";

    constructor() {
        this.gameState = new GameState();
        this.player = new Player("Hero", 100, 20, 10);
        this.combatSystem = new CombatSystem();
        this.inventorySystem = new InventorySystem();
        this.ui = new GameUI();
        
        this.initializeGame();
    }

    private initializeGame(): void {
        this.ui.showWelcomeMessage();
        this.spawnEnemies();
    }

    private spawnEnemies(): void {
        this.enemies = [
            new Enemy("Goblin", 50, 15, 5, "normal"),
            new Enemy("Orc Warrior", 80, 25, 8, "elite"),
            new Enemy("Dragon", 200, 40, 15, "boss"),
            new Enemy("Dark Knight", 120, 30, 12, "rare"),
            new Enemy("Forest Troll", 150, 35, 10, "elite")
        ];
    }

    public start(): void {
        this.isRunning = true;
    }

    public update(): void {
        this.gameState.update();
    }

    public render(): void {
        this.ui.showPlayerStatus(this.player);
        this.ui.showGameMenu();
        this.ui.showCurrentArea(this.currentArea);
    }

    public handlePlayerAction(action: string): void {
        switch (action.toLowerCase()) {
            case 'attack':
            case '1':
                this.handleCombat();
                break;
            case 'inventory':
            case '2':
                this.handleInventory();
                break;
            case 'rest':
            case '3':
                this.player.rest();
                this.ui.showMessage("Bạn đã nghỉ ngơi và hồi phục sức khỏe!");
                break;
            case 'shop':
            case '4':
                this.handleShop();
                break;
            case 'skills':
            case '5':
                this.handleSkills();
                break;
            case 'quit':
            case '6':
                this.isRunning = false;
                break;
            default:
                this.ui.showMessage("Hành động không hợp lệ!");
        }
    }

    private handleCombat(): void {
        if (this.enemies.length === 0) {
            this.ui.showMessage("Không còn quái vật nào để chiến đấu!");
            return;
        }

        const enemy = this.enemies[0];
        const result = this.combatSystem.fight(this.player, enemy);
        
        // Hiển thị kết quả chiến đấu với combat log
        this.ui.showCombatResult(result);
        
        if (result.enemyDefeated) {
            this.enemies.shift();
            
            // Add random items to inventory
            if (Math.random() < 0.4) { // 40% chance to get item
                const randomItem = Math.random() < 0.7 ? 
                    ItemFactory.getRandomPotion() : 
                    ItemFactory.getRandomWeapon(this.player.getLevel());
                this.inventorySystem.addItem(randomItem);
                this.ui.showMessage(`🎁 Nhận được: ${randomItem.name}!`);
            }
            
            // Check if all enemies defeated
            if (this.enemies.length === 0) {
                this.ui.showMessage("🎉 CHÚC MỪNG! Bạn đã hoàn thành game! 🎉");
                this.ui.showMessage("Bạn có thể tiếp tục chơi để level up và tìm items hiếm!");
                this.spawnEnemies(); // Respawn enemies for continued gameplay
            }
        } else if (result.playerDefeated) {
            this.gameOver();
        }
    }

    private handleInventory(): void {
        this.ui.showInventory(this.inventorySystem);
        const input = this.ui.getPlayerInput("Nhập ID item để sử dụng (hoặc Enter để thoát): ");
        
        if (input.trim()) {
            const success = this.inventorySystem.useItem(input, this.player);
            if (success) {
                this.ui.showMessage("Item đã được sử dụng!");
            } else {
                this.ui.showMessage("Không thể sử dụng item này!");
            }
        }
    }

    private handleShop(): void {
        this.ui.showShop(this.player.getGold());
        const input = this.ui.getPlayerInput("Nhập số để mua (hoặc Enter để thoát): ");
        
        if (input.trim()) {
            const itemNumber = parseInt(input);
            const shopItems = this.getShopItems();
            
            if (itemNumber >= 1 && itemNumber <= shopItems.length) {
                const item = shopItems[itemNumber - 1];
                const cost = ItemFactory.getItemValue(item);
                
                if (this.player.spendGold(cost)) {
                    this.inventorySystem.addItem(item);
                    this.ui.showMessage(`Đã mua ${item.name} với giá ${cost} gold!`);
                } else {
                    this.ui.showMessage("Không đủ gold để mua item này!");
                }
            }
        }
    }

    private handleSkills(): void {
        this.ui.showSkills(this.player);
        const input = this.ui.getPlayerInput("Nhập tên skill để học (hoặc Enter để thoát): ");
        
        if (input.trim()) {
            const success = this.player.learnSkill(input);
            if (success) {
                this.ui.showMessage(`Đã học skill: ${input}!`);
            } else {
                this.ui.showMessage("Không thể học skill này!");
            }
        }
    }

    private getShopItems() {
        return [
            ItemFactory.createPotion("Health Potion", "heal", 50),
            ItemFactory.createPotion("Mana Potion", "mana", 40),
            ItemFactory.createWeapon("Iron Sword", 20, 1, ItemRarity.COMMON),
            ItemFactory.createWeapon("Steel Sword", 30, 2, ItemRarity.UNCOMMON),
            ItemFactory.createPotion("Strength Elixir", "strength", 5)
        ];
    }

    private gameOver(): void {
        this.ui.showGameOver();
        this.isRunning = false;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    public getIsRunning(): boolean {
        return this.isRunning;
    }

    public getInventorySystem(): InventorySystem {
        return this.inventorySystem;
    }
} 