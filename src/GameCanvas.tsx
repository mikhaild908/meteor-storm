import './GameCanvas.css';
import './GameOverLightBox.css';
import { Meteor } from './Meteor';
import { Rocket } from './Rocket';
import { GameOverLightbox } from './GameOverLightbox';
import { ScoreBoard } from './ScoreBoard';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
    timerTick: number;
    backgroundImage: string;
    canvasWidth: number;
    canvasHeight: number;
    rocketImage: string;
    rocketWidth: number;
    rocketHeight: number;
    rocketVelocity: number;
    meteorImage: string;
    meteorWidth: number;
    meteorHeight: number;
    meteorVelocity: number;
    numberOfMeteors: number;
}

export function GameCanvas({
    timerTick,
    backgroundImage,
    canvasWidth,
    canvasHeight,
    rocketImage,
    rocketWidth,
    rocketHeight,
    rocketVelocity,
    meteorImage,
    meteorWidth,
    meteorHeight,
    meteorVelocity,
    numberOfMeteors,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const timerRef = useRef<number | null>(null);
    const gameOverRef = useRef(false);
    const [gameOver, setGameOver] = useState(false);

    const rocketRef = useRef<Rocket | null>(null);
    const meteorsRef = useRef<Meteor[]>([]);
    const scoreBoardRef = useRef<ScoreBoard>(null);
    const scoreRef = useRef<number>(0);

    const setGameOverState = useCallback((value: boolean) => {
        gameOverRef.current = value;
        setGameOver(value);
    }, []);

    function rectsOverlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function checkCollision(rocket: Rocket, meteor: Meteor): boolean {
        return rectsOverlap(rocket, meteor);
    }

    function randomMeteorPosition(existing: Meteor[], fixedX?: number) {
        const maxY = Math.max(0, canvasHeight - meteorHeight);

        const candidate = () => ({
            x: fixedX !== undefined ? fixedX : Math.random() * Math.max(0, canvasWidth - meteorWidth),
            y: Math.random() * maxY,
        });

        const MAX_TRIES = 20;
        let pos = candidate();
        for (let i = 0; i < MAX_TRIES; i++) {
            const rect = { ...pos, width: meteorWidth, height: meteorHeight };
            const overlaps = existing.some(m => rectsOverlap(rect, m));
            if (!overlaps) {
                return pos;
            }
            pos = candidate();
        }

        return pos;
    }
    
    const initGame = useCallback(() => {
        if (!canvasRef.current) return;

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
        canvasRef.current.focus();

        ctxRef.current = canvasRef.current.getContext('2d');
        if (!ctxRef.current) return;
        const ctx = ctxRef.current;

        scoreBoardRef.current = new ScoreBoard(0);

        const rocket = new Rocket(rocketImage, rocketWidth, rocketHeight, rocketVelocity);
        rocketRef.current = rocket;
        rocket.move(ctx, 'Initialize');

        const meteors: Meteor[] = new Array<Meteor>(numberOfMeteors);
        for (let i = 0; i < meteors.length; i++) {
            meteors[i] = new Meteor(meteorImage, meteorWidth, meteorHeight, meteorVelocity, 0, 0);
        }

        meteors.forEach((m, idx) => {
            const { x, y } = randomMeteorPosition(meteors.slice(0, idx));
            m.move(ctx, y, x);
        });

        meteorsRef.current = meteors;

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = window.setInterval(() => {
            if (gameOverRef.current) return;

            const rocket = rocketRef.current;
            const ctx = ctxRef.current;
            if (!rocket || !ctx) return;

            meteorsRef.current.forEach(m => {
                m.move(ctx, m.y, m.x);

                if (checkCollision(rocket, m)) {
                    setGameOverState(true);

                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }

                    scoreRef.current = 0;

                    return;
                }

                // Reposition meteor if off screen
                if (m.x <= -m.width) {
                    const others = meteorsRef.current.filter(o => o !== m);
                    const { y } = randomMeteorPosition(others, ctx.canvas.width);
                    m.x = ctx.canvas.width;
                    m.y = y;
                }

                // increase score
                scoreBoardRef.current?.updateScore(ctx, scoreRef.current++);
            });
        }, timerTick);

    }, [canvasHeight, canvasWidth, meteorHeight, meteorImage, meteorVelocity, meteorWidth, numberOfMeteors, rocketHeight, rocketImage, rocketVelocity, rocketWidth, setGameOverState, timerTick]);

    useEffect(() => {
        initGame();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [initGame]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (ctxRef.current) {
                rocketRef.current?.move(ctxRef.current, e.key);
            }
        }
    };

    const handleRestart = () => {
        setGameOverState(false);
        initGame();
    };

    return (
        <div id='canvas-container' style={{backgroundImage: `url(${backgroundImage})`}}>
            <canvas id="game-canvas" ref={canvasRef} tabIndex={0} onKeyDown={handleKeyDown}/>
            {gameOver && <GameOverLightbox onRestart={handleRestart} />}
        </div>
    );
}