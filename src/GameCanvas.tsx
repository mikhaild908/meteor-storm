import './GameCanvas.css';
import { Meteor } from './Meteor';
import { Rocket } from './Rocket';
//import {ScoreBoard} from './ScoreBoard';
import { useEffect, useRef } from 'react';

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
    const timerRef = useRef(0);
    const meteors: Meteor[] = new Array<Meteor>(numberOfMeteors);
    const rocket = new Rocket(rocketImage, rocketWidth, rocketHeight, rocketVelocity);

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
    
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height  = canvasHeight;
            canvasRef.current.focus();

            rocket.move(canvasRef.current, 'Initialize');

            for(let i = 0; i < meteors.length; i++) {
                meteors[i] = new Meteor(meteorImage, meteorWidth, meteorHeight, meteorVelocity, 0, 0);
            }

            meteors.forEach((m, idx) => {
                if (canvasRef.current) {
                    const { x, y } = randomMeteorPosition(meteors.slice(0, idx));
                    m.move(canvasRef.current, y, x);
                }
            });
        }

        timerRef.current = setInterval(() => {
            meteors.forEach(m => {
                if (canvasRef.current) {
                    m.move(canvasRef.current, m.y, m.x);
                    
                    if (checkCollision(rocket, m)) {
                        clearInterval(timerRef.current);
                        alert("Game Over"); // TODO: create a component for this
                    }

                    // Reposition meteor if off screen
                    if (m.x <= -m.width) {
                        const others = meteors.filter(o => o !== m);
                        const { y } = randomMeteorPosition(others, canvasRef.current.width);
                        m.x = canvasRef.current.width;
                        m.y = y;
                    }

                    // TODO: add score if no hits
                }
            });
        }, timerTick);

        // cleanup to prevent memory leaks
        return () => {
            // this will run when the component unmounts
            // console.log('Cleaning up timer');
            clearInterval(timerRef?.current);
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if(canvasRef.current) {
                rocket.move(canvasRef.current, e.key);
            }
        }
    };

    return (
        <div id='canvas-container' style={{backgroundImage: `url(${backgroundImage})`}}>
            {/* <ScoreBoard score={0} /> */}
            <canvas id="game-canvas" ref={canvasRef} tabIndex={0} onKeyDown={handleKeyDown}/>
        </div>
    );
}