import { UPDATE_DATA, GET_CHANGELOG, initAutoHeightDetails } from "./updateData.js";

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

	for (let key in data) {
		const member = await Member.new(data[key]);
		members.push(member);
	}

	createClubInfo();

	var title = document.getElementById("title");
	title.addEventListener("click", nothing(title));
	document.getElementById("notCredit").addEventListener("click", printDebug);
}

// メンバーの情報を収納するクラス
class Member {
	constructor(data, message) {
		this.name = data.name;
		this.fileName = data.fileName;
		this.good_at = data.good_at;
		this.bgColor = data.bgColor;
		this.message = message;
	}

	static async new(data) {
		var message = "ここにテキストを入力";
		if (data.messageFile) {
			const res = await fetch('data/message/' + data.messageFile);
			message = await res.text();
		}

		return new Member(data, message);
	}
}

// そ　の　ま　ん　ま
function createElement(tagName) {
	return document.createElement(tagName);
}

function createPopUp(bgColor, message) {
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
			document.body.removeChild(blackBG);
		}, 250);
		stopMembers.forEach(stopMeb => {
			stopMeb.style.pointerEvents = 'auto';
		});
		infoDiv.style.top = '100%';
		blackBG.style.opacity = '0';
	}

	const infoTxt = createElement('div');
	infoTxt.className = 'newScrollbar1';
	infoTxt.style.maxHeight = "100%";
	infoTxt.style = "text-box-trim: both;";
	infoTxt.style.overflowY = "auto";
	infoTxt.style.paddingRight = "8px";
	infoTxt.style.marginTop = "40px";
	infoTxt.style.height = "calc(100% - 50px)";
	infoTxt.style.overflowWrap = "break-word";
	infoTxt.style.width = "100%";
	infoTxt.style.overflowX = "hidden";

	infoTxt.style.boxSizing = "border-box";

	infoTxt.innerHTML = message;

	document.body.appendChild(blackBG);
	blackBG.appendChild(infoDiv);
	infoDiv.appendChild(infoTxt);
	infoDiv.appendChild(closeBtn);

	requestAnimationFrame(() => {
		blackBG.style.opacity = '1';
		infoDiv.style.top = '50%';
	});
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

		mebImg.style.width = '125px';
		mebImg.style.height = '125px';

		mebName.style.fontSize = "20px";
		mebGoodAt.style.fontSize = "18px";

		/*
		const mouseMove = {
			transform: `translate(${x}px, ${y}px)`,
		};
		mouse.animate(mouseMove, {
			duration: 1000,
			fill: "forwards",
		});
		*/

		mebDiv.onclick = () => createPopUp(memb.bgColor, memb.message);
		
		mebDiv.appendChild(mebImg);
		mebDiv.appendChild(mebName);
		mebDiv.appendChild(mebGoodAt);
		
		contentDiv.appendChild(mebDiv);
	});
}

// メンバー紹介ページを連打するやつ向け
var count = 0;
function nothing(append) {
	var defaultTXT = append.innerHTML;
	var defaultEvent = append.onclick;
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
	append.onclick = null;
	setTimeout(() => {
		append.innerHTML = defaultTXT;
		append.onclick = defaultEvent;
	}, 1000);
}

function printDebug() {
	var debugPrint = "<div style='font-size:18px; font-weight:bold; margin-bottom:10px; line-height:1.5;'>ちょっとした情報<br>";
	var addText = (txt) => debugPrint += txt + "<br>";

	addText("現在のメンバー数: " + members.length);
	addText("以下 更新履歴")
	debugPrint += "<hr style='margin:10px 0;'>";
	
	UPDATE_DATA.forEach((data, index) => {
		debugPrint += GET_CHANGELOG(data.version, index === 0);
	});

	debugPrint += "</div>";
	createPopUp('#F0F6FF', debugPrint);
	initAutoHeightDetails();
}