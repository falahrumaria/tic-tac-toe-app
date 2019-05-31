import { Component, OnInit, Input } from "@angular/core";
import { GameState, BoardContent } from "./constant-enum";

@Component({
  selector: "app-ttt-board",
  templateUrl: "./ttt-board.component.html",
  styleUrls: ["./ttt-board.component.css"]
})
export class TttBoardComponent implements OnInit {
  @Input() dimension: number;
  board: number[][];

  RED = BoardContent.RED;
  BLUE = BoardContent.BLUE;

  currentState: number; // the current state of the game
  // (PLAYING, DRAW, RED_WON, BLUE_WON)
  currentPlayer: number; // the current player (RED or BLUE)
  currentRow: number; // current seed's row
  currentCol: number; // current seed's column

  currentStateMessage: string;
  errorMessage: string;
  gameFinished: boolean;

  constructor() {}

  selectCell(row: number, col: number) {
    if (this.gameFinished) {
      return;
    }
    this.playerMove(this.currentPlayer, row, col);
    if (this.errorMessage) {
      return;
    }
    this.updateGame(this.currentPlayer, this.currentRow, this.currentCol);
    if (this.currentState === GameState.RED_WON) {
      this.currentStateMessage = "RED won!";
    } else if (this.currentState === GameState.BLUE_WON) {
      this.currentStateMessage = "BLUE won!";
    } else if (this.currentState === GameState.DRAW) {
      this.currentStateMessage = "Draw!";
    }
  }

  /** Initialize the game-board contents and the current states */
  initBoardAndState() {
    this.board = [];
    for (let row = 0; row < this.dimension; row++) {
      this.board.push([]);
      for (let col = 0; col < this.dimension; col++) {
        this.board[row].push(BoardContent.EMPTY); // all cells empty
      }
    }
    this.currentState = GameState.PLAYING; // ready to play
    this.currentPlayer = BoardContent.RED; // RED plays first
  }

  /**
   * Player with the "theSeed" makes one move, with input validation. Update
   * global variables "currentRow" and "currentCol".
   */
  playerMove(theSeed: BoardContent, row: number, col: number) {
    this.currentRow = row;
    this.currentCol = col;
    if (this.board[row][col] === BoardContent.EMPTY) {
      this.errorMessage = undefined;
      this.board[row][col] = theSeed; // update game-board content
    } else {
      this.errorMessage = "Move is not valid!";
    }
  }

  /**
   * Update the "currentState" after the player with "theSeed" has placed on
   * (currentRow, currentCol).
   */
  updateGame(theSeed: BoardContent, currentRow: number, currentCol: number) {
    if (this.hasWon(theSeed, currentRow, currentCol)) {
      this.currentState =
        theSeed === BoardContent.RED ? GameState.RED_WON : GameState.BLUE_WON;
      this.gameFinished = true;
    } else if (this.isDraw()) {
      this.currentState = GameState.DRAW;
      this.gameFinished = true;
    } else {
      this.currentPlayer =
        this.currentPlayer === BoardContent.RED
          ? BoardContent.BLUE
          : BoardContent.RED;
      if (this.currentPlayer === BoardContent.RED) {
        this.currentStateMessage = "It's player RED's turn!";
      } else {
        this.currentStateMessage = "It's player BLUE's turn!";
      }
    }
  }

  /** Return true if it is a draw (no more empty cell) */
  // TODO: Shall declare draw if no player can "possibly" win
  isDraw(): boolean {
    for (let row = 0; row < this.dimension; ++row) {
      for (let col = 0; col < this.dimension; ++col) {
        if (this.board[row][col] === BoardContent.EMPTY) {
          return false; // an empty cell found, not draw, exit
        }
      }
    }
    return true; // no empty cell, it's a draw
  }

  /**
   * Return true if the player with "theSeed" has won after placing at
   * (currentRow, currentCol)
   */
  hasWon(theSeed: number, currentRow: number, currentCol: number) {
    return (
      this.isHorizontallyComplete(theSeed, currentRow) ||
      this.isVerticallyComplete(theSeed, currentCol) ||
      (currentRow === currentCol && this.isDiagonallyComplete(theSeed)) ||
      (currentRow + currentCol === this.dimension - 1 &&
        this.isDiagonallyOppositeComplete(theSeed))
    );
  }

  isHorizontallyComplete(theSeed: number, currentRow: number): boolean {
    for (let i = 0; i < this.dimension; i++) {
      if (this.board[currentRow][i] !== theSeed) {
        return false;
      }
    }
    return true;
  }

  isVerticallyComplete(theSeed: number, currentCol: number): boolean {
    for (let i = 0; i < this.dimension; i++) {
      if (this.board[i][currentCol] !== theSeed) {
        return false;
      }
    }
    return true;
  }

  isDiagonallyComplete(theSeed: number): boolean {
    for (let i = 0; i < this.dimension; i++) {
      if (this.board[i][i] !== theSeed) {
        return false;
      }
    }
    return true;
  }

  isDiagonallyOppositeComplete(theSeed: number): boolean {
    for (let i = 0; i < this.dimension; i++) {
      if (this.board[i][this.dimension - i - 1] !== theSeed) {
        return false;
      }
    }
    return true;
  }

  ngOnInit() {
    this.gameFinished = false;
    this.initBoardAndState();
    this.errorMessage = undefined;
    this.currentStateMessage = "Player Red moves first!";
  }
}
