import { add, remove, createElement } from "../backend/elements.js";
import { isSmartPhone } from "./checker.js";

export async function createPopUp(bgColor, message, debugText = false) {

	const stopMembers = document.querySelectorAll('.member');
	stopMembers.forEach(m => m.style.pointerEvents = 'none');

	// 背景
	const blackBG = createElement('div');
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
	const isMobile = isSmartPhone();

	Object.assign(infoDiv.style, {
		position: 'absolute',
		top: '100%',
		left: '50%',
		width: isMobile ? '85%' : '40%',
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
		const filePos = `data/Message/${message}/Member.html`;
		try {
			const res = await fetch(filePos, { cache: "no-store" });
			if (!res.ok) throw new Error();
			const html = await res.text();
			infoTxt.innerHTML = html;
			executeScripts(infoTxt, filePos);
		} catch {
			infoTxt.innerHTML = "ファイルが見つかりませんでした。";
		}
	}

	requestAnimationFrame(() => {
		blackBG.style.opacity = '1';
		infoDiv.style.top = '50%';
	});

}

function executeScripts(container, basePath) {
	const scripts = container.querySelectorAll("script");
	scripts.forEach(oldScript => {
		const newScript = document.createElement("script");
		if (oldScript.src) {
			let src = oldScript.getAttribute("src");
			if (!src.startsWith("http") && !src.startsWith("/")) {
				const baseDir = basePath.substring(0, basePath.lastIndexOf("/") + 1);
				src = baseDir + src;
			}
			newScript.src = src;
			newScript.defer = true;
		} else
			newScript.textContent = oldScript.textContent;
		document.body.appendChild(newScript);
		oldScript.remove();
	});
}