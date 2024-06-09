import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [turnCount, setTurnCount] = useState(1);
  const [black, setBlack] = useState(2);
  const [white, setWhite] = useState(2);
  const [pass, setPass] = useState(false);
  const [endGame, setEndGame] = useState(false);
  let blackCount;
  let whiteCount;

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, 0, 0, 0],
    [0, 0, 0, 1, 2, -1, 0, 0],
    [0, 0, -1, 2, 1, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [prev, setPrev] = useState(board);
  const [prevColor, setPrevColor] = useState(1);
  const [prevTurnCount, setPrevTurnCount] = useState(1);

  const directions = [
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const prevBoard = () => {
    setBoard(prev);
    setTurnColor(prevColor);
    setTurnCount(prevTurnCount);
  };

  const boardRange = (x: number, y: number) => {
    return 0 <= x && x < 8 && 0 <= y && y < 8;
  };

  const clickHandler = (x: number, y: number) => {
    let flag = 0;

    if (x === -2 && y === -2) {
      //パスしたときの例外処理
      setTurnColor(2 / turnColor);
      flag = 1;
    } else if (x === -3 && y === -3) {
      flag = 1;
    } else if (board[y][x] !== 0 && board[y][x] !== -1) return;
    const newBoard = structuredClone(board);
    const prevBoard = structuredClone(board);
    setPrev(prevBoard);
    setPrevColor(turnColor);
    setPrevTurnCount(turnCount);
    blackCount = 0;
    whiteCount = 0;

    if (!flag) {
      for (const dir of directions) {
        let y_a = y + dir[0];
        let x_a = x + dir[1];
        if (boardRange(x_a, y_a) && newBoard[y_a][x_a] === 2 / turnColor) {
          //その方向に違う色が来たら

          for (; boardRange(x_a, y_a); y_a += dir[0], x_a += dir[1]) {
            if (boardRange(x_a, y_a) && newBoard[y_a][x_a] === turnColor) {
              // 違う色が来た列を見続けて、同じ色が来たら
              for (; y_a !== y || x_a !== x; y_a -= dir[0], x_a -= dir[1]) {
                newBoard[y_a][x_a] = turnColor; //裏返し
              }
              newBoard[y][x] = turnColor;

              flag = 1;
              break;
            } else if (boardRange(x_a, y_a) && newBoard[y_a][x_a] <= 0) break;
          }
        }
      }
    }

    if (flag) {
      // 石が置けたのであれば
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (newBoard[i][j] === -1) newBoard[i][j] = 0; // 盤面の黄色をすべて消す。無駄なforな気がする。。。。
          if (newBoard[i][j] === 1) blackCount++;
          if (newBoard[i][j] === 2) whiteCount++;
        }
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (newBoard[i][j] === 2 / turnColor) {
            // 盤面をすべて見て、相手の色が置かれたマスだったら
            for (const dir of directions) {
              let y_a = i + dir[0];
              let x_a = j + dir[1];
              if (boardRange(x_a, y_a) && newBoard[y_a][x_a] === turnColor) {
                // 全方向みて、それが自分の色だったら
                for (; boardRange(x_a, y_a); y_a += dir[0], x_a += dir[1]) {
                  if (newBoard[y_a][x_a] === 2 / turnColor) break;
                  if (
                    boardRange(x_a, y_a) &&
                    (newBoard[y_a][x_a] === 0 || newBoard[y_a][x_a] === -1)
                  ) {
                    // 違う色が来た列を見続けて、空白が来たら
                    newBoard[y_a][x_a] = -1;
                    break;
                  }
                }
              }
            }
          }
        }
      }
      setTurnColor(2 / turnColor);
      setTurnCount(turnCount + 1);
    } else {
      return; //石が置けていないならリターンする
    }

    setBoard(newBoard);
    const board_flat = newBoard.flat();
    const board_candidate = board_flat.filter((color) => color === -1);
    const board_space = board_flat.filter((color) => color <= 0);
    if ((pass && board_candidate.length === 0) || board_space.length === 0) {
      setEndGame(true);
    }
    setPass(board_candidate.length ? false : true);
    setBlack(blackCount);
    setWhite(whiteCount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.prev} onClick={() => prevBoard()}>
        ひとつ前に戻る
      </div>
      <div className={styles.header}>
        <div className={styles.whiteCount}>{white}</div>

        <div className={styles.turn}>
          <div>{turnColor === 1 ? '黒' : '白'}のターン</div>
          <div>{turnCount}ターン目</div>
        </div>

        <div className={styles.blackCount}>{black}</div>
      </div>
      <div className={styles.boardstyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cellstyle}
              style={{ background: color < 0 ? 'yellow' : 'green' }}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
            >
              {color > 0 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
      {pass && !endGame && (
        <div className={styles.pass} onClick={() => clickHandler(-2, -2)}>
          Pass
        </div>
      )}
      {endGame && <div className={styles.endgame}>Game Set!!</div>}
    </div>
  );
};

export default Home;
