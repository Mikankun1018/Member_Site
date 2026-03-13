export function isSmartPhone() {
	if (navigator.userAgent.match(/iPhone|Android.+Mobile/) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
		return true;
	else
		return false;
}

export var isHiddenSite = false;

document.addEventListener("visibilitychange", () => {
	console.log(document.visibilityState);
	isHiddenSite = document.visibilityState === "hidden";
});