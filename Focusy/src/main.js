const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let remainingTime = WORK_TIME;
let isWorkMode = true;
let isRunning = false;
let timerInterval = null;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modeLabel = document.getElementById("mode-label");

const bell = new Audio("bell.mp3");

function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateResetVisibility() {
  // En mode travail : visible uniquement si le timer tourne
  // En mode pause : toujours visible
  if (!isWorkMode || (isWorkMode && isRunning)) {
    resetBtn.classList.remove("hidden");
  } else {
    resetBtn.classList.add("hidden");
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;

  // ✅ Toujours revenir au mode Work et à 10 secondes
  isWorkMode = true;
  remainingTime = WORK_TIME;
  modeLabel.textContent = "Work";
  startBtn.textContent = "Start";

  updateDisplay();
  updateResetVisibility();
}

function switchMode() {
  isWorkMode = !isWorkMode;
  remainingTime = isWorkMode ? WORK_TIME : BREAK_TIME;
  modeLabel.textContent = isWorkMode ? "Work" : "Break";
  updateDisplay();
  startTimer(true); // démarre automatiquement l’autre phase
  updateResetVisibility();
}

function startTimer(autoStart = false) {
  if (isRunning && !autoStart) {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = "Start";
    updateResetVisibility();
    return;
  }

  isRunning = true;
  startBtn.textContent = "Pause";
  updateResetVisibility();

  timerInterval = setInterval(() => {
    remainingTime--;
    updateDisplay();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      bell.play();
      switchMode();
    }
  }, 1000);
}

startBtn.addEventListener("click", () => startTimer());
resetBtn.addEventListener("click", () => resetTimer());
updateDisplay();
updateResetVisibility();

// --- Popup settings ---
const settingsBtn = document.querySelector(".settings-btn");
const overlay = document.getElementById("settings-overlay");
const settingsPopup = document.getElementById("settings-popup");
const closePopup = document.getElementById("close-popup");

// Ouvrir le popup (avec animation)
settingsBtn.addEventListener("click", () => {
  overlay.classList.add("visible");
});

// Fermer le popup avec le bouton X
closePopup.addEventListener("click", () => {
  overlay.classList.remove("visible");
});

// Fermer le popup si on clique en dehors
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.classList.remove("visible");
  }
});
