import { Character } from './Character';

export interface EnemyRewards {
    gold: number;
    exp: number;
    items?: string[];
}

export class Enemy extends Character {
    private rewards: EnemyRewards;
    private enemyType: string;

    constructor(name: string, health: number, attack: number, defense: number, enemyType: string = "normal") {
        super(name, health, attack, defense);
        this.enemyType = enemyType;
        this.rewards = this.calculateRewards();
    }

    private calculateRewards(): EnemyRewards {
        const baseGold = this.level * 5 + Math.floor(Math.random() * 10);
        const baseExp = this.level * 15 + Math.floor(Math.random() * 20);
        
        // Bonus rewards for different enemy types
        let goldMultiplier = 1;
        let expMultiplier = 1;
        
        switch (this.enemyType) {
            case "elite":
                goldMultiplier = 2;
                expMultiplier = 1.5;
                break;
            case "boss":
                goldMultiplier = 5;
                expMultiplier = 3;
                break;
            case "rare":
                goldMultiplier = 3;
                expMultiplier = 2;
                break;
        }

        return {
            gold: Math.floor(baseGold * goldMultiplier),
            exp: Math.floor(baseExp * expMultiplier),
            items: this.generateRandomItems()
        };
    }

    private generateRandomItems(): string[] {
        const items: string[] = [];
        const itemChance = 0.3; // 30% chance to drop an item
        
        if (Math.random() < itemChance) {
            const possibleItems = ["Health Potion", "Mana Potion", "Iron Sword", "Leather Armor"];
            const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            items.push(randomItem);
        }

        return items;
    }

    public attackPlayer(player: Character): number {
        return player.takeDamage(this.attack);
    }

    public getRewards(): EnemyRewards {
        return this.rewards;
    }

    public getEnemyType(): string {
        return this.enemyType;
    }

    public isElite(): boolean {
        return this.enemyType === "elite" || this.enemyType === "boss";
    }

    public getDisplayName(): string {
        const typeIcons: { [key: string]: string } = {
            "normal": "",
            "elite": "⭐",
            "boss": "👑",
            "rare": "💎"
        };
        return `${typeIcons[this.enemyType] || ""} ${this.name}`;
    }
} 