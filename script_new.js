alert("JS Running");
const canvas = document.getElementById("canvas");
const numLettersInput = document.getElementById("numLetters");
const letterInput = document.getElementById("letterInput");
const buildBtn = document.getElementById("buildBtn");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");

const BOX = 50;
const GAP = 10;

let squares = [];

/* ===== BUILD ===== */
buildBtn.addEventListener("click", () => {
const num = parseInt(numLettersInput.value, 10);
if (!num || num < 1) {
alert("Enter a valid number");
return;
}

canvas.innerHTML = "";
squares = [];

let x = 0;
let y = 0;
const maxWidth = canvas.clientWidth;

for (let i = 0; i < num; i++) {
if (x + BOX > maxWidth) {
x = 0;
y += BOX + GAP;
}

const sq = document.createElement("div");
sq.className = "square";
sq.style.left = x + "px";
sq.style.top = y + "px";

canvas.appendChild(sq);
squares.push(sq);

x += BOX + GAP;
}
});

/* ===== ADD LETTERS ===== */
addBtn.addEventListener("click", () => {
const text = letterInput.value.trim();
if (!text) return;

for (const ch of text) {
if (!/[a-z]/i.test(ch)) continue;

const letter = document.createElement("div");
letter.className = "letter";
letter.textContent = ch.toUpperCase();

letter.classList.add(
"AEIOU".includes(letter.textContent) ? "vowel" : "consonant"
);

letter.style.left =
Math.random() * (canvas.clientWidth - BOX) + "px";
letter.style.top =
Math.random() * (canvas.clientHeight - BOX) + "px";

canvas.appendChild(letter);
enableDrag(letter);
}

letterInput.value = "";
});

/* ===== RESET ===== */
resetBtn.addEventListener("click", () => {
canvas.innerHTML = "";
squares = [];
});

/* ===== DRAG / SNAP / LOCK ===== */
function enableDrag(el) {
let offsetX, offsetY;
let currentSquare = null;
let locked = false;

el.addEventListener("pointerdown", e => {
if (locked) return;
el.setPointerCapture(e.pointerId);

const r = canvas.getBoundingClientRect();
offsetX = e.clientX - r.left - el.offsetLeft;
offsetY = e.clientY - r.top - el.offsetTop;
});

el.addEventListener("pointermove", e => {
if (!el.hasPointerCapture(e.pointerId)) return;

const r = canvas.getBoundingClientRect();
let x = e.clientX - r.left - offsetX;
let y = e.clientY - r.top - offsetY;

x = Math.max(0, Math.min(canvas.clientWidth - BOX, x));
y = Math.max(0, Math.min(canvas.clientHeight - BOX, y));

el.style.left = x + "px";
el.style.top = y + "px";
});

el.addEventListener("pointerup", e => {
el.releasePointerCapture(e.pointerId);

let snapped = false;

for (const sq of squares) {
const s = sq.getBoundingClientRect();
const l = el.getBoundingClientRect();

if (
l.left + l.width / 2 > s.left &&
l.left + l.width / 2 < s.right &&
l.top + l.height / 2 > s.top &&
l.top + l.height / 2 < s.bottom
) {
el.style.left = sq.offsetLeft + "px";
el.style.top = sq.offsetTop + "px";
currentSquare = sq;
snapped = true;
break;
}
}

if (!snapped) {
currentSquare = null;
locked = false;
el.classList.remove("locked");
}
});

el.addEventListener("click", () => {
if (!currentSquare) return;
locked = !locked;
el.classList.toggle("locked", locked);
});
}

