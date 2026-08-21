function ClickGame({ onClose }) {
    const COLORS = ['#009de0', '#ff6b6b', '#ffd93d', '#6bcb77', '#c77dff', '#ff9a3c', '#ff4dda'];

    const [clicks, setClicks]       = React.useState(0);
    const [timeLeft, setTimeLeft]   = React.useState(10);
    const [gameOver, setGameOver]   = React.useState(false);
    const [started, setStarted]     = React.useState(false);
    const [color, setColor]         = React.useState('#009de0');
    const [particles, setParticles] = React.useState([]);

    React.useEffect(() => {
        if (!started || gameOver) return;
        if (timeLeft <= 0) {
            setGameOver(true);
            return;
        }
        const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, started, gameOver]);

    function handleCircleClick(e) {
        if (gameOver) return;
        if (!started) setStarted(true);
        setClicks(c => c + 1);
        setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now() + Math.random();
        setParticles(prev => [...prev, { id, x, y }]);
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 700);
    }

    function handlePlayAgain() {
        setClicks(0);
        setTimeLeft(10);
        setGameOver(false);
        setStarted(false);
        setColor('#009de0');
        setParticles([]);
    }

    return (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
            <div className="click-game-container">

                <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {gameOver ? "Time's up!" : '⚡ Click Frenzy!'}
                </h2>

                <div className="click-game-stats">
                    <span>Clicks: <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>{clicks}</strong></span>
                    <span style={{ color: timeLeft <= 3 ? '#ff6b6b' : 'var(--text-secondary)' }}>
                        Time: <strong style={{ color: timeLeft <= 3 ? '#ff6b6b' : 'var(--accent-color)' }}>{timeLeft}s</strong>
                    </span>
                </div>

                <div className="click-game-bar-bg">
                    <div className="click-game-bar-fill" style={{
                        width: (timeLeft / 10 * 100) + '%',
                        background: timeLeft <= 3 ? '#ff6b6b' : 'var(--accent-color)'
                    }} />
                </div>

                {!gameOver ? (
                    <div className="click-circle" style={{ background: color }} onClick={handleCircleClick}>
                        <span style={{ fontSize: '2.5rem', pointerEvents: 'none' }}>
                            {started ? '🎯' : '👆'}
                        </span>
                        {particles.map(p => (
                            <span key={p.id} className="click-particle" style={{ left: p.x, top: p.y }}>
                                🎉
                            </span>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '8px' }}>😅</p>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                            You clicked <strong>{clicks}</strong> times!
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    {gameOver && (
                        <button className="btn-primary" onClick={handlePlayAgain} style={{ flex: 1 }}>
                            Play Again 🔄
                        </button>
                    )}
                    <button className="click-game-close-btn" onClick={onClose} style={{ flex: 1 }}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

window.ClickGame = ClickGame;