import { Player } from '../entities/Player';
import { ItemRarity } from '../types/Item';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    type: 'kill_count' | 'level_reach' | 'gold_earned' | 'items_collected' | 'quests_completed' | 'rare_items';
    target: string;
    targetAmount: number;
    currentAmount: number;
    completed: boolean;
    reward: {
        title?: string;
        gold?: number;
        exp?: number;
    };
    icon: string;
}

export class AchievementSystem {
    private achievements: Achievement[] = [];
    private completedAchievements: Achievement[] = [];

    constructor() {
        this.initializeAchievements();
    }

    private initializeAchievements(): void {
        this.achievements = [
            {
                id: 'ach_001',
                name: 'Sát thủ Bắt đầu',
                description: 'Đánh bại 10 quái vật đầu tiên',
                type: 'kill_count',
                target: 'total_kills',
                targetAmount: 10,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Sát thủ', gold: 100, exp: 50 },
                icon: '⚔️'
            },
            {
                id: 'ach_002',
                name: 'Chiến binh Mới',
                description: 'Đạt level 3',
                type: 'level_reach',
                target: 'level',
                targetAmount: 3,
                currentAmount: 1,
                completed: false,
                reward: { title: 'Chiến binh', gold: 200, exp: 100 },
                icon: '🛡️'
            },
            {
                id: 'ach_003',
                name: 'Thương nhân',
                description: 'Kiếm được 1000 gold',
                type: 'gold_earned',
                target: 'total_gold',
                targetAmount: 1000,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Thương nhân', gold: 500, exp: 200 },
                icon: '💰'
            },
            {
                id: 'ach_004',
                name: 'Nhà sưu tập',
                description: 'Thu thập 20 items',
                type: 'items_collected',
                target: 'total_items',
                targetAmount: 20,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Nhà sưu tập', gold: 300, exp: 150 },
                icon: '🎒'
            },
            {
                id: 'ach_005',
                name: 'Săn Boss',
                description: 'Đánh bại 5 boss',
                type: 'kill_count',
                target: 'boss_kills',
                targetAmount: 5,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Boss Slayer', gold: 1000, exp: 500 },
                icon: '👑'
            },
            {
                id: 'ach_006',
                name: 'Chiến binh Bậc thầy',
                description: 'Đạt level 10',
                type: 'level_reach',
                target: 'level',
                targetAmount: 10,
                currentAmount: 1,
                completed: false,
                reward: { title: 'Bậc thầy', gold: 2000, exp: 1000 },
                icon: '🏆'
            },
            {
                id: 'ach_007',
                name: 'Nhà sưu tập Hiếm',
                description: 'Thu thập 5 items hiếm (Rare+)',
                type: 'rare_items',
                target: 'rare_items',
                targetAmount: 5,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Sưu tập Hiếm', gold: 800, exp: 400 },
                icon: '💎'
            },
            {
                id: 'ach_008',
                name: 'Hoàn thành Nhiệm vụ',
                description: 'Hoàn thành 10 quests',
                type: 'quests_completed',
                target: 'quests_completed',
                targetAmount: 10,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Thám hiểm', gold: 600, exp: 300 },
                icon: '📜'
            },
            {
                id: 'ach_009',
                name: 'Sát thủ Hàng loạt',
                description: 'Đánh bại 100 quái vật',
                type: 'kill_count',
                target: 'total_kills',
                targetAmount: 100,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Sát thủ Hàng loạt', gold: 1500, exp: 750 },
                icon: '⚔️⚔️'
            },
            {
                id: 'ach_010',
                name: 'Tỷ phú',
                description: 'Kiếm được 10000 gold',
                type: 'gold_earned',
                target: 'total_gold',
                targetAmount: 10000,
                currentAmount: 0,
                completed: false,
                reward: { title: 'Tỷ phú', gold: 5000, exp: 2000 },
                icon: '💎💰'
            }
        ];
    }

    public updateProgress(type: string, target: string, amount: number = 1): Achievement[] {
        const newlyCompleted: Achievement[] = [];

        this.achievements.forEach(achievement => {
            if (achievement.type === type && achievement.target === target && !achievement.completed) {
                achievement.currentAmount += amount;
                
                if (achievement.currentAmount >= achievement.targetAmount) {
                    achievement.completed = true;
                    newlyCompleted.push(achievement);
                    this.completedAchievements.push(achievement);
                }
            }
        });

        return newlyCompleted;
    }

    public claimAchievementReward(achievement: Achievement, player: Player): void {
        if (achievement.reward.gold) {
            player.gainGold(achievement.reward.gold);
        }
        if (achievement.reward.exp) {
            player.gainExperience(achievement.reward.exp);
        }
    }

    public getActiveAchievements(): Achievement[] {
        return this.achievements.filter(a => !a.completed);
    }

    public getCompletedAchievements(): Achievement[] {
        return [...this.completedAchievements];
    }

    public getAchievementProgress(achievementId: string): Achievement | undefined {
        return this.achievements.find(a => a.id === achievementId);
    }

    public getTotalAchievements(): number {
        return this.achievements.length;
    }

    public getCompletedAchievementsCount(): number {
        return this.completedAchievements.length;
    }

    public getCompletionRate(): number {
        return this.achievements.length > 0 ? 
            (this.completedAchievements.length / this.achievements.length) * 100 : 0;
    }

    public getAchievementsByType(type: string): Achievement[] {
        return this.achievements.filter(a => a.type === type);
    }

    public getRecentAchievements(count: number = 5): Achievement[] {
        return this.completedAchievements.slice(-count);
    }

    public getNextAchievements(player: Player): Achievement[] {
        return this.achievements
            .filter(a => !a.completed)
            .sort((a, b) => {
                // Sort by completion percentage
                const aProgress = (a.currentAmount / a.targetAmount) * 100;
                const bProgress = (b.currentAmount / b.targetAmount) * 100;
                return bProgress - aProgress;
            })
            .slice(0, 3);
    }
} 