export class Meteor {
    image: HTMLImageElement;
    loaded: Promise<void>;
    url: string;
    width: number;
    height: number;
    velocity: number;
    y: number;
    x: number;

    constructor(url: string, width: number, height: number, velocity: number, y: number, x: number) {
        this.url = url;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.image = new Image();
        this.loaded = new Promise((resolve, reject) => {
            this.image.onload = () => resolve();
            this.image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        });
        this.image.src = url;
        this.y = y;
        this.x = x;
    }

    move(ctx: CanvasRenderingContext2D, currentY: number, currentX: number) {
        ctx.clearRect(currentX, currentY, this.width, this.height);

        this.x = currentX - this.velocity;
        this.y = currentY;

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}