export enum ItemType {
    WEAPON = "weapon",
    ARMOR = "armor",
    POTION = "potion",
    SCROLL = "scroll",
    MATERIAL = "material"
}

export enum ItemRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary"
}

export interface ItemStats {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
    strength?: number;
    agility?: number;
    intelligence?: number;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    level: number;
    stats: ItemStats;
    value: number;
    stackable: boolean;
    quantity?: number;
}

export interface Weapon extends Item {
    type: ItemType.WEAPON;
    damage: number;
    attackSpeed: number;
}

export interface Armor extends Item {
    type: ItemType.ARMOR;
    armorType: "head" | "chest" | "legs" | "feet" | "hands";
}

export interface Potion extends Item {
    type: ItemType.POTION;
    effect: "heal" | "mana" | "strength" | "agility" | "intelligence";
    effectValue: number;
    duration?: number;
}

export interface Scroll extends Item {
    type: ItemType.SCROLL;
    spell: string;
    manaCost: number;
    damage: number;
} 