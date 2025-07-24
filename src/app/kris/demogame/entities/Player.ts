import { Character } from './Character';
import { Item, ItemType, ItemRarity } from '../types/Item';
import { ItemFactory } from '../utils/ItemFactory';

export interface PlayerStats {
    baseAttack: number;
    baseDefense: number;
    baseHealth: number;
    baseMana: number;
    equipmentAttack: number;
    equipmentDefense: number;
    equipmentHealth: number;
    equipmentMana: number;
    totalAttack: number;
    totalDefense: number;
    totalHealth: number;
    totalMana: number;
}

export class Player extends Character {
    private gold: number = 0;
    private mana: number = 50;
    private maxMana: number = 50;
    private equipment: { [key: string]: Item } = {};
    private skills: string[] = [];
    private skillPoints: number = 0;

    constructor(name: string, health: number, attack: number, defense: number) {
        super(name, health, attack, defense);
        this.addStartingSkills();
    }

    private addStartingSkills(): void {
        this.skills.push("Basic Attack");
        this.skills.push("Rest");
    }

    public rest(): void {
        this.heal(20);
        this.mana = this.maxMana;
    }

    public useMana(amount: number): boolean {
        if (this.mana >= amount) {
            this.mana -= amount;
            return true;
        }
        return false;
    }

    public restoreMana(amount: number): void {
        this.mana = Math.min(this.maxMana, this.mana + amount);
    }

    public gainGold(amount: number): void {
        this.gold += amount;
    }

    public spendGold(amount: number): boolean {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    public castSpell(spellCost: number, spellDamage: number): number {
        if (this.useMana(spellCost)) {
            return spellDamage;
        }
        return 0;
    }

    public equipItem(item: Item): boolean {
        if (item.type === ItemType.WEAPON || item.type === ItemType.ARMOR) {
            const slot = item.type === ItemType.WEAPON ? 'weapon' : 'armor';
            this.equipment[slot] = item;
            this.recalculateStats();
            return true;
        }
        return false;
    }

    public unequipItem(slot: string): Item | null {
        const item = this.equipment[slot];
        if (item) {
            delete this.equipment[slot];
            this.recalculateStats();
            return item;
        }
        return null;
    }

    private recalculateStats(): void {
        // Reset to base stats
        this.attack = this.getBaseAttack();
        this.defense = this.getBaseDefense();
        this.maxHealth = this.getBaseHealth();
        this.maxMana = this.getBaseMana();

        // Apply equipment bonuses
        Object.values(this.equipment).forEach(item => {
            if (item.stats.attack) this.attack += item.stats.attack;
            if (item.stats.defense) this.defense += item.stats.defense;
            if (item.stats.health) this.maxHealth += item.stats.health;
            if (item.stats.mana) this.maxMana += item.stats.mana;
        });

        // Ensure current health/mana don't exceed new maximums
        this.health = Math.min(this.health, this.maxHealth);
        this.mana = Math.min(this.mana, this.maxMana);
    }

    private getBaseAttack(): number {
        return 20 + (this.level - 1) * 2 + Math.floor(this.strength * 0.5);
    }

    private getBaseDefense(): number {
        return 10 + (this.level - 1) * 1 + Math.floor(this.agility * 0.3);
    }

    private getBaseHealth(): number {
        return 100 + (this.level - 1) * 10 + this.strength * 2;
    }

    private getBaseMana(): number {
        return 50 + (this.level - 1) * 5 + this.intelligence * 3;
    }

    public learnSkill(skillName: string): boolean {
        if (this.skillPoints > 0 && !this.skills.includes(skillName)) {
            this.skills.push(skillName);
            this.skillPoints--;
            return true;
        }
        return false;
    }

    public hasSkill(skillName: string): boolean {
        return this.skills.includes(skillName);
    }

    public getPlayerStats(): PlayerStats {
        const baseAttack = this.getBaseAttack();
        const baseDefense = this.getBaseDefense();
        const baseHealth = this.getBaseHealth();
        const baseMana = this.getBaseMana();

        let equipmentAttack = 0;
        let equipmentDefense = 0;
        let equipmentHealth = 0;
        let equipmentMana = 0;

        Object.values(this.equipment).forEach(item => {
            if (item.stats.attack) equipmentAttack += item.stats.attack;
            if (item.stats.defense) equipmentDefense += item.stats.defense;
            if (item.stats.health) equipmentHealth += item.stats.health;
            if (item.stats.mana) equipmentMana += item.stats.mana;
        });

        return {
            baseAttack,
            baseDefense,
            baseHealth,
            baseMana,
            equipmentAttack,
            equipmentDefense,
            equipmentHealth,
            equipmentMana,
            totalAttack: baseAttack + equipmentAttack,
            totalDefense: baseDefense + equipmentDefense,
            totalHealth: baseHealth + equipmentHealth,
            totalMana: baseMana + equipmentMana
        };
    }

    protected levelUp(): void {
        super.levelUp();
        this.maxMana += 10;
        this.mana = this.maxMana;
        this.skillPoints += 2; // Gain skill points on level up
        this.recalculateStats();
    }

    // Additional getters
    public getGold(): number { return this.gold; }
    public getMana(): number { return this.mana; }
    public getMaxMana(): number { return this.maxMana; }
    public getManaPercentage(): number { return (this.mana / this.maxMana) * 100; }
    public getEquipment(): { [key: string]: Item } { return { ...this.equipment }; }
    public getSkills(): string[] { return [...this.skills]; }
    public getSkillPoints(): number { return this.skillPoints; }
} 