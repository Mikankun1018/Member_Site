var clubData = [];
window.onload = function() { loadClubData(); };

async function loadClubData() {
	const res = await fetch('data/clubs.json');
	const data = await res.json();

	for (let key in data) {
		const club = new Club(data[key].clubName, data[key].activityDay, data[key].activityPlace);
		clubData.push(club);
	}

	createClubInfo();
}

class Club {
	constructor(clubName, activityDay, activityPlace) {
		this.clubName = clubName;
		this.activityDay = activityDay;
		this.activityPlace = activityPlace;
	}
}

function createElement(tagName) {
	return document.createElement(tagName);
}

function createClubInfo() {
	const contentDiv = document.querySelector('.clubContent');
	clubData.forEach(club => {
		const clubDiv = document.createElement('div');
		const clubH2 = document.createElement('h2');
		const clubDay = document.createElement('p');
		const clubPlace = document.createElement('p');
		clubDiv.classList.add('club');
		
		clubH2.innerHTML = club.clubName;
		clubDay.innerHTML = "活動日: " + club.activityDay
		clubPlace.innerHTML = "活動場所: " + club.activityPlace;
		clubDiv.appendChild(clubH2);
		clubDiv.appendChild(clubDay);
		clubDiv.appendChild(clubPlace);
		
		contentDiv.appendChild(clubDiv);
	});
}
