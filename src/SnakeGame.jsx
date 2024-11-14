import React, { useState, useEffect } from 'react';
import './App.css';

const SnakeGame = () => {
  const initialSnake = [[5, 5]];
  const initialDirection = [0, 1]; // initial direction: right
  const initialFood = [10, 10];

  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);
  const [food, setFood] = useState(initialFood);
  const [gameOver, setGameOver] = useState(false);

  // Handle keyboard input and prevent arrow keys from scrolling the page
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          setDirection([0, -1]);
          break;
        case 'ArrowDown':
          setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          setDirection([1, 0]);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Move snake and check for game-over conditions
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = [
          prevSnake[0][0] + direction[0],
          prevSnake[0][1] + direction[1],
        ];
        const newSnake = [newHead, ...prevSnake];

        // Check for wall collision
        if (newHead[0] < 0 || newHead[1] < 0 || newHead[0] >= 20 || newHead[1] >= 20) {
          setGameOver(true);
          clearInterval(timer);
          return prevSnake;
        }

        // Check for self-collision
        if (newSnake.slice(1).some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setGameOver(true);
          clearInterval(timer);
          return prevSnake;
        }

        // Check if food eaten
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [direction, food, gameOver]);

  // Reset game to initial state
  const resetGame = () => {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setFood(initialFood);
    setGameOver(false);
  };

  // Render game board
  return (
    <div className="game-board">
      {snake.map((segment, idx) => (
        <div key={idx} className="snake-segment" style={{
          gridRowStart: segment[1] + 1,
          gridColumnStart: segment[0] + 1,
        }}></div>
      ))}
      <div className="food" style={{
        gridRowStart: food[1] + 1,
        gridColumnStart: food[0] + 1,
      }}></div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
