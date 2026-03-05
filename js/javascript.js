import { createElement } from "./backend/elements.js";
import { printDebug } from "./version/printDebug.js";
import { createPopUp } from "./backend/createPopUp.js";
import { isSmartPhone } from "./backend/checker.js";

// 特にいうことなし
var members = [];

// ページ読み込み時の処理
window.onload = function () {
	loadMemberData();
};

// メンバー情報の読み取り
async function loadMemberData() {
	const res = await fetch('data/members.json');
	const data = await res.json();

	/*
	一つずつロードしていくタイプ
	for (let key in data) {
		const member = await Member.new(data[key]);
		members.push(member);
	}*/

	// 一気にすべてをロードするタイプ
	const promises = Object.values(data).map(d => new Member(d));
	members = await Promise.all(promises);

	createClubInfo();

	var title = document.getElementById("title");
	title.addEventListener("click", function (e) {
		nothing(title);
	});
	document.getElementById("notCredit").addEventListener("click", printDebug);
}

// メンバーの情報を収納するクラス
class Member {
	constructor(data) {
		this.name = data.name;
		this.fileName = data.fileName;
		this.good_at = data.good_at;
		this.bgColor = data.bgColor;
	}
}



// メンバーのタイル作成 & タップ時の挙動
function createClubInfo() {
	const contentDiv = document.querySelector('.memberContent');
	members.forEach(memb => {
		const mebDiv = createElement('div');
		const mebImg = createElement('img');
		const mebName = createElement('p');
		const mebGoodAt = createElement('p');

		mebDiv.className = 'member canSelect';
		mebDiv.style.backgroundColor = memb.bgColor;

		mebImg.src = 'images/' + memb.fileName;
		mebName.textContent = '名前: ' + memb.name;
		mebGoodAt.textContent = '得意分野: ' + memb.good_at;

		console.log(isSmartPhone());
		var imgSize = (isSmartPhone() ? 150 : 125);
		var fontSize = (isSmartPhone() ? 30 : 20);
		var goodSize = (isSmartPhone() ? 23 : 18);
		mebImg.style.width = imgSize + 'px';
		mebImg.style.height = imgSize + 'px';

		mebName.style.fontSize = fontSize + "px";
		mebGoodAt.style.fontSize = goodSize + "px";

		/*
		const mouseMove = {
			transform: `translate(${x}px, ${y}px)`,
		};
		mouse.animate(mouseMove, {
			duration: 1000,
			fill: "forwards",
		});
		*/

		mebDiv.addEventListener("click", () => createPopUp(memb.bgColor, memb.name));
		
		mebDiv.appendChild(mebImg);
		mebDiv.appendChild(mebName);
		mebDiv.appendChild(mebGoodAt);
		
		contentDiv.appendChild(mebDiv);
	});
}

// メンバー紹介ページを連打するやつ向け
var count = 0;
var cantClick = false;
function nothing(append) {
	if (cantClick) return;
	var defaultTXT = append.innerHTML;
	var txt = "それ以上も<br>これ以下もない";
	if (count < 2)
		txt = defaultTXT;
	if (count == 2)
		txt = "ほんとに<br>なんもないよ"
	if (count > 4)
		txt = "マジで<br>なんもないよ？"
	if (count >= 10)
		txt = "え？暇人？";
	if (count >= 15)
		txt = "ここ押した回数<br>" + count + "回目だよ？";

	count++;
	append.innerHTML = txt;
	cantClick = true;
	setTimeout(() => {
		append.innerHTML = defaultTXT;
		cantClick = false;
	}, 1000);
}