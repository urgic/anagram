
window.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("canvas");
const wordsContainer = document.getElementById("words");
const wordInput = document.getElementById("wordInput");
const buildBtn = document.getElementById("buildBtn");
const letterInput = document.getElementById("letterInput");
const addLetterBtn = document.getElementById("addLetterBtn");
const resetLettersBtn = document.getElementById("resetLettersBtn");

let letters = {};
let squares = {};
let letterId = 0;
let squareId = 0;

/* ---------- BUILD WORD BOXES ---------- */
function buildWords(lengths) {
wordsContainer.innerHTML = "";
squares = {};
squareId = 0;

// Clear letters
for (const id in letters) {
const l = letters[id];
if (l.el.parentElement) canvas.removeChild(l.el);
}
letters = {};
letterId = 0;

lengths.forEach(len => {
const word = document.createElement("div");
word.className = "word";

for (let i = 0; i < len; i++) {
const sq = document.createElement("div");
sq.className = "square";
sq.dataset.id = squareId;

squares[squareId] = {
el: sq,
rect: null,
letterId: null
};

word.appendChild(sq);
squareId++;
}

wordsContainer.appendChild(word);
});

// Allow layout to settle before measuring
requestAnimationFrame(() => {
cacheSquareRects();
});

letterInput.focus();
}

/* ---------- ADD LETTER ---------- */
function addLetter(char) {
const id = letterId++;
const el = document.createElement("div");
el.className = "letter";
el.textContent = char;
el.dataset.id = id;

const offset = (id % 10) * 20;

letters[id] = {
id,
el,
left: 20 + offset,
top: 150 + offset,
squareId: null,
locked: false
};

el.style.left = letters[id].left + "px";
el.style.top = letters[id].top + "px";

canvas.appendChild(el);
enableDrag(id);
}

/* ---------- CACHE SQUARE POSITIONS ---------- */
function cacheSquareRects() {
const canvasRect = canvas.getBoundingClientRect();
for (const id in squares) {
const r = squares[id].el.getBoundingClientRect();
squares[id].rect = {
left: r.left - canvasRect.left,
top: r.top - canvasRect.top,
width: r.width,
height: r.height
};
}
}

/* ---------- SNAP ---------- */
function findSnapSquare(letter) {
const cx = letter.left + 22;
const cy = letter.top + 22;

for (const id in squares) {
const sq = squares[id];
if (sq.letterId !== null) continue;

const r = sq.rect;
if (
cx > r.left &&
cx < r.left + r.width &&
cy > r.top &&
cy < r.top + r.height
) {
return id;
}
}
return null;
}

function placeInSquare(letter, squareId) {
const r = squares[squareId].rect;
letter.left = r.left + r.width / 2 - 22;
letter.top = r.top + r.height / 2 - 22;
letter.squareId = squareId;
squares[squareId].letterId = letter.id;
}

/* ---------- DRAG / TAP / DELETE ---------- */
function enableDrag(id) {
const l = letters[id];
const el = l.el;

let dragging = false;
let longPressTimer;

/* ---------- POINTER DOWN ---------- */
el.addEventListener("pointerdown", e => {
if (l.locked) return; // locked letters cannot move

dragging = false;

// Long press delete
longPressTimer = setTimeout(() => {
if (el.parentElement) canvas.removeChild(el);
if (l.squareId !== null) squares[l.squareId].letterId = null;
delete letters[id];
}, 500);

el.setPointerCapture(e.pointerId);
});

/* ---------- POINTER MOVE ---------- */
el.addEventListener("pointermove", e => {
if (!el.hasPointerCapture(e.pointerId)) return;

// First movement = real drag
if (!dragging) {
dragging = true;
clearTimeout(longPressTimer);

// Detach from square ONLY when drag starts
if (l.squareId !== null) {
squares[l.squareId].letterId = null;
l.squareId = null;
l.locked = false;
el.classList.remove("locked");
}
}

l.left += e.movementX;
l.top += e.movementY;
el.style.left = l.left + "px";
el.style.top = l.top + "px";
});

/* ---------- POINTER UP ---------- */
el.addEventListener("pointerup", e => {
clearTimeout(longPressTimer);

if (dragging) {
cacheSquareRects();
const snap = findSnapSquare(l);
if (snap !== null) placeInSquare(l, snap);
}
});

/* ---------- TAP TO LOCK ---------- */
el.addEventListener("click", e => {
if (l.squareId === null) return;

l.locked = !l.locked;
el.classList.toggle("locked", l.locked);
});
}

/* ---------- UI EVENTS ---------- */
buildBtn.addEventListener("click", () => {
const input = wordInput.value.trim();
if (!input) return;
const lengths = input
.split(/\s+/)
.map(n => parseInt(n, 10))
.filter(n => n > 0 && n < 20);
if (lengths.length) buildWords(lengths);
});

addLetterBtn.addEventListener("click", () => {
const char = letterInput.value.trim().toUpperCase();
if (!char.match(/^[A-Z]$/)) return;
addLetter(char);
letterInput.value = "";
letterInput.focus();
});

letterInput.addEventListener("keydown", e => {
if (e.key === "Enter") {
const char = letterInput.value.trim().toUpperCase();
if (!char.match(/^[A-Z]$/)) return;
addLetter(char);
letterInput.value = "";
letterInput.focus();
e.preventDefault();
}
});

resetLettersBtn.addEventListener("click", () => {
for (const id in letters) {
const l = letters[id];
if (l.el.parentElement) canvas.removeChild(l.el);
}
letters = {};
letterId = 0;
letterInput.focus();
});
});

