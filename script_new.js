alert("JS loaded");
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

// Create squares
for (let i = 0; i < num; i++) {
const sq = document.createElement("div");
sq.classList.add("square");
sq.dataset.index = i;
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

// Allow Enter key in letter input
letterInput.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
addBtn.click();
}
});

// ==== Reset canvas ====
resetBtn.addEventListener("click", () => {
canvas.innerHTML = "";
squares = [];
});

// ==== Add letters function ====
function addLetter(chars) {
for (let i = 0; i < chars.length; i++) {
const char = chars[i];
if (!char.match(/[a-zA-Z]/)) continue; // letters only

const letterEl = document.createElement("div");
letterEl.classList.add("letter");

// Vowel / consonant coloring
if ("AEIOUaeiou".includes(char)) {
letterEl.classList.add("vowel"); // green
} else {
letterEl.classList.add("consonant"); // red
}

letterEl.textContent = char;

// Random initial position inside canvas
letterEl.style.top = Math.random() * (canvas.clientHeight - 40) + "px";
letterEl.style.left = Math.random() * (canvas.clientWidth - 40) + "px";

// Append to canvas
canvas.appendChild(letterEl);

// Enable dragging and interaction
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
if (isLocked) return; // locked letters cannot move

letterEl.setPointerCapture(e.pointerId);
offsetX = e.clientX - letterEl.offsetLeft;
offsetY = e.clientY - letterEl.offsetTop;

// Long press for delete (600ms)
longPressTimer = setTimeout(() => {
letterEl.remove();
}, 600);
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

// Snap to closest square if inside
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
// Snap
letterEl.style.top = sq.offsetTop + "px";
letterEl.style.left = sq.offsetLeft + "px";
currentSquare = sq;

// Auto show lock indicator (but not locked yet)
letterEl.classList.add("locked");
snapped = true;
break;
}
}

if (!snapped) {
// Remove lock indicator if not in a square
letterEl.classList.remove("locked");
currentSquare = null;
}
});

// Tap to toggle lock (only if in square)
letterEl.addEventListener("click", (e) => {
if (!currentSquare) return;
isLocked = !isLocked;

if (isLocked) {
letterEl.classList.add("locked");
} else {
letterEl.classList.remove("locked");
}
});
}

	
