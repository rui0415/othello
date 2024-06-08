import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [turnCount, setTurnCount] = useState(1);
  const [black, setBlack] = useState(2);
  const [white, setWhite] = useState(2);

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

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

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 0 && board[y][x] !== 3) return;
    const newBoard = structuredClone(board);

    for (const dir of directions) {
      let y_a = y + dir[0];
      let x_a = x + dir[1];
      if (board[y_a] !== undefined && board[y_a][x_a] === 2 / turnColor) {
        //その方向に違う色が来たら

        for (let i = 0; i < 8; i++) {
          y_a += dir[0];
          x_a += dir[1];

          if (board[y_a] !== undefined && board[y_a][x_a] === turnColor) {
            // 違う色が来た列を見続けて、同じ色が来たら
            for (; y_a !== y || x_a !== x; y_a -= dir[0], x_a -= dir[1]) {
              newBoard[y_a][x_a] = turnColor; //裏返し
            }
            newBoard[y][x] = turnColor;
            setTurnColor(2 / turnColor);
            setTurnCount(turnCount + 1);
          }
        }
      }
    }

    // for (let i = 0; i < 8; i++) {
    //   for (let j = 0; j < 8; j++) {
    //     if (newBoard[i][j] === 3) newBoard[i][j] = 0;
    //     if (newBoard[i][j] === 2 / turnColor) {
    //       for (const dir of directions) {
    //         let y_a = y + dir[0];
    //         let x_a = x + dir[1];
    //         if (board[y_a] !== undefined && board[y_a][x_a] === turnColor) {
    //           for (let k = 0; k < 8; k++) {
    //             y_a += dir[0];
    //             x_a += dir[1];

    //             if (board[y_a] !== undefined && board[y_a][x_a] === 0) {
    //               // 違う色が来た列を見続けて、空白が来たら

    //               newBoard[y_a][x_a] = 3;
    //               break;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    setBoard(newBoard);
    const flat_board = newBoard.flat();
    const black_arr = flat_board.filter((color) => color === 1);
    const white_arr = flat_board.filter((color) => color === 2);
    setBlack(black_arr.length);
    setWhite(white_arr.length);
  };

  return (
    <div className={styles.container}>
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
              style={{ background: color === 3 ? 'yellow' : 'green' }}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
            >
              {color !== 0 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
