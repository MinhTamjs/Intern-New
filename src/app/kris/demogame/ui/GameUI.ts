import { Player } from '../entities/Player';
import { InventorySystem } from '../systems/InventorySystem';
import { CombatResult } from '../systems/CombatSystem';
import { ItemFactory } from '../utils/ItemFactory';
import * as readline from 'readline-sync';

export class GameUI {
    public showWelcomeMessage(): void {
        console.clear();
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                    🎮 RPG ADVENTURE GAME 🎮                  ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log("║  Chào mừng bạn đến với thế giới RPG!                         ║");
        console.log("║  Hãy chiến đấu với quái vật, thu thập items và level up!     ║");
        console.log("║  Sử dụng các lệnh để điều khiển nhân vật của bạn.            ║");
        console.log("╚══════════════════════════════════════════════════════════════╝");
        console.log("");
    }

    public showPlayerStatus(player: Player): void {
        const stats = player.getPlayerStats();
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log(`║  👤 ${player.getName()} - Level ${player.getLevel()} (${player.getExperienceProgress().toFixed(1)}% EXP)  ║`);
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log(`║  ❤️  HP: ${player.getHealth()}/${stats.totalHealth} (${player.getHealthPercentage().toFixed(1)}%)  ║`);
        console.log(`║  🔮 MP: ${player.getMana()}/${stats.totalMana} (${player.getManaPercentage().toFixed(1)}%)  ║`);
        console.log(`║  ⚔️  ATK: ${stats.totalAttack} (Base: ${stats.baseAttack} + Equip: ${stats.equipmentAttack})  ║`);
        console.log(`║  🛡️  DEF: ${stats.totalDefense} (Base: ${stats.baseDefense} + Equip: ${stats.equipmentDefense})  ║`);
        console.log(`║  💰 Gold: ${player.getGold()} | 🎯 Skill Points: ${player.getSkillPoints()}  ║`);
        console.log("╚══════════════════════════════════════════════════════════════╝");
    }

    public showCurrentArea(area: string): void {
        console.log(`📍 Khu vực hiện tại: ${area}`);
        console.log("");
    }

    public showGameMenu(): void {
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                        🎮 MENU CHÍNH 🎮                     ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log("║  1. ⚔️  Tấn công quái vật                                    ║");
        console.log("║  2. 🎒 Mở túi đồ                                             ║");
        console.log("║  3. 😴 Nghỉ ngơi                                             ║");
        console.log("║  4. 🏪 Vào shop                                              ║");
        console.log("║  5. 📚 Xem skills                                            ║");
        console.log("║  6. 🚪 Thoát game                                            ║");
        console.log("╚══════════════════════════════════════════════════════════════╝");
        console.log("");
    }

    public showCombatResult(result: CombatResult): void {
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                        ⚔️  CHIẾN ĐẤU ⚔️                      ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        
        // Show combat log
        result.combatLog.forEach(log => {
            console.log(`║  ${log.padEnd(54)} ║`);
        });
        
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log(`║  💥 Damage gây ra: ${result.enemyDamage} | 💔 Damage nhận: ${result.playerDamage}  ║`);
        
        if (result.criticalHit) {
            console.log("║  💥 ĐÒN ĐÁNH CHÍ MẠNG!                                    ║");
        }
        if (result.dodge) {
            console.log("║  ⚡ NÉ TRÁNH THÀNH CÔNG!                                  ║");
        }
        
        console.log("╚══════════════════════════════════════════════════════════════╝");
    }

    public showInventory(inventory: InventorySystem): void {
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                        🎒 TÚI ĐỒ 🎒                          ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        
        const items = inventory.getItems();
        if (items.length === 0) {
            console.log("║  Túi đồ trống!                                            ║");
        } else {
            items.forEach((item, index) => {
                const displayName = ItemFactory.getItemDisplayName(item);
                const quantity = item.quantity ? ` x${item.quantity}` : '';
                const value = ItemFactory.getItemValue(item);
                console.log(`║  ${(index + 1).toString().padStart(2)}. ${displayName}${quantity} (${value} gold)  ║`);
                console.log(`║     ${item.description.padEnd(50)} ║`);
            });
        }
        
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log(`║  Tổng giá trị: ${inventory.getInventoryValue()} gold | Còn ${inventory.getInventorySpace()} slot  ║`);
        console.log("╚══════════════════════════════════════════════════════════════╝");
    }

    public showShop(playerGold: number): void {
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                        🏪 SHOP 🏪                           ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log(`║  💰 Gold hiện có: ${playerGold}                              ║`);
        console.log("╠══════════════════════════════════════════════════════════════╣");
        
        const shopItems = [
            { name: "Health Potion", effect: "Hồi phục 50 HP", cost: 100 },
            { name: "Mana Potion", effect: "Hồi phục 40 MP", cost: 80 },
            { name: "Iron Sword", effect: "Tăng 20 ATK", cost: 200 },
            { name: "Steel Sword", effect: "Tăng 30 ATK", cost: 300 },
            { name: "Strength Elixir", effect: "Tăng 5 STR trong 5 phút", cost: 150 }
        ];
        
        shopItems.forEach((item, index) => {
            const canAfford = playerGold >= item.cost;
            const status = canAfford ? "✅" : "❌";
            console.log(`║  ${(index + 1).toString().padStart(2)}. ${status} ${item.name} - ${item.effect}  ║`);
            console.log(`║     Giá: ${item.cost} gold${canAfford ? '' : ' (Không đủ gold)'}  ║`);
        });
        
        console.log("╚══════════════════════════════════════════════════════════════╝");
    }

    public showSkills(player: Player): void {
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                        📚 SKILLS 📚                          ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log(`║  🎯 Skill Points: ${player.getSkillPoints()}                              ║`);
        console.log("╠══════════════════════════════════════════════════════════════╣");
        
        const skills = player.getSkills();
        if (skills.length === 0) {
            console.log("║  Chưa có skill nào!                                       ║");
        } else {
            skills.forEach((skill, index) => {
                console.log(`║  ${(index + 1).toString().padStart(2)}. ✅ ${skill}  ║`);
            });
        }
        
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log("║  Skills có thể học: Fireball, Ice Bolt, Lightning Strike     ║");
        console.log("║  Nhập tên skill để học (cần 1 skill point)                  ║");
        console.log("╚══════════════════════════════════════════════════════════════╝");
    }

    public showMessage(message: string): void {
        console.log(`💬 ${message}`);
        console.log("");
    }

    public showGameOver(): void {
        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                        💀 GAME OVER 💀                       ║");
        console.log("╠══════════════════════════════════════════════════════════════╣");
        console.log("║  Bạn đã bị đánh bại! Game kết thúc.                          ║");
        console.log("║  Cảm ơn bạn đã chơi game!                                    ║");
        console.log("╚══════════════════════════════════════════════════════════════╝");
    }

    public clearScreen(): void {
        console.clear();
    }

    public getPlayerInput(prompt: string): string {
        return readline.question(prompt);
    }
} 