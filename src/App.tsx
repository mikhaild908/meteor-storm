import './App.css';
import { GameCanvas } from './GameCanvas';

function App() {
  const STARS = "stars.png";
  const ROCKET = "rocket.png";
  const METEOR = "meteor.png";
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;
  const ROCKET_WIDTH = 80;
  const ROCKET_HEIGHT = 80;
  const ROCKET_VELOCITY = 10;
  const METEOR_WIDTH = 80;
  const METEOR_HEIGHT = 80;
  const METEOR_VELOCITY = 10;

  return (
    <>
      <GameCanvas
        backgroundImage={STARS}
        rocketImage={ROCKET}
        canvasHeight={CANVAS_HEIGHT}
        canvasWidth={CANVAS_WIDTH}
        rocketWidth = {ROCKET_WIDTH}
        rocketHeight = {ROCKET_HEIGHT}
        rocketVelocity = {ROCKET_VELOCITY}
        meteorImage={METEOR}
        meteorWidth = {METEOR_WIDTH}
        meteorHeight = {METEOR_HEIGHT}
        meteorVelocity = {METEOR_VELOCITY}  />
    </>
  );
}

export default App
