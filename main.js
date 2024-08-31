const Gameboard = (function(){
    let board = ["","","","","","","","",""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["","","","","","","","",""];
    };

    const makeMove = (index, marker) => {
        if(board[index] === ""){
            board[index] = marker;
            return true;
        }
        return false;
    };

    return{
        getBoard,
        resetBoard,
        makeMove
    };
})();

const Player = (name, marker) => {
    return {name, marker};
}

const gameController = (function(){
    let player1, player2, currentPlayer;
    let gameActive = true;

    const startGame = (name1, name2) =>{
        player1 = Player(name1, "X");
        player2 = name2 ? Player(name2, "O") : Player("Computer", "O");
        currentPlayer = player1;
        Gameboard.resetBoard();
        gameActive = true;
        updateUI();
    }

    const playTurn = (index) => {
        if(!gameActive) return;
        if(Gameboard.makeMove(index, currentPlayer.marker)){
            if(checkWinner()){
                gameActive = false;
                alert(`${currentPlayer.name} wins!`);
            }else if (Gameboard.getBoard().every(cell => cell !== "")){
                gameActive = false;
                alert("It's a Tie!");
            }else{
                switchPlayer();
                if (currentPlayer.name === "Computer") {
                    computerPlay();
                }
            }
            updateUI();
        }
    }

    const computerPlay = () => {
        let availableMoves = Gameboard.getBoard().map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
        let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        playTurn(move);
    }

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winConditions.some(combination => {
            const [a, b, c] = combination;
            return board[a] === currentPlayer.marker &&
                   board[a] === board[b] &&
                   board[a] === board[c];
        });
    }

    return {
        startGame,
        playTurn
    }
})();

const cells = document.querySelectorAll(".cell");
const startButton = document.querySelector("#btn-start");
const resetButton = document.querySelector("#btn-reset");

startButton.addEventListener("click", () => {
    const playerName1 = document.querySelector("#player1-input").value || "Player 1";
    const playerName2 = document.querySelector("#player2-input").value;
    gameController.startGame(playerName1, playerName2);
});

resetButton.addEventListener("click", () => {
    const playerName1 = document.querySelector("#player1-input").value || "Player 1";
    const playerName2 = document.querySelector("#player2-input").value;
    gameController.startGame(playerName1, playerName2);
});

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        gameController.playTurn(index);
    });
});

function updateUI() {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}
