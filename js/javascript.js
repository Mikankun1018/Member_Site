var members = [];
window.onload = function() { loadMemberData(); };

async function loadMemberData() {
	const res = await fetch('data/members.json');
	const data = await res.json();

	for (let key in data) {
		const member = new Member(data[key]);
		members.push(member);
	}

	createClubInfo();
}

class Member {
	constructor(data) {
		this.name = data.name;
		this.fileName = data.fileName;
		this.good_at = data.good_at;
		this.bgColor = data.bgColor;
	}
}

function createElement(tagName) {
	return document.createElement(tagName);
}

function createClubInfo() {
	const contentDiv = document.querySelector('.memberContent');
	members.forEach(memb => {
		const mebDiv = createElement('div');
		const mebImg = createElement('img');
		const mebName = createElement('p');
		const mebGoodAt = createElement('p');

		mebDiv.className = 'member';
		mebDiv.style.backgroundColor = memb.bgColor;

		mebImg.src = 'images/' + memb.fileName;
		mebName.textContent = '名前: ' + memb.name;
		mebGoodAt.textContent = '得意分野: ' + memb.good_at;

		mebImg.style.width = '100px';
		mebImg.style.height = '100px';

		mebDiv.onclick = function() {
		}
		
		mebDiv.appendChild(mebImg);
		mebDiv.appendChild(mebName);
		mebDiv.appendChild(mebGoodAt);
		
		contentDiv.appendChild(mebDiv);
	});
}
