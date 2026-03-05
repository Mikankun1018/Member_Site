import { UPDATE_DATA, GET_CHANGELOG, initAutoHeightDetails } from "./updateData.js";
import { createPopUp } from "../backend/createPopUp.js";
export function printDebug() {
	var debugPrint = "<div style='font-size:18px; font-weight:bold; margin-bottom:10px; line-height:1.5;'>ちょっとした情報<br>";
	var addText = (txt) => debugPrint += txt + "<br>";

	// addText("現在のメンバー数: " + members.length);
	addText("以下 更新履歴")
	debugPrint += "<hr style='margin:10px 0;'>";
	
	UPDATE_DATA.forEach((data, index) => {
		debugPrint += GET_CHANGELOG(data.version, index === 0);
	});

	debugPrint += "</div>";
	createPopUp('#F0F6FF', debugPrint, true);
	initAutoHeightDetails();
}