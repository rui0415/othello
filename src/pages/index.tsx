import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turn, setTurn] = useState({ color: 1, count: 1 });
  const [colorCount, setColorCount] = useState({ black: 2, white: 2 });

  const [pass, setPass] = useState({ pass: false, endGame: false });
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

  const [prevTurn, setPrevTurn] = useState({
    prevBoard: board,
    prevColor: 1,
    prevCount: 1,
    prevBlackCount: 2,
    prevWhiteCount: 2,
  });

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
    setBoard(prevTurn.prevBoard);
    setTurn({ color: prevTurn.prevColor, count: prevTurn.prevCount });
    setColorCount({ black: prevTurn.prevBlackCount, white: prevTurn.prevWhiteCount });
  };

  const boardRange = (x: number, y: number) => {
    return 0 <= x && x < 8 && 0 <= y && y < 8;
  };

  const clickHandler = (x: number, y: number) => {
    let flag = 0;

    if (x === -2 && y === -2) {
      //パスしたときの処理
      setTurn({ color: 2 / turn.color, count: turn.count });
      flag = 1;
    } else if (board[y][x] === 1 || board[y][x] === 2) return; // 黒か白の石が置かれていればreturn
    const newBoard = structuredClone(board);
    const prevBoard = structuredClone(board);
    setPrevTurn({
      prevBoard,
      prevColor: turn.color,
      prevCount: turn.count,
      prevBlackCount: colorCount.black,
      prevWhiteCount: colorCount.white,
    });
    blackCount = 0;
    whiteCount = 0;

    if (!flag) {
      for (const dir of directions) {
        let y_a = y + dir[0];
        let x_a = x + dir[1];
        if (boardRange(x_a, y_a) && newBoard[y_a][x_a] === 2 / turn.color) {
          //その方向に違う色が来たら

          for (; boardRange(x_a, y_a); y_a += dir[0], x_a += dir[1]) {
            if (boardRange(x_a, y_a) && newBoard[y_a][x_a] === turn.color) {
              // 違う色が来た列を見続けて、同じ色が来たら
              for (; y_a !== y || x_a !== x; y_a -= dir[0], x_a -= dir[1]) {
                newBoard[y_a][x_a] = turn.color; //裏返し
              }
              newBoard[y][x] = turn.color;

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
          if (newBoard[i][j] === 2 / turn.color) {
            // 盤面をすべて見て、相手の色が置かれたマスだったら
            for (const dir of directions) {
              let y_a = i + dir[0];
              let x_a = j + dir[1];
              if (boardRange(x_a, y_a) && newBoard[y_a][x_a] === turn.color) {
                // 全方向みて、それが自分の色だったら
                for (; boardRange(x_a, y_a); y_a += dir[0], x_a += dir[1]) {
                  if (newBoard[y_a][x_a] === 2 / turn.color) break;
                  if (boardRange(x_a, y_a) && newBoard[y_a][x_a] <= 0) {
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
      setTurn({ color: 2 / turn.color, count: turn.count + 1 });
    } else {
      return; //石が置けていないならリターンする
    }

    setBoard(newBoard);
    const board_flat = newBoard.flat();
    const board_candidate = board_flat.filter((color) => color === -1);
    const board_space = board_flat.filter((color) => color <= 0);
    if ((pass.pass && board_candidate.length === 0) || board_space.length === 0) {
      setPass({ pass: true, endGame: true });
    } else {
      setPass({ pass: board_candidate.length ? false : true, endGame: false });
    }
    setColorCount({ black: blackCount, white: whiteCount });
  };

  return (
    <div className={styles.container}>
      <div className={styles.prev} onClick={() => prevBoard()}>
        ひとつ前に戻る
      </div>
      <div className={styles.header}>
        <div className={styles.whiteCount}>{colorCount.white}</div>

        <div className={styles.turn}>
          <div>{turn.color === 1 ? '黒' : '白'}のターン</div>
          <div>{turn.count}ターン目</div>
        </div>

        <div className={styles.blackCount}>{colorCount.black}</div>
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
      {pass.pass && !pass.endGame && (
        <div className={styles.pass} onClick={() => clickHandler(-2, -2)}>
          パス
        </div>
      )}
      {pass.endGame && (
        <div className={styles.endgame}>
          {colorCount.black > colorCount.white ? 'Black' : 'White'} Win
        </div>
      )}
    </div>
  );
};

export default Home;
