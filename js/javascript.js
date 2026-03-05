import { createElement } from "./backend/elements.js";
import { printDebug } from "./version/printDebug.js";
import { createPopUp } from "./backend/createPopUp.js";
import { isSmartPhone } from "./backend/checker.js";

let members = [];

window.addEventListener("load", loadMemberData);

async function loadMemberData() {
	try {
		const res = await fetch("data/members.json");
		if (!res.ok) throw new Error("members.json 読み込み失敗");

		const data = await res.json();

		members = Object.values(data).map(d => new Member(d));

		createClubInfo();

		const title = document.getElementById("title");
		title.addEventListener("click", () => nothing(title));

		document.getElementById("notCredit").addEventListener("click", printDebug);

	} catch (err) {
		console.error(err);
		createPopUp("#ffdddd", "メンバーデータの読み込みに失敗しました", true);
	}
}

class Member {
	constructor(data) {
		this.name = data.name;
		this.fileName = data.fileName;
		this.good_at = data.good_at;
		this.bgColor = data.bgColor;
	}
}

function createClubInfo() {
	const contentDiv = document.querySelector(".memberContent");
	const fragment = document.createDocumentFragment();

	const isMobile = isSmartPhone();

	const imgSize = isMobile ? 150 : 125;
	const fontSize = isMobile ? 30 : 20;
	const goodSize = isMobile ? 23 : 18;

	members.forEach(memb => {
		const mebDiv = createElement("div");
		const mebImg = createElement("img");
		const mebName = createElement("p");
		const mebGood = createElement("p");
		const mebGoodAt = createElement("p");

		mebDiv.className = "member canSelect";
		mebDiv.style.backgroundColor = memb.bgColor;

		mebImg.src = `images/${memb.fileName}`;
		mebImg.width = imgSize;
		mebImg.height = imgSize;

		mebName.textContent = memb.name;
		mebGood.textContent = "得意分野";
		mebGoodAt.textContent = memb.good_at;

		mebName.style.fontSize = `${fontSize}px`;
		mebGood.style.fontSize = `${goodSize}px`;
		mebGoodAt.style.fontSize = `${goodSize}px`;
		mebGoodAt.style.marginTop = `-${goodSize - 4}px`;

		mebDiv.addEventListener("click", () =>
			createPopUp(memb.bgColor, memb.name)
		);

		mebDiv.append(mebImg, mebName, mebGood, mebGoodAt);

		fragment.appendChild(mebDiv);
	});

	contentDiv.appendChild(fragment);
}

let count = 0;
let cantClick = false;

function nothing(element) {
	if (cantClick) return;

	const defaultTXT = element.innerHTML;

	let txt = defaultTXT;

	if (count === 2) txt = "ほんとに<br>なんもないよ";
	else if (count > 4) txt = "マジで<br>なんもないよ？";
	else if (count >= 10) txt = "え？暇人？";
	else if (count >= 15) txt = `ここ押した回数<br>${count}回目だよ？`;

	count++;

	element.innerHTML = txt;
	cantClick = true;

	setTimeout(() => {
		element.innerHTML = defaultTXT;
		cantClick = false;
	}, 1000);
}