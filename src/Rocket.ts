import type { ActionType } from "./ActionType";

export class Rocket {
    image: HTMLImageElement;
    loaded: Promise<void>;
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
        this.image = new Image();
        this.loaded = new Promise((resolve, reject) => {
            this.image.onload = () => resolve();
            this.image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        });
        this.image.src = url;
    }

    move(ctx: CanvasRenderingContext2D, action: ActionType) {
        const previousY = this.y;

        if (action === 'ArrowUp') {
            this.y -= this.velocity;

            if (this.y <= 0 - this.height) {
                this.y = ctx.canvas.height - this.height;
            }
        } else if (action === 'ArrowDown') {
            this.y += this.velocity;

            if (this.y >= ctx.canvas.height) {
                this.y = 0;
            }
        } else if (action === 'Initialize') {
            this.y = 0;
        }

        ctx.clearRect(0, previousY, this.width, this.height);
        ctx.drawImage(this.image, 0, this.y, this.width, this.height);
    }
}