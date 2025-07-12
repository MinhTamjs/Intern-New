import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { ItemFactory } from '../utils/ItemFactory';
import { ItemRarity } from '../types/Item';

export interface Quest {
    id: string;
    name: string;
    description: string;
    type: 'kill' | 'collect' | 'reach_level' | 'earn_gold';
    target: string;
    targetAmount: number;
    currentAmount: number;
    reward: {
        gold: number;
        exp: number;
        items?: string[];
    };
    completed: boolean;
    level: number;
}

export class QuestSystem {
    private activeQuests: Quest[] = [];
    private completedQuests: Quest[] = [];
    private availableQuests: Quest[] = [];

    constructor() {
        this.initializeQuests();
    }

    private initializeQuests(): void {
        this.availableQuests = [
            {
                id: 'quest_001',
                name: 'Tiêu diệt Goblin',
                description: 'Đánh bại 3 con Goblin để chứng minh sức mạnh',
                type: 'kill',
                target: 'Goblin',
                targetAmount: 3,
                currentAmount: 0,
                reward: { gold: 50, exp: 30 },
                completed: false,
                level: 1
            },
            {
                id: 'quest_002',
                name: 'Thu thập Vũ khí',
                description: 'Thu thập 2 vũ khí từ quái vật',
                type: 'collect',
                target: 'weapon',
                targetAmount: 2,
                currentAmount: 0,
                reward: { gold: 100, exp: 50, items: ['Iron Sword'] },
                completed: false,
                level: 2
            },
            {
                id: 'quest_003',
                name: 'Trở thành Chiến binh',
                description: 'Đạt level 5 để trở thành chiến binh thực thụ',
                type: 'reach_level',
                target: 'level',
                targetAmount: 5,
                currentAmount: 1,
                reward: { gold: 200, exp: 100, items: ['Steel Sword'] },
                completed: false,
                level: 3
            },
            {
                id: 'quest_004',
                name: 'Thương nhân Giàu có',
                description: 'Kiếm được 500 gold',
                type: 'earn_gold',
                target: 'gold',
                targetAmount: 500,
                currentAmount: 0,
                reward: { gold: 300, exp: 150 },
                completed: false,
                level: 4
            },
            {
                id: 'quest_005',
                name: 'Săn Boss',
                description: 'Đánh bại Dragon - Boss mạnh nhất',
                type: 'kill',
                target: 'Dragon',
                targetAmount: 1,
                currentAmount: 0,
                reward: { gold: 1000, exp: 500, items: ['Dragon Slayer'] },
                completed: false,
                level: 5
            }
        ];
    }

    public getAvailableQuests(playerLevel: number): Quest[] {
        return this.availableQuests.filter(quest => 
            quest.level <= playerLevel && 
            !this.activeQuests.find(aq => aq.id === quest.id) &&
            !this.completedQuests.find(cq => cq.id === quest.id)
        );
    }

    public acceptQuest(questId: string, player: Player): boolean {
        const quest = this.availableQuests.find(q => q.id === questId);
        if (quest && quest.level <= player.getLevel()) {
            const activeQuest = { ...quest };
            this.activeQuests.push(activeQuest);
            return true;
        }
        return false;
    }

    public updateQuestProgress(type: string, target: string, amount: number = 1): void {
        this.activeQuests.forEach(quest => {
            if (quest.type === type && quest.target === target && !quest.completed) {
                quest.currentAmount += amount;
                
                if (quest.currentAmount >= quest.targetAmount) {
                    quest.completed = true;
                }
            }
        });
    }

    public checkQuestCompletion(player: Player): Quest[] {
        const completedQuests: Quest[] = [];
        
        this.activeQuests = this.activeQuests.filter(quest => {
            if (quest.completed) {
                completedQuests.push(quest);
                this.completedQuests.push(quest);
                return false;
            }
            return true;
        });

        return completedQuests;
    }

    public claimQuestReward(quest: Quest, player: Player): void {
        // Give gold and exp
        player.gainGold(quest.reward.gold);
        player.gainExperience(quest.reward.exp);

        // Give items if any
        if (quest.reward.items) {
            quest.reward.items.forEach(itemName => {
                switch (itemName) {
                    case 'Iron Sword':
                        const ironSword = ItemFactory.createWeapon('Iron Sword', 20, 1, ItemRarity.COMMON);
                        // Add to player inventory (would need inventory system reference)
                        break;
                    case 'Steel Sword':
                        const steelSword = ItemFactory.createWeapon('Steel Sword', 30, 2, ItemRarity.UNCOMMON);
                        break;
                    case 'Dragon Slayer':
                        const dragonSlayer = ItemFactory.createWeapon('Dragon Slayer', 50, 5, ItemRarity.EPIC);
                        break;
                }
            });
        }
    }

    public getActiveQuests(): Quest[] {
        return [...this.activeQuests];
    }

    public getCompletedQuests(): Quest[] {
        return [...this.completedQuests];
    }

    public getQuestProgress(questId: string): Quest | undefined {
        return this.activeQuests.find(q => q.id === questId);
    }

    public getTotalQuestsCompleted(): number {
        return this.completedQuests.length;
    }

    public getQuestCompletionRate(): number {
        const totalQuests = this.availableQuests.length;
        return totalQuests > 0 ? (this.completedQuests.length / totalQuests) * 100 : 0;
    }
} 