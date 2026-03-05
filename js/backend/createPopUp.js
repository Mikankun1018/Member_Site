import { add, remove, createElement } from "../backend/elements.js";
export async function createPopUp(bgColor, message, debugText) {
	var stopMembers = document.querySelectorAll('.member');
	stopMembers.forEach(stopMeb => {
		stopMeb.style.pointerEvents = 'none';
	});
	const blackBG = createElement('div');
	blackBG.style.position = 'fixed';
	blackBG.style.top = '0';
	blackBG.style.left = '0';
	blackBG.style.width = '100%';
	blackBG.style.height = '100%';
	blackBG.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	blackBG.style.opacity = '0';
	blackBG.style.transition = "opacity 0.25s ease-in-out";
	blackBG.style.zIndex = '999';

	const infoDiv = createElement('div');
	infoDiv.style.position = 'absolute';
	infoDiv.style.top = '100%';
	infoDiv.style.left = '50%';
	infoDiv.style.width = "40%";
	infoDiv.style.minWidth = "300px";
	infoDiv.style.height = "60%";
	infoDiv.style.padding = '20px';
	infoDiv.style.backgroundColor = bgColor;
	infoDiv.style.border = '2px solid #000';
	infoDiv.style.borderRadius = '10px';
	infoDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
	infoDiv.style.transform = 'translate(-50%, -50%)';
	infoDiv.style.transition = "all 0.25s ease-in-out";
	infoDiv.style.overflow = "hidden";
			
	const closeBtn = createElement('span');
	closeBtn.innerHTML = '&times;';
	closeBtn.style.position = 'absolute';
	closeBtn.style.top = '5px';
	closeBtn.style.right = '10px';
	closeBtn.style.fontSize = '30px';
	closeBtn.style.cursor = 'pointer';
	
	closeBtn.onclick = function () {
		setTimeout(() => {
			remove(document.body, blackBG);
		}, 250);
		stopMembers.forEach(stopMeb => {
			stopMeb.style.pointerEvents = 'auto';
		});
		infoDiv.style.top = '100%';
		blackBG.style.opacity = '0';
	}

	add(document.body, blackBG);
	add(blackBG, infoDiv);

	var findFile = false;
	const filePos = `data/Message/${message}/Member.html`;
	if (!debugText)
		try {
			const res = await fetch(filePos);
			findFile = res.ok;
		} catch (e) { findFile = false; }
	
	var infoTxt = (findFile ? document.createElement("iframe") : infoTxt = createElement('div'));
	if (!findFile) infoTxt.innerHTML = (debugText ? message : "ファイルが見つかりませんでした。");
	else infoTxt.src = filePos;

	infoTxt.className = 'newScrollbar1';
	infoTxt.style.maxHeight = "100%";
	infoTxt.style.overflowY = "auto";
	infoTxt.style.paddingRight = "8px";
	infoTxt.style.marginTop = "40px";
	infoTxt.style.height = "calc(100% - 50px)";
	infoTxt.style.overflowWrap = "break-word";
	infoTxt.style.width = "100%";
	infoTxt.style.overflowX = "hidden";

	infoTxt.style.boxSizing = "border-box";
	infoTxt.style.border = "none";
	infoTxt.style.outline = "none";

	add(infoDiv, infoTxt);
	add(infoDiv, closeBtn);

	requestAnimationFrame(() => {
		blackBG.style.opacity = '1';
		infoDiv.style.top = '50%';
	});
}