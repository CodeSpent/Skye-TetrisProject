import React, { useCallback, useState, useEffect, useRef } from 'react';
// VERSION 2.0 MULTIPLAYER ??
import { createStage, checkCollision } from '../gameHelpers';

// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Sounds and Music
import Sound from 'react-sound';
import sound from "./sounds/BGMUSIC.mp3";
import moveleftsound from "./soundfx/MOVELEFT.mp3";
import moverightsound from "./soundfx/MOVERIGHT.mp3";
import rotate from "./soundfx/ROTATE.mp3";
import dropsound from "./soundfx/DROPSOUND.mp3";
import gameoversound from "./soundfx/GAMEOVER.mp3";

// Custom Hooks
import { useInterval} from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  console.log('re-render');

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

const [isPlaying, setIsPlaying] = useState(false)

  const startGame = () => {
    console.log("test")
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    if (!isPlaying) { 
      playMusic();
      setIsPlaying(true);
      setIsPlaying(false);
    };
  };

  const playMusic = () => {
    new Audio(sound).play()
    Audio.loop = true;
  };

  const moveLeftSound = () => {
    new Audio(moveleftsound).play();
  };

  const moveRightSound = () => {
    new Audio(moverightsound).play();
  };

  const rotateSound = () => {
    new Audio(rotate).play();
  };

  const dropSound = () => {
    new Audio(dropsound).play();
  };

  const gameOverSound = () => {
    new Audio(gameoversound).play();
  };


  const drop = () => {
    // Increase level when players have cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Increase Speed
      setDropTime (1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false })
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log("GAME OVER!!!");
        setGameOver(true);
        setDropTime(null);
        gameOverSound();
        setIsPlaying(false);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        console.log("interval on")
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    console.log("interval off")
    setDropTime(null);
    drop();
  };

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
        moveLeftSound();
      } else if (keyCode === 39) {
        movePlayer(1)
        moveRightSound();
      } else if (keyCode === 40) {
        dropPlayer();
        dropSound();
      } else if (keyCode === 38) {
        playerRotate(stage, 1)
        rotateSound();
      }
    }
  };

useInterval(()=> {
   drop();
}, dropTime)

  return (
    <StyledTetrisWrapper 
    role="button" 
    tabIndex="0" 
    onKeyDown={e => move(e)}
    onKeyUp={keyUp}
  >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Row: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
