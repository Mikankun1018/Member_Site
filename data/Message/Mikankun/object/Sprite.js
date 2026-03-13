import { GAME } from "../backend/Main.js";

export class BasicSprite {
	x = 0;
	y = 0;

	width = 0;
	height = 0;

	scale = {
		x: 1,
		y: 1
	};

	velocity = {
		x: 0,
		y: 0
	};

	flipX = false;
	visible = true;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	center() {
		this.x = GAME.width / 2 - this.width / 2;
		this.y = GAME.height / 2 - this.height / 2;
	}

	update(dt) {
		this.x += this.velocity.x * dt;
		this.y += this.velocity.y * dt;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class Sprite extends BasicSprite {
	constructor(imagePath, x = 0, y = 0) {
		super(x, y);

		this.path = imagePath.split(".png")[0];

		this.image = new Image();
		this.image.src = `${this.path}.png`;

		this.frames = {};

		this.animations = {};
		this.currentAnim = null;

		this.frameIndex = 0;
		this.timer = 0;

		this.fps = 24;
		this.loop = true;
	}

	async loadAtlas(xmlPath) {
		if (xmlPath == null) xmlPath = this.path;

		const res = await fetch(xmlPath.endsWith(".xml") ? xmlPath : `${xmlPath}.xml`);
		const text = await res.text();

		const xml = new DOMParser().parseFromString(text, "text/xml");
		const textures = xml.getElementsByTagName("SubTexture");

		var pattern = [];
		var lastName = "";

		var maxW = 0;
		var maxH = 0;

		for (const tex of textures) {
			const name = tex.getAttribute("name");
			const subName = name.slice(0,-4);
			if (lastName !== subName) {
				if (pattern.length > 0 && lastName !== "")
					this.frames[lastName] = {
						frames: pattern,
						width: maxW,
						height: maxH
					};

				pattern = [];
				lastName = subName;

				maxW = 0;
				maxH = 0;
			}

			const get = s => Number(tex.getAttribute(s) || 0);

			const frame = {
				frameName: name,
				x: get("x"),
				y: get("y"),
				width: get("width"),
				height: get("height"),
				frameX: get("frameX"),
				frameY: get("frameY"),
				frameWidth: get("frameWidth"),
				frameHeight: get("frameHeight"),
			};

			pattern.push(frame);

			maxW = Math.max(maxW, frame.width);
			maxH = Math.max(maxH, frame.height);
		}

		if (pattern.length > 0 && lastName !== "")
			this.frames[lastName] = {
				frames: pattern,
				width: maxW,
				height: maxH
			};
	}

	addByPrefix(animName, prefix, fps = 24, loop = true) {
		const anim = {};

		for (const frameName in this.frames)
			if (frameName.startsWith(prefix))
				anim[frameName] = this.frames[frameName];
		
		const sorted = Object.keys(anim).sort((a, b) => {
			const numA = parseInt(a.match(/\d+$/)?.[0] ?? 0);
			const numB = parseInt(b.match(/\d+$/)?.[0] ?? 0);

			return numA - numB;
		});

		let frames = [];
		let maxW = 0;
		let maxH = 0;

		for (const name of sorted) {

			const data = anim[name];

			frames.push(...data.frames);

			maxW = Math.max(maxW, data.width);
			maxH = Math.max(maxH, data.height);
		}

		this.animations[animName] = {
			frames: frames,
			width: maxW,
			height: maxH,
			fps: fps,
			loop: loop
		};
	}

	curAnim = "";
	reverse = false;
	animFinished = false;
	play(name, force = false, reverse = false, frame = 0) {
		const anim = this.animations[name];
		if (!anim) {
			console.warn("Animation not found:", name);
			return;
		}

		if (!force && this.curAnim === name && !this.animFinished)
			return;

		this.curAnim = name;
		this.reverse = reverse;

		this.currentAnim = anim;

		this.width = anim.width;
		this.height = anim.height;

		this.frameIndex = frame;
		this.timer = 0;

		this.animFinished = false;
		this.updateAnim();
	}

	stop() {
		this.currentAnim = null;
	}

	update(dt) {
		super.update(dt);

		if (!this.currentAnim)
			return;

		this.timer += dt;
		if (this.timer >= 1 / this.currentAnim.fps) {
			this.timer = 0;

			this.updateAnim();
		}
	}

	updateAnim() {
		if (this.reverse) this.frameIndex--;
		else this.frameIndex++;

		if (!this.reverse && this.frameIndex >= this.currentAnim.frames.length) {
			if (this.currentAnim.loop)
				this.frameIndex = 0;
			else {
				this.frameIndex = this.currentAnim.frames.length - 1;
				this.animFinished = true;
			}
		} else if (this.reverse && this.frameIndex < 0) {
			if (this.currentAnim.loop)
				this.frameIndex = this.currentAnim.frames.length - 1;
			else {
				this.frameIndex = 0;
				this.animFinished = true;
			}
		}
	}

	draw(ctx,/*camera = {x:0,y:0}*/) {
		if (!this.visible || !this.currentAnim)
			return;

		const frame = this.currentAnim.frames[this.frameIndex];


		ctx.save();
		if (this.flipX) {
			ctx.scale(-1, 1);
			ctx.drawImage(
				this.image,
				frame.x,
				frame.y,
				frame.width,
				frame.height,
				-(this.x + this.width * this.scale.x),
				this.y,
				frame.width * this.scale.x,
				frame.height * this.scale.y
			);
		} else {
			ctx.drawImage(
				this.image,
				frame.x,
				frame.y,
				frame.width,
				frame.height,
				this.x,
				this.y,
				frame.width * this.scale.x,
				frame.height * this.scale.y
			);
		}

		ctx.restore();
	}
}