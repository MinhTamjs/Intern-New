export abstract class Character {
    protected name: string;
    protected health: number;
    protected maxHealth: number;
    protected attack: number;
    protected defense: number;
    protected level: number = 1;
    protected experience: number = 0;
    protected experienceToNextLevel: number = 100;
    protected strength: number = 10;
    protected agility: number = 10;
    protected intelligence: number = 10;

    constructor(name: string, health: number, attack: number, defense: number) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.attack = attack;
        this.defense = defense;
    }

    public takeDamage(damage: number): number {
        const actualDamage = Math.max(1, damage);
        this.health = Math.max(0, this.health - actualDamage);
        return actualDamage;
    }

    public heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    public isAlive(): boolean {
        return this.health > 0;
    }

    public gainExperience(exp: number): void {
        this.experience += exp;
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    protected levelUp(): void {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2);
        
        // Increase stats
        this.maxHealth += 10;
        this.health = this.maxHealth; // Full heal on level up
        this.attack += 2;
        this.defense += 1;
        
        // Increase attributes
        this.strength += 1;
        this.agility += 1;
        this.intelligence += 1;
    }

    public getExperienceProgress(): number {
        return (this.experience / this.experienceToNextLevel) * 100;
    }

    // Getters
    public getName(): string { return this.name; }
    public getHealth(): number { return this.health; }
    public getMaxHealth(): number { return this.maxHealth; }
    public getAttack(): number { return this.attack; }
    public getDefense(): number { return this.defense; }
    public getLevel(): number { return this.level; }
    public getExperience(): number { return this.experience; }
    public getExperienceToNextLevel(): number { return this.experienceToNextLevel; }
    public getStrength(): number { return this.strength; }
    public getAgility(): number { return this.agility; }
    public getIntelligence(): number { return this.intelligence; }
    public getHealthPercentage(): number { return (this.health / this.maxHealth) * 100; }
} 