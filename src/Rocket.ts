import type { ActionType } from "./ActionType";

export class Rocket {
    image: HTMLImageElement;
    url: string;
    width: number;
    height: number;
    velocity: number;
    y: number;
    x: number;

    constructor(url: string, width: number, height: number, velocity: number) {
        this.url = url;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.x = 0;
        this.y = 0;
        this.image = new Image(width = width, height = height);
        this.image.src = url;
    }

    move(canvas: HTMLCanvasElement, action: ActionType) {
        if(canvas) {
            const canvasContext = canvas.getContext('2d');
            const previousY =  this.y; //currentY;
            
            if(action === 'ArrowUp') {
                this.y -= this.velocity; 

                if (this.y <= 0 - this.height) {
                    this.y = canvas.height - this.height;
                }
            }
            else if (action === 'ArrowDown') {
                this.y += this.velocity;

                if (this.y >= canvas.height) {
                    this.y = 0;
                }
            }
            else if (action === 'Initialize') {
                this.y = 0;
            }

            canvasContext?.clearRect(0, previousY, this.width, this.height);
            canvasContext?.drawImage(this.image, 0, this.y, this.width, this.height);
        }
    }
}