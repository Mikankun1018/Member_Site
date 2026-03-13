export const cache = new Map();
export const jsCache = new Map();

export async function cachePopUp(member) {
	const filePos = `data/Message/${member}/Member.html`;
	if (cache.has(filePos))
		return cache.get(filePos);
	
	try {
		const res = await fetch(filePos);
		if (!res.ok) throw new Error();
		const html = await res.text();
		cache.set(filePos, html);
		await cacheScriptsFromHTML(html, filePos);
		return html;
	} catch {
		cache.set(filePos, null);
		return null;
	}
}

export async function cacheScriptsFromHTML(html, basePath) {
	const doc = new DOMParser().parseFromString(html, "text/html");
	const scripts = doc.querySelectorAll("script[src]");
	const baseDir = basePath.substring(0, basePath.lastIndexOf("/") + 1);

	for (const s of scripts) {
		const src = s.getAttribute("src");
		await cacheScript(src, baseDir);
	}
}

export async function cacheScript(src, basePath = "") {
	let fullPath = src;
	if (!src.startsWith("http") && !src.startsWith("/"))
		fullPath = basePath + src;

	if (jsCache.has(fullPath))
		return jsCache.get(fullPath);

	try {
		const res = await fetch(fullPath);
		if (!res.ok) throw new Error();
		const js = await res.text();
		jsCache.set(fullPath, js);
		await cacheImports(js, fullPath);
		return js;
	} catch {
		jsCache.set(fullPath, null);
		return null;
	}
}

async function cacheImports(js, basePath) {
	const importRegex = /import\s+(?:.*?\s+from\s+)?["'](.+?)["']/g;
	let match;
	while ((match = importRegex.exec(js)) !== null) {
		let path = match[1];
		if (path.startsWith(".") || path.startsWith("/")) {
			const full = new URL(path, basePath).href;
			await cacheScript(full);
		}
	}
}