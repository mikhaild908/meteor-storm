export class Meteor {
    image: HTMLImageElement;
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
        this.image = new Image(width = width, height = height);
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