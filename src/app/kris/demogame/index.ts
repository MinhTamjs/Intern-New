import { Game } from './core/Game';
import { GameUI } from './ui/GameUI';
import { QuestSystem } from './systems/QuestSystem';
import { AchievementSystem } from './systems/AchievementSystem';

class RPGGame {
    private game: Game;
    private ui: GameUI;
    private questSystem: QuestSystem;
    private achievementSystem: AchievementSystem;

    constructor() {
        this.game = new Game();
        this.ui = new GameUI();
        this.questSystem = new QuestSystem();
        this.achievementSystem = new AchievementSystem();
    }

    public start(): void {
        this.game.start();
        this.runGameLoop();
    }

    private runGameLoop(): void {
        while (true) {
            // Kiểm tra game over
            if (this.game.getPlayer().getHealth() <= 0) {
                this.ui.showGameOver();
                break;
            }

            // Clear screen và render game
            this.ui.clearScreen();
            this.game.render();
            
            // Show quest progress
            this.showQuestProgress();
            
            // Show achievement notifications
            this.checkAchievements();

            const input = this.ui.getPlayerInput("Nhập lệnh của bạn: ");
            
            if (input.toLowerCase() === 'quit' || input.toLowerCase() === '6') {
                console.log("Cảm ơn bạn đã chơi game!");
                break;
            }

            this.game.handlePlayerAction(input);
            
            // Kiểm tra nếu game đã kết thúc
            if (!this.game.getIsRunning()) {
                break;
            }
            
            // Tạm dừng để người chơi đọc thông tin
            this.ui.getPlayerInput("Nhấn Enter để tiếp tục...");
        }
    }

    private showQuestProgress(): void {
        const player = this.game.getPlayer();
        const activeQuests = this.questSystem.getActiveQuests();
        
        if (activeQuests.length > 0) {
            console.log("📜 Nhiệm vụ đang thực hiện:");
            activeQuests.forEach(quest => {
                const progress = (quest.currentAmount / quest.targetAmount) * 100;
                console.log(`   ${quest.name}: ${quest.currentAmount}/${quest.targetAmount} (${progress.toFixed(1)}%)`);
            });
            console.log("");
        }
    }

    private checkAchievements(): void {
        const player = this.game.getPlayer();
        const playerStats = player.getPlayerStats();
        
        // Update achievement progress based on player stats
        this.achievementSystem.updateProgress('level_reach', 'level', player.getLevel());
        this.achievementSystem.updateProgress('gold_earned', 'total_gold', player.getGold());
        
        // Check for newly completed achievements
        const completedAchievements = this.achievementSystem.getCompletedAchievements();
        const recentAchievements = completedAchievements.slice(-3); // Get last 3 completed
        
        if (recentAchievements.length > 0) {
            console.log("🏆 Thành tựu mới:");
            recentAchievements.forEach(achievement => {
                console.log(`   ${achievement.icon} ${achievement.name} - ${achievement.description}`);
                this.achievementSystem.claimAchievementReward(achievement, player);
            });
            console.log("");
        }
    }

    private handleCombatRewards(enemyName: string): void {
        const player = this.game.getPlayer();
        
        // Update quest progress
        this.questSystem.updateQuestProgress('kill', enemyName);
        
        // Update achievement progress
        this.achievementSystem.updateProgress('kill_count', 'total_kills');
        
        if (enemyName.includes('Dragon') || enemyName.includes('Boss')) {
            this.achievementSystem.updateProgress('kill_count', 'boss_kills');
        }
        
        // Check for completed quests
        const completedQuests = this.questSystem.checkQuestCompletion(player);
        if (completedQuests.length > 0) {
            console.log("🎉 Nhiệm vụ hoàn thành:");
            completedQuests.forEach(quest => {
                console.log(`   ${quest.name} - Nhận ${quest.reward.gold} gold và ${quest.reward.exp} exp!`);
                this.questSystem.claimQuestReward(quest, player);
            });
            console.log("");
        }
    }
}

// Khởi chạy game
console.log("🎮 Đang khởi động RPG Adventure Game...");
const rpgGame = new RPGGame();
rpgGame.start(); 