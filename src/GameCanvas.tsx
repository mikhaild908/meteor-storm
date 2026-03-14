import './GameCanvas.css';
import { Meteor } from './Meteor';
import { Rocket } from './Rocket';
//import {ScoreBoard} from './ScoreBoard';
import { useEffect, useRef } from 'react';

type Props = {
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
}

export function GameCanvas({backgroundImage, canvasWidth, canvasHeight, rocketImage, rocketWidth, rocketHeight, rocketVelocity, meteorImage, meteorWidth, meteorHeight, meteorVelocity }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef(0);
    const rocket = new Rocket(rocketImage, rocketWidth, rocketHeight, rocketVelocity);
    const meteors: Meteor[] = [
        new Meteor(meteorImage, meteorWidth, meteorHeight, meteorVelocity, 0, 0),
        new Meteor(meteorImage, meteorWidth, meteorHeight, meteorVelocity, 0, 0),
        new Meteor(meteorImage, meteorWidth, meteorHeight, meteorVelocity, 0, 0),
    ];

    function checkCollision(rocket: Rocket, meteor: Meteor): boolean {
        return rocket.x < meteor.x + meteor.width &&
               rocket.x + rocket.width > meteor.x &&
               rocket.y < meteor.y + meteor.height &&
               rocket.y + rocket.height > meteor.y;
    }
    
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height  = canvasHeight;
            canvasRef.current.focus();

            rocket.move(canvasRef.current, 'Initialize');

            meteors.forEach(m => {
                if (canvasRef.current) {
                    m.move(canvasRef.current, Math.random() * (canvasHeight), Math.random() * (canvasWidth));
                }
            });
        }

        timerRef.current = setInterval(() => {
            meteors.forEach(m => {
                if (canvasRef.current) {
                    m.move(canvasRef.current, m.y, m.x);
                    // Check for collision
                    if (checkCollision(rocket, m)) {
                        clearInterval(timerRef.current);
                        alert("Game Over");
                    }
                    // Reposition meteor if off screen
                    if (m.x <= -m.width) {
                        m.x = canvasRef.current.width;
                        m.y = Math.random() * (canvasRef.current.height - m.height);
                    }
                    // TODO: add score if no hits
                }
            });
        }, 500);

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