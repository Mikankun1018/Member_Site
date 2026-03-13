/// 操作
const keys = {};
const prevKeys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
const controls = {
	left: ["ArrowLeft","a","A"],
	down: ["ArrowDown", "s", "S"],
	right: ["ArrowRight", "d", "D"],
	up: ["ArrowUp", "w", "W"],
	jump: [" ","ArrowUp"]
}

export function updateInput() {
	for (const k in keys)
		prevKeys[k] = keys[k];
}

function pressedKey(arr) {
	for (const key of arr)
		if (keys[key]) return true;
	return false;
}

function justPressedKey(arr) {
	for (const key of arr)
		if (keys[key] && !prevKeys[key]) return true;
	return false;
}

function justReleasedKey(arr) {
	for (const key of arr)
		if (!keys[key] && prevKeys[key]) return true;
	return false;
}

export function pressed(str) { return pressedKey(controls[str] ?? []); }
export function justPressed(str) { return justPressedKey(controls[str] ?? []); }
export function justReleased(str) { return justReleasedKey(controls[str] ?? []); }