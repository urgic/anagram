
window.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("canvas");
const wordsContainer = document.getElementById("words");
const wordInput = document.getElementById("wordInput");
const buildBtn = document.getElementById("buildBtn");
const letterInput = document.getElementById("letterInput");
const addLetterBtn = document.getElementById("addLetterBtn");
const resetLettersBtn = document.getElementById("resetLettersBtn");

const LETTER_SIZE = 44;

let letters = {};
let squares = {};
let letterId = 0;
let squareId = 0;

/* ---------- BUILD WORD BOXES ---------- */
function buildWords(lengths) {
wordsContainer.innerHTML = "";
squares = {};
squareId = 0;

// Clear all letters
for (const id in letters) {
if (letters[id].el.parentElement) {
canvas.removeChild(letters[id].el);
}
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

requestAnimationFrame(cacheSquareRects);
letterInput.focus();
}

/* ---------- ADD LETTER ---------- */
function addLetter(char) {
const id = letterId++;
const el = document.createElement("div");
el.className = "letter";
el.textContent = char;

if ("AEIOU".includes(char)) {
el.classList.add("vowel");
} else {
el.classList.add("consonant");
}

const offset = (id % 10) * 18;

letters[id] = {
id,
el,
left: 12 + offset,
top: 12 + offset,
squareId: null,
  locked: false
};

el.style.left = letters[id].left + "px";
el.style.top = letters[id].top + "px";

canvas.appendChild(el);
enableDrag(id);
}

/* ---------- SQUARE METRICS ---------- */
function cacheSquareRects() {
const c = canvas.getBoundingClientRect();
for (const id in squares) {
const r = squares[id].el.getBoundingClientRect();
squares[id].rect = {
left: r.left - c.left,
top: r.top - c.top,
width: r.width,
height: r.height
};
}
}

function findSnapSquare(letter) {
const cx = letter.left + LETTER_SIZE / 2;
const cy = letter.top + LETTER_SIZE / 2;

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

function placeInSquare(letter, sid) {
const r = squares[sid].rect;
letter.left = r.left + r.width / 2 - LETTER_SIZE / 2;
letter.top = r.top + r.height / 2 - LETTER_SIZE / 2;
letter.squareId = sid;
squares[sid].letterId = letter.id;
}

/* ---------- DRAG / TAP / DELETE ---------- */
function enableDrag(id) {
const l = letters[id];
const el = l.el;

let dragging = false;
let longPressTimer;

el.addEventListener("pointerdown", e => {
  if (l.locked) return;
dragging = false;

longPressTimer = setTimeout(() => {
if (el.parentElement) canvas.removeChild(el);
if (l.squareId !== null) squares[l.squareId].letterId = null;
delete letters[id];
}, 500);

el.setPointerCapture(e.pointerId);
});

el.addEventListener("pointermove", e => {
if (!el.hasPointerCapture(e.pointerId)) return;

if (!dragging) {
dragging = true;
clearTimeout(longPressTimer);

if (l.squareId !== null) {
squares[l.squareId].letterId = null;
l.squareId = null;
  l.locked = false;
el.classList.remove("locked");
}
}

const rect = canvas.getBoundingClientRect();

l.left = Math.max(
0,
Math.min(l.left + e.movementX, rect.width - LETTER_SIZE)
);

l.top = Math.max(
0,
Math.min(l.top + e.movementY, rect.height - LETTER_SIZE)
);

el.style.left = l.left + "px";
el.style.top = l.top + "px";
});

el.addEventListener("pointerup", () => {
clearTimeout(longPressTimer);

if (dragging) {
cacheSquareRects();
const snap = findSnapSquare(l);
if (snap !== null) placeInSquare(l, snap);
}
});

// Visual lock indicator ONLY
el.addEventListener("click", () => {
if (l.squareId === null) return;
  l.locked = !l.locked;
el.classList.toggle("locked"' l.locked);
});
}

/* ---------- UI EVENTS ---------- */
buildBtn.addEventListener("click", () => {
const lengths = wordInput.value
.trim()
.split(/\s+/)
.map(n => parseInt(n, 10))
.filter(n => n > 0);

if (lengths.length) buildWords(lengths);
});

addLetterBtn.addEventListener("click", () => {
const text = letterInput.value.toUpperCase().replace(/[^A-Z]/g, "");
if (!text) return;
for (const ch of text) addLetter(ch);
letterInput.value = "";
letterInput.focus();
});

letterInput.addEventListener("keydown", e => {
if (e.key === "Enter") {
const text = letterInput.value.toUpperCase().replace(/[^A-Z]/g, "");
if (!text) return;
for (const ch of text) addLetter(ch);
letterInput.value = "";
letterInput.focus();
e.preventDefault();
}
});

resetLettersBtn.addEventListener("click", () => {
for (const id in letters) {
if (letters[id].el.parentElement) {
canvas.removeChild(letters[id].el);
}
}
letters = {};
letterId = 0;
});
});



