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
                    // TODO: check for hits
                    // TODO; if hit - game over
                    // TODO: reposition meteor to right screen if meteor position is less than or equal to (0 - meteor width)
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