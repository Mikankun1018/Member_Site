export class Frames {
	constructor(image, frameData, animations) {
		this.image = image;
		this.frames = frameData;
		this.animations = animations;
	}

	get(name) {
		return this.frames[name];
	}

	getAnimation(name) {
		return this.animations[name];
	}
}

export async function loadAtlas(imagePath, xmlPath) {
	const img = new Image();
	img.src = imagePath;
	await img.decode();

	const res = await fetch(xmlPath);
	const text = await res.text();
	const xml = new DOMParser().parseFromString(text, "text/xml");

	const frameData = {};
	const animations = {};

	const textures = xml.getElementsByTagName("SubTexture");

	for (const tex of textures) {

		const name = tex.getAttribute("name");

		frameData[name] = {
			x: Number(tex.getAttribute("x")),
			y: Number(tex.getAttribute("y")),
			width: Number(tex.getAttribute("width")),
			height: Number(tex.getAttribute("height"))
		};

		const prefix = name.replace(/[0-9]+$/, "");

		if (!animations[prefix]) animations[prefix] = [];
		animations[prefix].push(name);
	}

	for (const anim in animations) {
		animations[anim].sort((a, b) => {
			const numA = parseInt(a.match(/\d+$/));
			const numB = parseInt(b.match(/\d+$/));
			return numA - numB;
		});
	}

	return new Frames(img, frameData, animations);
}