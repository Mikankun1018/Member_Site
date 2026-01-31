export const VERSION = "0.0.4";

export const UPDATE_DATA = [
	{
		version: "0.0.4",
		date: "2026/01/31",
		add: [
			"簡単な情報を確認できる機能を追加しました",
			"アップデート履歴を表示できるようにしました"
		],
		change: [
			"Mikankun のプロフィール内容を更新しました"
		]
	},
	{
		version: "0.0.31",
		date: "2026/01/30",
		change: [
			"Blackfox のアイコン画像を変更しました"
		]
	},
	{
		version: "0.0.3",
		date: "2026/01/28",
		change: [
			"タイトルを「テンプレート」から「メンバー紹介ページ」に変更しました",
			"メンバー紹介ポップアップの表示を微調整しました"
		]
	},
	{
		version: "0.0.2",
		date: "2026/01/26",
		add: [
			"メンバーの詳細情報を確認できるようにしました"
		],
		change: [
			"サイト全体のデザインをシンプル寄りに変更しました"
		]
	},
	{
		version: "0.0.1",
		date: "2026/01/23",
		add: [
			"index.html を追加しました",
			"メンバーデータを追加しました",
			"メンバー画像を追加しました"
		]
	}
];

export const GET_CHANGELOG = function (version, open = false) {
	if (!Array.isArray(UPDATE_DATA))
		return "No update data found.";

	const data = UPDATE_DATA.find(v => v.version === version);
	if (!data) return "No changelog for this version.";

	const openAttr = open ? " open" : "";

	const addBlock = (title, cls, list) => {
		if (!Array.isArray(list) || list.length === 0) return "";
		return `
			<div class="logTitle ${cls}">${title}</div>
			<ul class="logList">
				${list.map(i => `<li>${i}</li>`).join("")}
			</ul>
		`;
	};

	return `
		<details${openAttr} class="logItem">
			<summary class="canSelect logSummary">
				更新履歴 v${data.version} | ${data.date}
			</summary>

			<!-- アニメーション対象 -->
			<div class="logBody">
				${addBlock("追加", "add", data.add)}
				${addBlock("削除", "remove", data.remove)}
				${addBlock("変更", "change", data.change)}
				${addBlock("修正", "fix", data.fix)}
			</div>
		</details>
	`;
};

export const initAutoHeightDetails = function () {
	document.querySelectorAll("details").forEach(details => {
		const summary = details.querySelector("summary");
		const body = details.querySelector(".logBody");
		if (!summary || !body) return;
		
		const summaryHeight = summary.offsetHeight;

		if (!details.open)
			details.style.height = summaryHeight + "px";
		else
			details.style.height = summaryHeight + body.scrollHeight + "px";

		details.addEventListener("toggle", () => {
			if (details.open) {
				const startH = details.getBoundingClientRect().height;
				const targetH = summary.offsetHeight + body.scrollHeight + 8;
				details.style.height = startH + "px";
				void details.offsetHeight;
				details.style.height = targetH + "px";
			} else {
				const startH = details.getBoundingClientRect().height;
				details.style.height = startH + "px";
				void details.offsetHeight;
				details.style.height = summaryHeight + "px";
			}
		});
		
		details.recalcHeight = () => {
			if (details.open) {
				details.style.height = summary.offsetHeight + body.scrollHeight + "px";
			} else {
				details.style.height = summary.offsetHeight + "px";
			}
		};
	});
}