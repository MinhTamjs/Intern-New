import { Item, ItemType, ItemRarity, Weapon, Armor, Potion, Scroll } from '../types/Item';
import { ItemFactory } from '../utils/ItemFactory';
import { Player } from '../entities/Player';

export interface Equipment {
    weapon?: Weapon;
    head?: Armor;
    chest?: Armor;
    legs?: Armor;
    feet?: Armor;
    hands?: Armor;
}

export class InventorySystem {
    private items: Item[] = [];
    private equipment: Equipment = {};
    private maxInventorySize: number = 20;

    constructor() {
        this.addStartingItems();
    }

    private addStartingItems(): void {
        this.addItem(ItemFactory.createPotion("Health Potion", "heal", 30));
        this.addItem(ItemFactory.createPotion("Mana Potion", "mana", 25));
        this.addItem(ItemFactory.createWeapon("Wooden Sword", 8, 1, ItemRarity.COMMON));
    }

    public addItem(item: Item): boolean {
        if (this.items.length >= this.maxInventorySize) {
            return false;
        }

        // Check if item is stackable and already exists
        if (item.stackable) {
            const existingItem = this.items.find(i => i.id === item.id);
            if (existingItem && existingItem.quantity) {
                existingItem.quantity += item.quantity || 1;
                return true;
            }
        }

        this.items.push({ ...item });
        return true;
    }

    public removeItem(itemId: string, quantity: number = 1): boolean {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return false;

        const item = this.items[itemIndex];
        if (item.stackable && item.quantity) {
            if (item.quantity <= quantity) {
                this.items.splice(itemIndex, 1);
            } else {
                item.quantity -= quantity;
            }
        } else {
            this.items.splice(itemIndex, 1);
        }

        return true;
    }

    public useItem(itemId: string, player: Player): boolean {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return false;

        switch (item.type) {
            case ItemType.POTION:
                return this.usePotion(item as Potion, player);
            case ItemType.SCROLL:
                return this.useScroll(item as Scroll, player);
            case ItemType.WEAPON:
            case ItemType.ARMOR:
                return this.equipItem(item, player);
            default:
                return false;
        }
    }

    private usePotion(potion: Potion, player: Player): boolean {
        switch (potion.effect) {
            case "heal":
                player.heal(potion.effectValue);
                break;
            case "mana":
                // Assuming Player has a method to restore mana
                if (typeof (player as any).restoreMana === 'function') {
                    (player as any).restoreMana(potion.effectValue);
                }
                break;
            case "strength":
            case "agility":
            case "intelligence":
                // Apply temporary buffs (would need buff system)
                break;
        }

        this.removeItem(potion.id, 1);
        return true;
    }

    private useScroll(scroll: Scroll, player: Player): boolean {
        // Check if player has enough mana
        if (player.getMana() < scroll.manaCost) {
            return false;
        }

        // Use mana and cast spell
        player.useMana(scroll.manaCost);
        this.removeItem(scroll.id, 1);
        return true;
    }

    private equipItem(item: Item, player: Player): boolean {
        if (item.type === ItemType.WEAPON) {
            const weapon = item as Weapon;
            const oldWeapon = this.equipment.weapon;
            
            if (oldWeapon) {
                this.addItem(oldWeapon);
            }
            
            this.equipment.weapon = weapon;
            this.removeItem(weapon.id, 1);
            
            // Apply weapon stats to player
            this.applyItemStats(weapon, player);
            return true;
        }

        if (item.type === ItemType.ARMOR) {
            const armor = item as Armor;
            const oldArmor = this.equipment[armor.armorType];
            
            if (oldArmor) {
                this.addItem(oldArmor);
            }
            
            this.equipment[armor.armorType] = armor;
            this.removeItem(armor.id, 1);
            
            // Apply armor stats to player
            this.applyItemStats(armor, player);
            return true;
        }

        return false;
    }

    private applyItemStats(item: Item, player: Player): void {
        // This would need to be implemented based on how Player stats work
        // For now, we'll just log the stats
        console.log(`Applied stats from ${item.name}:`, item.stats);
    }

    public getItems(): Item[] {
        return [...this.items];
    }

    public getEquipment(): Equipment {
        return { ...this.equipment };
    }

    public getItemById(itemId: string): Item | undefined {
        return this.items.find(item => item.id === itemId);
    }

    public getItemsByType(type: ItemType): Item[] {
        return this.items.filter(item => item.type === type);
    }

    public getItemsByRarity(rarity: ItemRarity): Item[] {
        return this.items.filter(item => item.rarity === rarity);
    }

    public getInventoryValue(): number {
        return this.items.reduce((total, item) => {
            const value = ItemFactory.getItemValue(item);
            const quantity = item.quantity || 1;
            return total + (value * quantity);
        }, 0);
    }

    public getInventoryWeight(): number {
        return this.items.reduce((total, item) => {
            const weight = item.type === ItemType.WEAPON ? 2 : 1;
            const quantity = item.quantity || 1;
            return total + (weight * quantity);
        }, 0);
    }

    public isInventoryFull(): boolean {
        return this.items.length >= this.maxInventorySize;
    }

    public getInventorySpace(): number {
        return this.maxInventorySize - this.items.length;
    }

    public sortInventory(): void {
        this.items.sort((a, b) => {
            // Sort by rarity first
            const rarityOrder = [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC, ItemRarity.LEGENDARY];
            const aRarityIndex = rarityOrder.indexOf(a.rarity);
            const bRarityIndex = rarityOrder.indexOf(b.rarity);
            
            if (aRarityIndex !== bRarityIndex) {
                return bRarityIndex - aRarityIndex; // Higher rarity first
            }
            
            // Then sort by type
            const typeOrder = [ItemType.WEAPON, ItemType.ARMOR, ItemType.POTION, ItemType.SCROLL, ItemType.MATERIAL];
            const aTypeIndex = typeOrder.indexOf(a.type);
            const bTypeIndex = typeOrder.indexOf(b.type);
            
            if (aTypeIndex !== bTypeIndex) {
                return aTypeIndex - bTypeIndex;
            }
            
            // Finally sort by name
            return a.name.localeCompare(b.name);
        });
    }
} 