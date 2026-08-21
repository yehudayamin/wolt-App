/* post-order mini-game */

import { Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';

const COLORS = ['#009de0', '#ff6b6b', '#ffd93d', '#6bcb77', '#c77dff', '#ff9a3c', '#ff4dda'];
const EMOJIS = ['🎉', '🎊', '✨', '⭐', '🥳', '🍕', '🍔'];

// one floating confetti emoji that drifts up and fades, then removes itself
function Particle({ startX, emoji, onDone }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }).start(() => onDone());
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -200] });
  const opacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.Text style={{ position: 'absolute', left: startX, bottom: 100, fontSize: 26, transform: [{ translateY }], opacity }}>
      {emoji}
    </Animated.Text>
  );
}

export default function ClickGame({ onClose }) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const nextId = useRef(0);

  // countdown
  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, gameOver]);

  function handleTap() {
    if (gameOver) return;
    if (!started) setStarted(true);
    setClicks((c) => c + 1);
    setColorIndex((i) => (i + 1) % COLORS.length);

    // spawn a few confetti particles at random x positions
    const newOnes = [];
    for (let k = 0; k < 3; k++) {
      const id = nextId.current++;
      newOnes.push({
        id,
        startX: 40 + Math.random() * 180,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      });
    }
    setParticles((prev) => [...prev, ...newOnes]);
  }

  function removeParticle(id) {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }

  function reset() {
    setClicks(0);
    setTimeLeft(10);
    setStarted(false);
    setGameOver(false);
    setColorIndex(0);
    setParticles([]);
  }

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center', gap: 16, overflow: 'hidden' }}>
          {/* confetti layer */}
          {particles.map((p) => (
            <Particle key={p.id} startX={p.startX} emoji={p.emoji} onDone={() => removeParticle(p.id)} />
          ))}

          <Text style={{ fontSize: 20, fontWeight: '700' }}>🎉 Order placed!</Text>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            {gameOver
              ? `Time's up! You tapped ${clicks} times`
              : started
              ? `Time left: ${timeLeft}s`
              : 'Tap the circle as fast as you can!'}
          </Text>

          {!gameOver ? (
            <TouchableOpacity
              onPress={handleTap}
              activeOpacity={0.7}
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: COLORS[colorIndex],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 36, fontWeight: '700' }}>{started ? clicks : '👆'}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ fontSize: 56 }}>🏆</Text>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {gameOver && (
              <TouchableOpacity onPress={reset} style={{ backgroundColor: '#009de0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Play Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#e0e0e0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 }}>
              <Text style={{ fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
