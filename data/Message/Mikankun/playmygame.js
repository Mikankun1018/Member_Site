import { createElement, getElementById } from "../../../js/backend/elements.js";
import { GAME, checkCollision } from "./backend/Main.js";
import { updateInput } from "./backend/Input.js";
import { isHiddenSite } from "../../../../js/backend/checker.js";
import { createCharacter } from "./object/Characters.js";

const needCount = 1;

var letterCanvas;
var letterCtx;

var canvas;
var ctx;

/// キャラクター
var player;
var boyfriend;
var blaze;

/// 描画するオブジェクト達
var drawObj = [];
/// ステージ
const stageData = [];

/// 関数
async function createPlayState() {
	const state = createElement("div");
	state.id = "play";
	state.style.position = "fixed";

	// 黒帯用
	letterCanvas = createElement("canvas");
	letterCanvas.style.position = "absolute";
	letterCanvas.style.left = "0px";
	letterCanvas.style.top = "0px";
	letterCanvas.style.zIndex = 1800;

	// ゲーム描画用
	canvas = createElement("canvas");
	canvas.width = GAME.width;   // 960
	canvas.height = GAME.height; // 720

	canvas.style.position = "absolute";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.zIndex = 1900;

	getElementById("bg").appendChild(state);

	state.appendChild(letterCanvas);
	state.appendChild(canvas);

	letterCtx = letterCanvas.getContext("2d");
	ctx = canvas.getContext("2d");
	
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);

	await createChaser();
	createObject(0, 0, 200, 100);
	boyfriend.setPosition(50, GAME.height - 200);
}

function resizeCanvas() {
	const screenW = window.innerWidth;
	const screenH = window.innerHeight;

	letterCanvas.width = screenW;
	letterCanvas.height = screenH;

	const scaleX = screenW / GAME.width;
	const scaleY = screenH / GAME.height;

	const scale = Math.min(scaleX, scaleY);

	const drawW = GAME.width * scale;
	const drawH = GAME.height * scale;

	const offsetX = (screenW - drawW) / 2;
	const offsetY = (screenH - drawH) / 2;

	canvas.style.width = drawW + "px";
	canvas.style.height = drawH + "px";

	canvas.style.left = offsetX + "px";
	canvas.style.top = offsetY + "px";

	drawLetterBox(offsetX, offsetY, drawW, drawH);
}

function drawLetterBox(x, y, w, h) {
	letterCtx.fillStyle = "black";
	letterCtx.fillRect(0, 0, letterCanvas.width, letterCanvas.height);

	letterCtx.clearRect(x, y, w, h);
}

function createObject(x, y, width, height, color) {
	stageData.push({
		x: x,
		y: GAME.height - y - height,
		width: width,
		height: height,
		color: (color ?? "gray")
	});
}

async function createChaser() {
	// add(boyfriend = await createCharacter("boyfriend"));
	add(boyfriend = await createCharacter("blaze"))
}

function update(time) {
	const now = performance.now();
	if (!update.last) update.last = now;
	const dt = (now - update.last) / 1000;
	update.last = now;

	if (pushCount < needCount || shakePower !== 0) {
		shakeUpdate(dt);
	} else {
		if (!isHiddenSite) { // ← ほぼ意味ない
			for (const obj of drawObj)
				if (obj.update) obj.update(dt);

			checkCollision(boyfriend, stageData);
			chaseUpdate(dt);
		}
	}

	updateInput();
	requestAnimationFrame(update);
}

function chaseUpdate() {
	draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (const obj of stageData) {
		ctx.fillStyle = obj.color;
		ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
	}
	
	for (const obj of drawObj)
		if (obj.draw)
			obj.draw(ctx);
}



























///////////////// Backends       ///////////////////

function add(obj) {	drawObj.push(obj); }
function remove(obj) { drawObj = drawObj.filter(o => o !== obj) };


///////////////// Button Setting ///////////////////

var pushCount = 0;
var shakePower = 0;
var decay = 0.9;

playmygame.click = function() {
	if (pushCount >= needCount) return;
	if (pushCount === 0)
		requestAnimationFrame(update);

	shakePower += 20;
	pushCount++;
	if (pushCount === needCount)
		createPlayState();
}

function shakeUpdate() {
	const dot = getElementById("playmygame");

	if (!dot) return;
	let x = 0;
	let y = 0;
	if (shakePower > 0.1) {
		x = (Math.random() - 0.5) * shakePower;
		y = (Math.random() - 0.5) * shakePower;

		shakePower *= decay;
	} else
		shakePower = 0;
	
	dot.style.transform = `translate(${x}px, ${y}px)`;

	if (shakePower === 0)
		dot.style.transform = "translate(0px,0px)";
}