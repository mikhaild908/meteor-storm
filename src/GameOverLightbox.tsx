type Props = {
  onRestart: () => void;
  finalScore: number;
};

export function GameOverLightbox({ onRestart, finalScore }: Props) {
  return (
    <div className="lightbox-overlay" role="dialog" aria-modal="true">
      <div className="lightbox-content">
        <h2>Game Over</h2>
        <p>Final score: {finalScore}</p>
        <p>Try again and dodge the meteors!</p>
        <button type="button" onClick={onRestart} autoFocus>
          Restart
        </button>
      </div>
    </div>
  );
}
