import { cachePopUp, jsCache } from "./cache.js";
import { add, remove, createElement } from "../backend/elements.js";
import { isSmartPhone } from "./checker.js";

export async function createPopUp(bgColor, message, debugText = false) {
	const stopMembers = document.querySelectorAll('.member');
	stopMembers.forEach(m => m.style.pointerEvents = 'none');

	// 背景
	const blackBG = createElement('div');
	blackBG.id = "bg";
	Object.assign(blackBG.style, {
		position: 'fixed',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)',
		opacity: '0',
		transition: 'opacity 0.25s ease-in-out',
		zIndex: '999'
	});

	// ポップアップ
	const infoDiv = createElement('div');
	infoDiv.id = "infoDiv";
	const isMobile = isSmartPhone();

	Object.assign(infoDiv.style, {
		position: 'absolute',
		top: '100%',
		left: '50%',
		width: isMobile ? '80%' : '40%',
		maxWidth: '800px',
		height: isMobile ? '75%' : '60%',
		padding: '20px',
		backgroundColor: bgColor,
		border: '2px solid #000',
		borderRadius: '10px',
		boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
		transform: 'translate(-50%, -50%)',
		transition: 'all 0.25s ease-in-out',
		overflow: 'hidden'
	});

	add(document.body, blackBG);
	add(blackBG, infoDiv);

	// 閉じるボタン
	const closeBtn = createElement('span');
	closeBtn.innerHTML = '&times;';

	Object.assign(closeBtn.style, {
		position: 'absolute',
		top: '5px',
		right: '10px',
		fontSize: isMobile ? '60px' : '30px',
		cursor: 'pointer'
	});

	closeBtn.onclick = () => {
		infoDiv.style.top = '100%';
		blackBG.style.opacity = '0';
		setTimeout(() => {
			remove(document.body, blackBG);
			stopMembers.forEach(m => m.style.pointerEvents = 'auto');
		}, 250);
	};

	add(infoDiv, closeBtn);
	const infoTxt = createElement('div');

	Object.assign(infoTxt.style, {
		maxHeight: "100%",
		overflowY: "auto",
		paddingRight: "8px",
		marginTop: "40px",
		height: "calc(100% - 50px)",
		overflowWrap: "break-word",
		width: "100%",
		overflowX: "hidden",
		boxSizing: "border-box"
	});

	infoTxt.className = "newScrollbar1";

	add(infoDiv, infoTxt);

	if (debugText) {
		infoTxt.innerHTML = message;
	} else {
		const html = await cachePopUp(message);
		if (html) {
			infoTxt.innerHTML = html;
			executeScripts(infoTxt, `data/Message/${message}/Member.html`);
		} else
			infoTxt.innerHTML = "ファイルが見つかりませんでした。";
	}

	requestAnimationFrame(() => {
		blackBG.style.opacity = '1';
		infoDiv.style.top = '50%';
	});
}

function executeScripts(container, basePath) {
	const scripts = container.querySelectorAll("script");
	const baseURL = new URL(basePath, location.href);
	const baseDir = baseURL.href.substring(0, baseURL.href.lastIndexOf("/") + 1);

	scripts.forEach(oldScript => {
		const newScript = document.createElement("script");
		const type = oldScript.getAttribute("type");
		if (type) newScript.type = type;

		const srcAttr = oldScript.getAttribute("src");
		if (srcAttr) {
			let src = srcAttr;

			if (!src.startsWith("http") && !src.startsWith("/"))
				src = new URL(src, baseDir).href;

			if (type === "module") newScript.src = src;
			else if (jsCache.has(src) && jsCache.get(src) !== null)
				newScript.textContent = jsCache.get(src);
			else newScript.src = src;
		} else newScript.textContent = oldScript.textContent;

		newScript.async = false;

		container.appendChild(newScript);
		oldScript.remove();
	});
}