import './StartScreen.css';

type Props = {
    onStart: () => void;
};

export function StartScreen({ onStart }: Props) {
    return (
        <div className="start-screen-overlay">
            <div className="start-screen-content">
                <h2>Meteor Storm</h2>
                <p>Dodge the incoming meteors for as long as you can!</p>

                <div className="start-screen-controls">
                    <div className="control-row">
                        <kbd>↑</kbd>
                        <span>Move up</span>
                    </div>
                    <div className="control-row">
                        <kbd>↓</kbd>
                        <span>Move down</span>
                    </div>
                </div>

                <button type="button" onClick={onStart} autoFocus>
                    Start Game
                </button>
            </div>
        </div>
    );
}
