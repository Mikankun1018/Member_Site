import { Player } from "./Player.js";

export async function createCharacter(charName) {
	var char = null;

	if (charName == "boyfriend") {
		char = new Player("images/Mikankun/boyfriend-by-nikog266");
		await char.loadAtlas();
		var fps = 12;
		char.addByPrefix("idle", "idle", fps, true);
		char.addByPrefix("up", "up", fps, false);
		char.addByPrefix("crouch", "crouch", fps, false);
		char.addByPrefix("bored", "bored", fps, false);
		char.addByPrefix("walk", "walk", fps, true);
		char.addByPrefix("run", "run", fps, true);
		char.addByPrefix("dash", "run", 24, true);
		char.addByPrefix("roll", "roll", fps, true);
		char.addByPrefix("ball", "ball", fps, false);
		char.addByPrefix("hurt", "hurt", fps, false);
		char.addByPrefix("gasp", "gasp", fps, false);
		char.addByPrefix("death", "death", fps, false);
		char.addByPrefix("drown", "drown", fps, false);
		char.addByPrefix("continue", "continue", fps, false);
		char.addByPrefix("hang roll", "hang roll", fps, false);
		char.addByPrefix("spin", "spin", fps, false);
		char.addByPrefix("jump", "spring 1", fps, false);
		char.addByPrefix("cdspring", "cdspring", fps, false);
		char.addByPrefix("fall", "fall", fps, false);
		char.addByPrefix("skid", "skid", fps, false);
		char.addByPrefix("balance", "balance", fps, false);
		char.addByPrefix("push", "push", 6, false);
		char.addByPrefix("ending(small)", "ending(small)", fps, false);
		char.addByPrefix("ending(big)", "ending(big)", fps, false);
	
		char.play("jump", 12);
		char.offsetY = 4;

		char.updateFunc = () => {
			if (char.onGround)
				char.velocity.x *= char.friction;
		}
	} else if (charName == "blaze") {
		char = new Player("images/Mikankun/boyfriend-by-nikog266");
		await char.loadAtlas();
		var fps = 12;
		char.addByPrefix("idle", "idle", fps, true);
		char.addByPrefix("up", "up", fps, false);
		char.addByPrefix("crouch", "crouch", fps, false);
		char.addByPrefix("bored", "bored", fps, false);
		char.addByPrefix("walk", "walk", fps, true);
		char.addByPrefix("run", "run", fps, true);
		char.addByPrefix("dash", "run", 24, true);
		char.addByPrefix("roll", "roll", fps, true);
		char.addByPrefix("ball", "ball", fps, false);
		char.addByPrefix("hurt", "hurt", fps, false);
		char.addByPrefix("gasp", "gasp", fps, false);
		char.addByPrefix("death", "death", fps, false);
		char.addByPrefix("drown", "drown", fps, false);
		char.addByPrefix("continue", "continue", fps, false);
		char.addByPrefix("hang roll", "hang roll", fps, false);
		char.addByPrefix("spin", "spin", fps, false);
		char.addByPrefix("jump", "spring 1", fps, false);
		char.addByPrefix("cdspring", "cdspring", fps, false);
		char.addByPrefix("fall", "fall", fps, false);
		char.addByPrefix("skid", "skid", fps, false);
		char.addByPrefix("balance", "balance", fps, false);
		char.addByPrefix("push", "push", 6, false);
		char.addByPrefix("ending(small)", "ending(small)", fps, false);
		char.addByPrefix("ending(big)", "ending(big)", fps, false);
	
		char.play("jump", 12);
		char.offsetY = 4;

		char.updateFunc = () => {
			char.onGround = true;
		}
	}

	return char;
}

function setAnim(char, animations) {
	for (anim in animations) // ["アニメ名", "アニメーション名(ファイル内の)", ループ, fps];
		char.addByPrefix(anim[0], anim[1] ?? anim[0], anim[3] ?? 24, anim[2] ?? false);
}