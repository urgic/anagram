
// ==== Global references ====
const canvas = document.getElementById("canvas");
const numLettersInput = document.getElementById("numLetters");
const letterInput = document.getElementById("letterInput");
const buildBtn = document.getElementById("buildBtn");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");

let squares = []; // Array of square elements

// ==== Build squares ====
buildBtn.addEventListener("click", () => {
const num = parseInt(numLettersInput.value);
if (isNaN(num) || num < 1) {
alert("Enter a valid number of letters.");
return;
}

// Clear previous squares and letters
canvas.innerHTML = "";
squares = [];

// Create squares horizontally
const margin = 10;
const squareSize = 50;
const perRow = Math.floor(canvas.clientWidth / (squareSize + margin));

for (let i = 0; i < num; i++) {
const sq = document.createElement("div");
sq.classList.add("square");
sq.dataset.index = i;

const row = Math.floor(i / perRow);
const col = i % perRow;

sq.style.top = row * (squareSize + margin) + "px";
sq.style.left = col * (squareSize + margin) + "px";

canvas.appendChild(sq);
squares.push(sq);
}
});

// ==== Add letters ====
addBtn.addEventListener("click", () => {
const chars = letterInput.value.trim();
if (!chars) return;

addLetter(chars);
letterInput.value = ""; // clear input
});

// Enter key triggers Add
letterInput.addEventListener("keydown", (e) => {
if (e.key === "Enter") addBtn.click();
});

// ==== Reset canvas ====
resetBtn.addEventListener("click", () => {
canvas.innerHTML = "";
squares = [];
});

// ==== Add letters function ====
function addLetter(chars) {
for (let i = 0; i < chars.length; i++) {
let char = chars[i];
if (!char.match(/[a-zA-Z]/)) continue; // only letters

char = char.toUpperCase(); // force uppercase

const letterEl = document.createElement("div");
letterEl.classList.add("letter");
letterEl.style.width = "50px";
letterEl.style.height = "50px";
letterEl.style.lineHeight = "50px";
letterEl.style.fontSize = "24px";
letterEl.style.fontWeight = "900px";
letterEl.style.textAlign = "center";
// Coloring
if ("AEIOU".includes(char)) letterEl.classList.add("vowel");
else letterEl.classList.add("consonant");

letterEl.textContent = char;

// Random offset inside canvas
letterEl.style.top = 20 + Math.random() * (canvas.clientHeight - 70) + "px";
letterEl.style.left = 20 + Math.random() * (canvas.clientWidth - 70) + "px";

canvas.appendChild(letterEl);
enableDrag(letterEl);
}
}

// ==== Drag / snap / lock / delete ====
function enableDrag(letterEl) {
let offsetX, offsetY;
let currentSquare = null;
let isLocked = false;
let longPressTimer = null;

letterEl.addEventListener("pointerdown", (e) => {
if (isLocked) return;
letterEl.setPointerCapture(e.pointerId);
offsetX = e.clientX - letterEl.offsetLeft;
offsetY = e.clientY - letterEl.offsetTop;

longPressTimer = setTimeout(() => letterEl.remove(), 600);
});

letterEl.addEventListener("pointermove", (e) => {
if (!letterEl.hasPointerCapture(e.pointerId)) return;
clearTimeout(longPressTimer);

letterEl.style.top = e.clientY - offsetY + "px";
letterEl.style.left = e.clientX - offsetX + "px";
});

letterEl.addEventListener("pointerup", (e) => {
letterEl.releasePointerCapture(e.pointerId);
clearTimeout(longPressTimer);

// Snap to square
let snapped = false;
for (let sq of squares) {
const sqRect = sq.getBoundingClientRect();
const letterRect = letterEl.getBoundingClientRect();

if (
letterRect.left + letterRect.width / 2 > sqRect.left &&
letterRect.left + letterRect.width / 2 < sqRect.right &&
letterRect.top + letterRect.height / 2 > sqRect.top &&
letterRect.top + letterRect.height / 2 < sqRect.bottom
) {
letterEl.style.top = sq.offsetTop + "px";
letterEl.style.left = sq.offsetLeft + "px";
currentSquare = sq;
letterEl.classList.add("locked"); // show lock indicator
snapped = true;
break;
}
}
if (!snapped) {
letterEl.classList.remove("locked");
currentSquare = null;
}
});

// Tap to toggle lock (only in square)
letterEl.addEventListener("click", () => {
if (!currentSquare) return;
isLocked = !isLocked;
if (isLocked) letterEl.classList.add("locked");
else letterEl.classList.remove("locked");
});
}


