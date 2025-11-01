const WORK_TIME = 25 * 60; // test rapide
const BREAK_TIME = 5 * 60;

let remainingTime = WORK_TIME;
let isWorkMode = true;
let isRunning = false;
let timerInterval = null;
let bell = new Audio("bell.mp3"); // sonnerie par défaut

// Sélecteurs principaux
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modeLabel = document.getElementById("mode-label");

// --- SETTINGS ---
const settingsBtn = document.querySelector(".settings-btn");
const overlay = document.getElementById("settings-overlay");
const settingsPopup = document.getElementById("settings-popup");
const closePopup = document.getElementById("close-popup");
const themeToggle = document.getElementById("theme-toggle");
const alarmInput = document.getElementById("alarm-input");

// --- TIMER LOGIC ---
function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateResetVisibility() {
  if (!isWorkMode || (isWorkMode && isRunning)) {
    resetBtn.classList.remove("hidden");
  } else {
    resetBtn.classList.add("hidden");
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
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
  startTimer(true);
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

// --- SETTINGS POPUP LOGIC ---
settingsBtn.addEventListener("click", () => overlay.classList.add("visible"));
closePopup.addEventListener("click", () => overlay.classList.remove("visible"));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.remove("visible");
});

// --- THEME TOGGLE ---
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "Dark"
    : "Light";
});

// --- CUSTOM ALARM FILE ---
alarmInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    bell = new Audio(url); // remplacer le son par le fichier choisi
  }
});
