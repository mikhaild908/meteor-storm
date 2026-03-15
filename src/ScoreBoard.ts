export class ScoreBoard {
    score: number;

    constructor(score: number) {
        this.score = score;
    }

    updateScore(canvas: HTMLCanvasElement, currentScore: number) {
        if(canvas) {
            const canvasContext = canvas.getContext('2d');
            
            if(canvasContext) {
                canvasContext.clearRect(450, 0, 500, 25);
                canvasContext.font = "24px Arial";
                canvasContext.fillStyle = "yellow";
                canvasContext.fillText(`Score: ${currentScore}`, 450, 25);
                console.log(`Score: ${currentScore}`);
            }
        }
    }
}