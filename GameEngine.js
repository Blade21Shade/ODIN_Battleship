import Ship from "./Ship.js"
import Gameboard from "./Gameboard.js"
import Player from "./Player.js"

let gameBoardSize = 10;
let playerTurn = 1; // Swaps between 1 and 2

let player1Board = new Gameboard(gameBoardSize);
let player2Board = new Gameboard(gameBoardSize);

let player1 = new Player(player1Board);
let player2 = new Player(player2Board);

