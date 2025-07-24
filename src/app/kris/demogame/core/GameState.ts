export class GameState {
    private currentLevel: number = 1;
    private score: number = 0;
    private gameTime: number = 0;
    private isPaused: boolean = false;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.currentLevel = 1;
        this.score = 0;
        this.gameTime = 0;
        this.isPaused = false;
    }

    public update(): void {
        if (!this.isPaused) {
            this.gameTime++;
        }
    }

    public addScore(points: number): void {
        this.score += points;
    }

    public nextLevel(): void {
        this.currentLevel++;
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }

    // Getters
    public getCurrentLevel(): number {
        return this.currentLevel;
    }

    public getScore(): number {
        return this.score;
    }

    public getGameTime(): number {
        return this.gameTime;
    }

    public isGamePaused(): boolean {
        return this.isPaused;
    }
} 