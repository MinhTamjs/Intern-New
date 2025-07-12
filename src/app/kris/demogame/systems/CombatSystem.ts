import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export interface CombatResult {
    playerDamage: number;
    enemyDamage: number;
    enemyDefeated: boolean;
    playerDefeated: boolean;
    rewards?: { gold: number; exp: number };
    criticalHit?: boolean;
    dodge?: boolean;
    combatLog: string[];
}

export class CombatSystem {
    public fight(player: Player, enemy: Enemy): CombatResult {
        const combatLog: string[] = [];
        let playerDamage = 0;
        let enemyDamage = 0;
        let enemyDefeated = false;
        let playerDefeated = false;
        let criticalHit = false;
        let dodge = false;

        // Player attacks first
        const playerAttackResult = this.processAttack(player, enemy, "Player", enemy.getName());
        enemyDamage = playerAttackResult.damage;
        criticalHit = playerAttackResult.criticalHit;
        dodge = playerAttackResult.dodge;
        combatLog.push(...playerAttackResult.log);
        
        if (!enemy.isAlive()) {
            enemyDefeated = true;
            const rewards = enemy.getRewards();
            player.gainGold(rewards.gold);
            player.gainExperience(rewards.exp);
            combatLog.push(`🎉 ${enemy.getName()} đã bị đánh bại!`);
            combatLog.push(`💰 Nhận được ${rewards.gold} gold và ${rewards.exp} exp!`);
            return {
                playerDamage,
                enemyDamage,
                enemyDefeated,
                playerDefeated,
                rewards,
                criticalHit,
                dodge,
                combatLog
            };
        }

        // Enemy counter-attacks
        const enemyAttackResult = this.processAttack(enemy, player, enemy.getName(), "Player");
        playerDamage = enemyAttackResult.damage;
        combatLog.push(...enemyAttackResult.log);
        
        if (!player.isAlive()) {
            playerDefeated = true;
            combatLog.push("💀 Bạn đã bị đánh bại!");
        }

        return {
            playerDamage,
            enemyDamage,
            enemyDefeated,
            playerDefeated,
            criticalHit,
            dodge,
            combatLog
        };
    }

    private processAttack(attacker: Player | Enemy, defender: Player | Enemy, attackerName: string, defenderName: string): {
        damage: number;
        criticalHit: boolean;
        dodge: boolean;
        log: string[];
    } {
        const log: string[] = [];
        let damage = 0;
        let criticalHit = false;
        let dodge = false;

        // Check for dodge
        if (this.isDodge()) {
            dodge = true;
            log.push(`⚡ ${defenderName} né tránh được đòn tấn công!`);
            return { damage: 0, criticalHit, dodge, log };
        }

        // Calculate damage
        damage = this.calculateDamage(attacker, defender);
        
        // Check for critical hit
        if (this.isCriticalHit()) {
            criticalHit = true;
            damage = Math.floor(damage * 1.5);
            log.push(`💥 ${attackerName} gây ra đòn đánh chí mạng!`);
        }

        // Apply damage
        defender.takeDamage(damage);
        log.push(`⚔️ ${attackerName} gây ${damage} damage cho ${defenderName}!`);

        return { damage, criticalHit, dodge, log };
    }

    public calculateDamage(attacker: Player | Enemy, defender: Player | Enemy): number {
        const baseDamage = attacker.getAttack();
        const defense = defender.getDefense();
        const randomFactor = 0.8 + Math.random() * 0.4; // 80-120% damage variation
        return Math.max(1, Math.floor((baseDamage - defense * 0.5) * randomFactor));
    }

    public isCriticalHit(): boolean {
        return Math.random() < 0.15; // 15% chance of critical hit
    }

    public isDodge(): boolean {
        return Math.random() < 0.08; // 8% chance of dodge
    }

    public calculateExperienceReward(enemyLevel: number, playerLevel: number): number {
        const baseExp = enemyLevel * 10;
        const levelDifference = enemyLevel - playerLevel;
        const multiplier = 1 + (levelDifference * 0.2);
        return Math.max(1, Math.floor(baseExp * multiplier));
    }
} 