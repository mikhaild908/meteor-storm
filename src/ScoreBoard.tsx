import './ScoreBoard.css';

type Props = {
    score: number;
    //remainingTime: number;
}

export function ScoreBoard({score} : Props) {
    return (
        <div id='score-board'>
            Score: {score}
        </div>
    );
}