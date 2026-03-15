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

    function checkCollision(rocket: Rocket, meteor: Meteor): boolean {
        return rocket.x + rocket.width >= meteor.x  + 25 && // TODO: 25???
               rocket.y + rocket.height > meteor.y &&
               rocket.y < meteor.y + meteor.width;
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
                    if (checkCollision(rocket, m)) {
                        clearInterval(timerRef.current);
                        alert("Game Over"); // TODO: create a component for this
                    }

                    // Reposition meteor if off screen
                    if (m.x <= -m.width) {
                        m.x = canvasRef.current.width;
                        m.y = Math.random() * (canvasRef.current.height - m.height);
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