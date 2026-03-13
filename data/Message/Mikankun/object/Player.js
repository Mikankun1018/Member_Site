import { Sprite } from "./Sprite.js";
import { justPressed, pressed, justReleased } from "../backend/Input.js";
import { FlxMath } from "../flixel/math/FlxMath.js";
import { GAME } from "../backend/Main.js";
import { FlxTween } from "../flixel/Tween/FlxTween.js";

export class Player extends Sprite {
	speed = 10;
	gravity = 2;
	maxSpeed = 300;
	friction = 0.982;
	jumpPower = 200;

	alreadyDash = false;
	inDash = false;
	inJump = true;

	onGround = false;
	touchWall = false;
	
	pressTime = 0;
	inMoving = false;
	camSeeY = 0;

	offsetY = 0;
	plDead = false;
	reSpawn = false;

	updateFunc = () => { };

	update(elapsed) {
		var camMove = elapsed * 150;
		if (this.pressTime > 1.1) {
			if (pressed("up"))
				this.camSeeY -= camMove;
			else if (pressed("down"))
				this.camSeeY += camMove;
		} else {
			if (this.camSeeY > 0)
				this.camSeeY = Math.max(0, this.camSeeY - camMove);
			else if (this.camSeeY < 0)
				this.camSeeY = Math.min(0, this.camSeeY + camMove);
		}
		this.camSeeY = FlxMath.bound(this.camSeeY, -150, 150);

		if (!this.plDead) {
			if (pressed("left") || pressed("right")) {
				this.velocity.x -= this.speed * (pressed("left") ? 1 : -1);
				this.flipX = pressed("left") ? true : false;
			}

			this.velocity.x = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocity.x));
			if (Math.abs(this.velocity.x) < 0.05) this.velocity.x = 0;

			this.updateFunc();

			this.inMoving = Math.abs(this.velocity.x) > 5;

			if (justPressed("jump") && this.onGround) {
				this.velocity.y = -this.jumpPower;
				this.inJump = true;
				this.onGround = false;
			}

			var ret = this.checkLetter(elapsed);
			if (!ret) {
				super.update(elapsed);
				return;
			}

			if (this.inJump) {
				this.camSeeY = 0;
				this.pressTime = 0;
			}

			if (this.inMoving || (!pressed("up") && !pressed("down")))
				this.pressTime = 0;

			this.velocity.y += this.gravity;

			super.update(elapsed);
			this.updateAnimation(elapsed);
		} else {
			this.velocity.y += (this.gravity * 2);

			super.update(elapsed);

			if (this.y - this.height > GAME.height) {
				const goStart = new FlxTween(this, { x: { from: this.x, to: 200 }, }, 400, {
					onUpdate: progress => {
						// null
					},
					onComplete: () => {
						this.x = -this.width;
						this.velocity.x = 100;
						this.y = GAME.height - 200;
						this.velocity.y = -100;
						this.reSpawn = true;
						this.inJump = true;
						this.flipX = false;
						this.play("jump");
					}
				});
				
				goStart.start();
			}

			// ﾃｯﾃﾚﾃｯﾃｯﾃｰ(復活音) 「フハハハハハハハ！」
			if (this.reSpawn && this.x > 0)
				this.plDead = this.reSpawn = false;
		}
	}

	checkLetter(elapsed) {
		if (this.x < -this.width / 3 && this.velocity.x < 0) {
			this.x = -this.width / 3 - 0.1;
			this.alreadyDash = this.inDash = false;
			this.velocity.x = 0;
			this.touchWall = true;
		}

		// 死の判定
		if (this.y + this.height / 2 > GAME.height) {
			this.plDead = true;
			this.play("death");
			this.alreadyDash = this.inDash = false;
			this.velocity.x = 0;
			this.velocity.y = -600;
			return false;
		}
		return true;
	}

	updateAnimation(elapsed) {
		if (this.inJump)
			this.play(this.velocity.y < 0 ? "jump" : "fall");
		else if (this.onGround) {
			if (this.inDash)
				return;
			if (this.touchWall)
				this.play("push");
			else if (this.inMoving)
				this.play(Math.abs(this.velocity.x) > this.maxSpeed * 0.6 ? "run" : "walk");
			else {
				if (pressed("up") || pressed("down")) {
					this.pressTime += elapsed;
					if (this.curAnim != (pressed("up") ? "up" : "crouch"))
						this.play(pressed("up") ? "up" : "crouch");
				} else {
					if (justReleased("up") || justReleased("down"))
						this.play(justReleased("up") ? "up" : "crouch", true, true, this.frameIndex);

					if (this.animFinished || ["walk", "push", "dash", "push"].indexOf(this.curAnim) >= 0)
						this.play("idle", true);
				}
			}
		}
	}
}