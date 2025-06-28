document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const board = document.getElementById("board");
  const cells = document.querySelectorAll(".cell");
  const turnIndicator = document.getElementById("turnIndicator");
  const turnIcon = document.getElementById("turnIcon");
  const turnText = document.getElementById("turnText");
  const scoreX = document.getElementById("scoreX");
  const scoreO = document.getElementById("scoreO");
  const restartBtn = document.getElementById("restartBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const historyBtn = document.getElementById("historyBtn");
  const resultModal = document.getElementById("resultModal");
  const modalIcon = document.getElementById("modalIcon");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalBtn = document.getElementById("modalBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsClose = document.getElementById("settingsClose");
  const settingsCancel = document.getElementById("settingsCancel");
  const settingsSave = document.getElementById("settingsSave");
  const historyPanel = document.getElementById("historyPanel");
  const historyClose = document.getElementById("historyClose");
  const historyList = document.getElementById("historyList");

  // Game State
  let currentPlayer = "X";
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;
  let scores = { X: 0, O: 0 };
  let gameHistory = [];
  let gameSettings = {
    mode: "pvp",
    theme: "light",
    animations: true,
  };

  // Winning Combinations
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // Initialize Game
  function initGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    updateTurnIndicator();

    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winner");
      cell.style.pointerEvents = "auto";
    });

    // Apply animations if enabled
    if (gameSettings.animations) {
      animateBoardReset();
    }
  }

  // Animate board reset
  function animateBoardReset() {
    cells.forEach((cell, index) => {
      setTimeout(() => {
        cell.style.transform = "scale(0.8)";
        cell.style.opacity = "0.5";
        setTimeout(() => {
          cell.style.transform = "scale(1)";
          cell.style.opacity = "1";
        }, 200);
      }, index * 50);
    });
  }

  // Update Turn Indicator
  function updateTurnIndicator() {
    turnIcon.textContent = currentPlayer;
    turnIcon.className = `turn-icon ${currentPlayer.toLowerCase()}`;
    turnText.textContent = `Player ${currentPlayer}'s turn`;

    if (gameSettings.animations) {
      turnIndicator.style.transform = "scale(1.05)";
      setTimeout(() => {
        turnIndicator.style.transform = "scale(1)";
      }, 200);
    }
  }

  // Check for Winner
  function checkWinner() {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        gameBoard[a] &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
      ) {
        return {
          winner: gameBoard[a],
          combination: combination,
        };
      }
    }

    return gameBoard.includes("") ? null : { winner: "T" }; // T for Tie
  }

  // Highlight Winning Cells
  function highlightWinningCells(combination) {
    combination.forEach((index) => {
      cells[index].classList.add("winner");
    });
  }

  // Create Confetti Effect
  function createConfetti() {
    if (!gameSettings.animations) return;

    const colors = ["#4361ee", "#4cc9f0", "#f72585", "#7209b7", "#3a0ca3"];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }

  // Show Result Modal
  function showResultModal(result) {
    if (result.winner === "T") {
      modalIcon.textContent = "🤝";
      modalTitle.textContent = "Game Tied!";
      modalText.textContent = "The game ended in a draw.";

      // Add to history
      addToHistory("draw");
    } else {
      if (result.winner === "X") {
        modalIcon.textContent = "✖️";
        modalIcon.style.color = "var(--primary)";
        scores.X++;
        scoreX.textContent = scores.X;
      } else {
        modalIcon.textContent = "⭕";
        modalIcon.style.color = "var(--secondary)";
        scores.O++;
        scoreO.textContent = scores.O;
      }

      modalTitle.textContent = `Player ${result.winner} Wins!`;
      modalText.textContent = `Congratulations Player ${result.winner}!`;
      highlightWinningCells(result.combination);

      // Add to history
      addToHistory(result.winner);

      // Create celebration effects
      if (gameSettings.animations) {
        createConfetti();
      }
    }

    resultModal.classList.add("show");
  }

  // Add game result to history
  function addToHistory(result) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const historyItem = {
      result: result,
      timestamp: timeString,
      date: now.toLocaleDateString(),
    };

    gameHistory.unshift(historyItem);
    updateHistoryDisplay();
  }

  // Update history display
  function updateHistoryDisplay() {
    historyList.innerHTML = "";

    gameHistory.forEach((item, index) => {
      if (index >= 10) return; // Limit to 10 items

      const li = document.createElement("li");
      li.className = "history-item";

      const icon = document.createElement("div");
      icon.className = "history-icon";

      if (item.result === "X" || item.result === "O") {
        icon.classList.add(item.result === "X" ? "win" : "lose");
        icon.textContent = item.result;
      } else {
        icon.classList.add("draw");
        icon.textContent = "=";
      }

      const text = document.createElement("span");
      text.textContent = `${
        item.result === "X" ? "X Won" : item.result === "O" ? "O Won" : "Draw"
      } - ${item.timestamp}`;

      li.appendChild(icon);
      li.appendChild(text);
      historyList.appendChild(li);
    });
  }

  // Handle Cell Click
  function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute("data-cell-index"));

    if (gameBoard[cellIndex] !== "" || !gameActive) return;

    // Update game board and UI
    gameBoard[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    // Add click animation
    if (gameSettings.animations) {
      cell.style.transform = "scale(0.9)";
      setTimeout(() => {
        cell.style.transform = "scale(1)";
      }, 200);
    }

    // Check for winner
    const result = checkWinner();

    if (result) {
      gameActive = false;

      // Disable further clicks
      cells.forEach((c) => {
        c.style.pointerEvents = "none";
      });

      setTimeout(() => showResultModal(result), 500);
    } else {
      // Switch player
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTurnIndicator();

      // If playing against computer and it's computer's turn
      if (gameSettings.mode === "pvc" && currentPlayer === "O") {
        setTimeout(makeComputerMove, 800);
      }
    }
  }

  // Computer move logic (basic AI)
  function makeComputerMove() {
    if (!gameActive) return;

    // Simple AI - first try to win, then block, then random
    let move = findWinningMove("O") || findWinningMove("X") || findRandomMove();

    if (move !== null) {
      gameBoard[move] = "O";
      cells[move].textContent = "O";
      cells[move].classList.add("o");

      // Add click animation
      if (gameSettings.animations) {
        cells[move].style.transform = "scale(0.9)";
        setTimeout(() => {
          cells[move].style.transform = "scale(1)";
        }, 200);
      }

      // Check for winner
      const result = checkWinner();

      if (result) {
        gameActive = false;

        // Disable further clicks
        cells.forEach((c) => {
          c.style.pointerEvents = "none";
        });

        setTimeout(() => showResultModal(result), 500);
      } else {
        currentPlayer = "X";
        updateTurnIndicator();
      }
    }
  }

  // Find a winning move for the specified player
  function findWinningMove(player) {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;

      // Check if two in a row with one empty
      if (
        gameBoard[a] === player &&
        gameBoard[b] === player &&
        gameBoard[c] === ""
      )
        return c;
      if (
        gameBoard[a] === player &&
        gameBoard[c] === player &&
        gameBoard[b] === ""
      )
        return b;
      if (
        gameBoard[b] === player &&
        gameBoard[c] === player &&
        gameBoard[a] === ""
      )
        return a;
    }
    return null;
  }

  // Find a random valid move
  function findRandomMove() {
    const availableMoves = [];
    gameBoard.forEach((cell, index) => {
      if (cell === "") availableMoves.push(index);
    });

    return availableMoves.length > 0
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
      : null;
  }

  // Event Listeners
  cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  restartBtn.addEventListener("click", () => {
    initGame();
  });

  newGameBtn.addEventListener("click", () => {
    scores = { X: 0, O: 0 };
    scoreX.textContent = "0";
    scoreO.textContent = "0";
    gameHistory = [];
    updateHistoryDisplay();
    initGame();
  });

  modalBtn.addEventListener("click", () => {
    resultModal.classList.remove("show");
    initGame();
  });

  historyBtn.addEventListener("click", () => {
    historyPanel.classList.toggle("open");
  });

  historyClose.addEventListener("click", () => {
    historyPanel.classList.remove("open");
  });

  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("open");
  });

  settingsClose.addEventListener("click", () => {
    settingsPanel.classList.remove("open");
  });

  settingsCancel.addEventListener("click", () => {
    settingsPanel.classList.remove("open");
  });

  settingsSave.addEventListener("click", () => {
    gameSettings.mode = document.querySelector(
      'input[name="gameMode"]:checked'
    ).value;
    gameSettings.theme = document.querySelector(
      'input[name="gameTheme"]:checked'
    ).value;
    gameSettings.animations = document.getElementById("animationsOn").checked;

    // Show notification
    if (gameSettings.animations) {
      const notification = document.createElement("div");
      notification.textContent = "Settings saved!";
      notification.style.position = "fixed";
      notification.style.bottom = "20px";
      notification.style.left = "50%";
      notification.style.transform = "translateX(-50%)";
      notification.style.backgroundColor = "var(--primary)";
      notification.style.color = "white";
      notification.style.padding = "10px 20px";
      notification.style.borderRadius = "50px";
      notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      notification.style.zIndex = "1002";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }

    settingsPanel.classList.remove("open");
  });

  // Initialize the game
  initGame();
  updateHistoryDisplay();

  // Load settings from localStorage if available
  if (localStorage.getItem("ticTacToeSettings")) {
    gameSettings = JSON.parse(localStorage.getItem("ticTacToeSettings"));
    document.querySelector(
      `input[name="gameMode"][value="${gameSettings.mode}"]`
    ).checked = true;
    document.querySelector(
      `input[name="gameTheme"][value="${gameSettings.theme}"]`
    ).checked = true;
    document.getElementById("animationsOn").checked = gameSettings.animations;
  }

  // Save settings to localStorage when changed
  settingsSave.addEventListener("click", () => {
    localStorage.setItem("ticTacToeSettings", JSON.stringify(gameSettings));
  });
});
