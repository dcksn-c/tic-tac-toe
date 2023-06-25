const gameBoardModule = (() => {
    let currentBoardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    return {currentBoardState, winCombos};
})();



const displayControllerModule = (() => {
    const message = document.querySelector(".message");
    const box = document.querySelectorAll(".box");
    const replay =  document.querySelector(".replay-btn");
    const refresh =  document.querySelector(".refresh-btn");
    const modal = document.querySelector(".modal");
    const humanBtn = document.querySelector(".human-player");
    const aiBtn = document.querySelector(".ai-player");
    const aiHardBtn = document.querySelector(".ai-player-hard");
    const submitBtn = document.querySelector(".submit");
    const board = document.querySelector(".board");
    const lowerBtnContainer = document.querySelector(".lower-btn-container");
    const modeSelect = document.querySelector(".mode-select");

    let humanMode = "";
    let aiMode = "";
    let aiModeHard = "";
    let circleTurn = "";
    
    const handleClick = (e) => {
        let cell = e.target;
        let move = circleTurn ? "O" : "X";
        if (move !== "O") {
            cell.classList.add("playerOneMark")
        }
        makeMove(cell, move);
        if (humanMode) {
            if (matchResult(move, gameBoardModule.currentBoardState)) {
                message.textContent = `${circleTurn ? playerTwo.name + " wins!" : playerOne.name + " wins!"}`;
                let box = document.querySelectorAll(".box");
                box.forEach((boxes) => {
                    boxes.removeEventListener("click", handleClick);
                })
                lowerBtnContainer.style.display = "flex";
            }
            else if (draw(move)) {
                message.textContent = "Draw!";
                lowerBtnContainer.style.display = "flex";
            }
            else {
                switchTurn();
            }
        }
        else {
            if (matchResult(move, gameBoardModule.currentBoardState)) {
                message.textContent = "You win!"
                let box = document.querySelectorAll(".box");
                box.forEach((boxes) => {
                    boxes.removeEventListener("click", handleClick);
                })
                lowerBtnContainer.style.display = "flex";
            }
            else if (draw(move)) {
                message.textContent = "Draw!";
                lowerBtnContainer.style.display = "flex";
            }
            else {
                switchTurn();
            }
        }
    }

    const makeMove = (cell, move) => {
        // const {id} = cell;
        let id = cell.id;
        gameBoardModule.currentBoardState[id] = move;
        cell.textContent = move;
    }

    const matchResult = (move, board) => {
        return gameBoardModule.winCombos.some(combos => {
            return combos.every(index => {
                return board[index] === move;
            })
        })
    }

    const draw = (move) => {
        return [...box].every(boxes => {
            return boxes.textContent.includes("X") || boxes.textContent.includes("O");
        })
    }

    const switchTurn = () => {
        if (humanMode) {
            circleTurn = !circleTurn;
            message.textContent = `${circleTurn ? playerTwo.name + "'s turn." : playerOne.name + "'s turn."}`;
        }
        else if (aiModeHard) {
            hardAiMove();
            if (matchResult(aiPlayer.mark, gameBoardModule.currentBoardState)) {
                message.textContent = "Computer wins!";
                console.log(circleTurn)
                let box = document.querySelectorAll(".box");
                box.forEach((boxes) => {
                    boxes.removeEventListener("click", handleClick);
                })
                lowerBtnContainer.style.display = "flex";
            }
            else {
                message.textContent = `${circleTurn ? "Computer's turn." : "Your turn."}`;
            }
        }
        else if (aiMode) {
            easyAiMove();
            if (matchResult(aiPlayer.mark, gameBoardModule.currentBoardState)) {
                message.textContent = "Computer wins!";
                console.log(circleTurn)
                let box = document.querySelectorAll(".box");
                box.forEach((boxes) => {
                    boxes.removeEventListener("click", handleClick);
                })
                lowerBtnContainer.style.display = "flex";
            }
            else {
                message.textContent = `${circleTurn ? "Computer's turn." : "Your turn."}`;
            }
        }
    }
    
    const easyAiMove = () => {
        let availBox = [...box].filter((boxes) => boxes.textContent !== "X" && boxes.textContent !== "O"
        );
        let move = availBox[Math.floor(Math.random() * availBox.length)];
        move.textContent = aiPlayer.mark
        move.classList.remove("playerOneMark")
        move.removeEventListener("click", handleClick);
        gameBoardModule.currentBoardState[move.id] = aiPlayer.mark;
    }

    //minimax ai
    const hardAiMove = () => {
        const move = minimax("O", gameBoardModule.currentBoardState).index;
        const marked = [...box][move]
        gameBoardModule.currentBoardState[move] = aiPlayer.mark;
      
        [...box][move].textContent = aiPlayer.mark
        marked.classList.remove("playerOneMark")
        marked.removeEventListener("click", handleClick);
    };

    const minimax = (mark, board) => {
    //let availBox = [...box].filter((boxes) => boxes.textContent !== "X" && boxes.textContent !== "O");
        let availBox = board.filter(item => item !== 'X' && item !== 'O');
        if (matchResult(playerOne.mark, board)) {
            return {
                score: -100,
            };
        } 
        else if (matchResult(aiPlayer.mark, board)) {
            return {
                score: 100,
            };
        } 
        else if (availBox.length === 0) {
            return {
                score: 0,
            };
        }
        const potentialMoves = [];
        for (let i = 0; i < availBox.length; i++) {
            let move = {};
            //let currentEmptyBox = Number(availBox[i].id)
            move.index = availBox[i];
            //Shallow Copy
            let newBoardState = [...board];
            newBoardState[availBox[i]] = mark;
            if (mark === aiPlayer.mark) {
                move.score = minimax(playerOne.mark, newBoardState).score;
            } 
            else {
                move.score = minimax(aiPlayer.mark, newBoardState).score;
            }
            //[...box][currentEmptyBox] = move.index;
            potentialMoves.push(move);
        }
        let bestMove = 0;
        if (mark === aiPlayer.mark) {
            let bestScore = -10000;
            for (let i = 0; i < potentialMoves.length; i++) {
                if (potentialMoves[i].score > bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
                }
            }
        } 
        else {
            let bestScore = 10000;
            for (let i = 0; i < potentialMoves.length; i++) {
                if (potentialMoves[i].score < bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
                }
            }
        }
        return potentialMoves[bestMove];
    };

    const startGame = () => {
        box.forEach((boxes) => {
            gameBoardModule.currentBoardState = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            boxes.textContent = "";
            boxes.addEventListener("click", handleClick, {once:true});
            circleTurn = '';
        })  
    }

    humanBtn.addEventListener("click", function() {
        modal.style.display = "block";
        humanMode = true;
        aiMode = false;
        aiModeHard = false;
    })

    aiBtn.addEventListener("click", function() {
        modeSelect.style.display = "none";
        modal.style.display = "none";
        board.style.display = "grid";
        humanMode = false;
        aiMode = true;
        aiModeHard = false;
    })

    aiHardBtn.addEventListener("click", function() {
        modeSelect.style.display = "none";
        modal.style.display = "none";
        board.style.display = "grid";
        humanMode = false;
        aiMode = false;
        aiModeHard = true;
    })

    submitBtn.addEventListener("click", function(e) {
        e.preventDefault();
        let playerOneName = document.querySelector("#player-one").value;
        let playerTwoName = document.querySelector("#player-two").value;

        if (playerOneName === '') {
            alert("Please enter Player 1's name.");
            return
        }
        if (playerTwoName === '') {
            alert("Please enter Player 2's name.");
            return
        }

        modeSelect.style.display = "none";
        modal.style.display = "none";
        board.style.display = "grid";
        playerOne.name = playerOneName
        playerTwo.name = playerTwoName
        message.textContent = playerOne.name + " starts first!"
    })

    replay.addEventListener("click", startGame) ;

    refresh.addEventListener("click", function() {
      document.location.reload();
    });

    startGame();

    return {}
    }
)();

const playerFactory = (mark) => {
    return { mark };
}

const playerOne = playerFactory("X");
const playerTwo = playerFactory("O");
const aiPlayer = playerFactory("O");
