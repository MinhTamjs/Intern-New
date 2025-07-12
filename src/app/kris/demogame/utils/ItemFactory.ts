import { Item, ItemType, ItemRarity, Weapon, Armor, Potion, Scroll, ItemStats } from '../types/Item';

export class ItemFactory {
    private static itemIdCounter = 1;

    private static generateId(): string {
        return `item_${this.itemIdCounter++}`;
    }

    private static getRarityColor(rarity: ItemRarity): string {
        const colors = {
            [ItemRarity.COMMON]: "⚪",
            [ItemRarity.UNCOMMON]: "🟢",
            [ItemRarity.RARE]: "🔵",
            [ItemRarity.EPIC]: "🟣",
            [ItemRarity.LEGENDARY]: "🟡"
        };
        return colors[rarity];
    }

    public static createWeapon(name: string, damage: number, level: number = 1, rarity: ItemRarity = ItemRarity.COMMON): Weapon {
        const stats: ItemStats = {
            attack: damage,
            strength: Math.floor(damage * 0.5)
        };

        return {
            id: this.generateId(),
            name,
            description: `Vũ khí mạnh mẽ gây ${damage} damage`,
            type: ItemType.WEAPON,
            rarity,
            level,
            stats,
            value: damage * 10,
            stackable: false,
            damage,
            attackSpeed: 1.0
        };
    }

    public static createArmor(name: string, defense: number, armorType: "head" | "chest" | "legs" | "feet" | "hands", level: number = 1, rarity: ItemRarity = ItemRarity.COMMON): Armor {
        const stats: ItemStats = {
            defense,
            health: Math.floor(defense * 2)
        };

        return {
            id: this.generateId(),
            name,
            description: `Giáp bảo vệ với ${defense} defense`,
            type: ItemType.ARMOR,
            rarity,
            level,
            stats,
            value: defense * 8,
            stackable: false,
            armorType
        };
    }

    public static createPotion(name: string, effect: "heal" | "mana" | "strength" | "agility" | "intelligence", effectValue: number, rarity: ItemRarity = ItemRarity.COMMON): Potion {
        const descriptions = {
            heal: `Hồi phục ${effectValue} HP`,
            mana: `Hồi phục ${effectValue} Mana`,
            strength: `Tăng ${effectValue} Strength trong 5 phút`,
            agility: `Tăng ${effectValue} Agility trong 5 phút`,
            intelligence: `Tăng ${effectValue} Intelligence trong 5 phút`
        };

        return {
            id: this.generateId(),
            name,
            description: descriptions[effect],
            type: ItemType.POTION,
            rarity,
            level: 1,
            stats: {},
            value: effectValue * 2,
            stackable: true,
            quantity: 1,
            effect,
            effectValue,
            duration: effect === "heal" || effect === "mana" ? undefined : 300 // 5 minutes for buffs
        };
    }

    public static createScroll(name: string, spell: string, manaCost: number, damage: number, rarity: ItemRarity = ItemRarity.COMMON): Scroll {
        return {
            id: this.generateId(),
            name,
            description: `Cuộn giấy chứa phép thuật ${spell} gây ${damage} damage`,
            type: ItemType.SCROLL,
            rarity,
            level: 1,
            stats: {},
            value: damage * 5,
            stackable: true,
            quantity: 1,
            spell,
            manaCost,
            damage
        };
    }

    public static getRandomWeapon(level: number = 1): Weapon {
        const weapons = [
            { name: "Iron Sword", damage: 15, rarity: ItemRarity.COMMON },
            { name: "Steel Sword", damage: 25, rarity: ItemRarity.UNCOMMON },
            { name: "Magic Sword", damage: 35, rarity: ItemRarity.RARE },
            { name: "Dragon Slayer", damage: 50, rarity: ItemRarity.EPIC },
            { name: "Excalibur", damage: 75, rarity: ItemRarity.LEGENDARY }
        ];

        const availableWeapons = weapons.filter(w => w.damage <= level * 20);
        const weapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
        
        return this.createWeapon(weapon.name, weapon.damage, level, weapon.rarity);
    }

    public static getRandomPotion(): Potion {
        const potions = [
            { name: "Health Potion", effect: "heal" as const, value: 30 },
            { name: "Mana Potion", effect: "mana" as const, value: 25 },
            { name: "Strength Elixir", effect: "strength" as const, value: 5 },
            { name: "Agility Elixir", effect: "agility" as const, value: 5 },
            { name: "Intelligence Elixir", effect: "intelligence" as const, value: 5 }
        ];

        const potion = potions[Math.floor(Math.random() * potions.length)];
        return this.createPotion(potion.name, potion.effect, potion.value);
    }

    public static getItemDisplayName(item: Item): string {
        const rarityIcon = this.getRarityColor(item.rarity);
        return `${rarityIcon} ${item.name}`;
    }

    public static getItemValue(item: Item): number {
        const rarityMultiplier = {
            [ItemRarity.COMMON]: 1,
            [ItemRarity.UNCOMMON]: 2,
            [ItemRarity.RARE]: 5,
            [ItemRarity.EPIC]: 10,
            [ItemRarity.LEGENDARY]: 25
        };

        return Math.floor(item.value * rarityMultiplier[item.rarity]);
    }
} 