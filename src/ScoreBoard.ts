export class ScoreBoard {
    score: number;

    constructor(score: number) {
        this.score = score;
    }

    updateScore(ctx: CanvasRenderingContext2D, currentScore: number) {
        ctx.clearRect(450, 0, 500, 25);
        ctx.font = "24px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(`Score: ${currentScore}`, 450, 25);
    }
}