alert("Running");
const canvas = document.getElementById("canvas");
const numLettersInput = document.getElementById("numLetters");
const letterInput = document.getElementById("letterInput");
const buildBtn = document.getElementById("buildBtn");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");

const BOX = 50;
const GAP = 8;
const WORD_GAP = 24;
const ROW_GAP = 14;

let squares = [];

/* ================= BUILD ================= */

buildBtn.addEventListener("click", () => {
const raw = numLettersInput.value.trim();
if (!raw) {
alert("Enter numbers like: 3 5 4");
return;
}

const words = raw
.split(/[\s,]+/)
.map(n => parseInt(n, 10))
.filter(n => n > 0);

if (!words.length) {
alert("No valid numbers.");
return;
}

canvas.innerHTML = "";
squares = [];

let x = 0;
let y = 0;
const maxWidth = canvas.clientWidth;

for (const count of words) {
const wordWidth = count * BOX + (count - 1) * GAP;

if (x + wordWidth > maxWidth) {
x = 0;
y += BOX + ROW_GAP;
}

for (let i = 0; i < count; i++) {
const sq = document.createElement("div");
sq.className = "square";
sq.style.left = x + "px";
sq.style.top = y + "px";
canvas.appendChild(sq);
squares.push(sq);

x += BOX + GAP;
}

x += WORD_GAP;
}
});

/* ================= ADD LETTERS ================= */

addBtn.addEventListener("click", () => {
const text = letterInput.value.trim();
if (!text) return;
addLetters(text);
letterInput.value = "";
});

letterInput.addEventListener("keydown", e => {
if (e.key === "Enter") addBtn.click();
});

function addLetters(text) {
for (const rawChar of text) {
if (!/[a-z]/i.test(rawChar)) continue;

const char = rawChar.toUpperCase();
const el = document.createElement("div");
el.className = "letter";
el.textContent = char;

el.classList.add(
"AEIOU".includes(char) ? "vowel" : "consonant"
);

el.style.left = Math.random() * (canvas.clientWidth - BOX) + "px";
el.style.top = Math.random() * (canvas.clientHeight - BOX) + "px";

canvas.appendChild(el);
enableDrag(el);
}
}

/* ================= DRAG / SNAP / LOCK ================= */

function enableDrag(el) {
let offsetX, offsetY;
let currentSquare = null;
let locked = false;
let longPress;

el.addEventListener("pointerdown", e => {
if (locked) return;

el.setPointerCapture(e.pointerId);
const rect = canvas.getBoundingClientRect();

offsetX = e.clientX - rect.left - el.offsetLeft;
offsetY = e.clientY - rect.top - el.offsetTop;

longPress = setTimeout(() => el.remove(), 600);
});

el.addEventListener("pointermove", e => {
if (!el.hasPointerCapture(e.pointerId)) return;
clearTimeout(longPress);

const rect = canvas.getBoundingClientRect();
let x = e.clientX - rect.left - offsetX;
let y = e.clientY - rect.top - offsetY;

x = Math.max(0, Math.min(canvas.clientWidth - BOX, x));
y = Math.max(0, Math.min(canvas.clientHeight - BOX, y));

el.style.left = x + "px";
el.style.top = y + "px";
});

el.addEventListener("pointerup", e => {
el.releasePointerCapture(e.pointerId);
clearTimeout(longPress);

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

/* === TAP TO LOCK (ONLY IN SQUARE) === */
el.addEventListener("click", () => {
if (!currentSquare) return;

locked = !locked;
el.classList.toggle("locked", locked);
});
}

	

