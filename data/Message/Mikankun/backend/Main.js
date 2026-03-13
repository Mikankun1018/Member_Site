import { pressed } from "./Input.js";

export const GAME = {
	width: 960,
	height: 720
}

export function checkCollision(player, objects) {
	if (player.plDead) return;
	player.onGround = false;
	player.touchWall = false;

	var offsetY = player.offsetY;
	var plBottom = player.y + player.height - offsetY;
	var plTop = player.y - offsetY;
	var plLW = player.width / 3;
	var plRW = player.width / 1.5;
	var plLeft = player.x + plLW;
	var plRight = player.x + plRW;
	var idkName = 6;

	for (const ground of objects) {
		var groundTop = ground.y;
		var groundBottom = ground.y + ground.height;
		var groundLeft = ground.x;
		var groundRight = ground.x + ground.width;

		// 地面に乗っているかの判定
		if (player.velocity.y > 0 && (plRight > groundLeft && plLeft < groundRight && Math.abs(plBottom - groundTop) < idkName * Math.max(1, player.velocity.y / 200)))
		{
			player.y = groundTop - player.height + offsetY;
			player.velocity.y = 0;
			player.onGround = true;
			player.inJump = false;
		}

		// 壁の判定
		if (ground.height > 30 && plBottom > groundTop + idkName && plTop < groundBottom - idkName)
		{
			// 右側に壁があるかの判定
			if ((player.velocity.x > 0 || pressed("right")) && plRight > groundLeft && plLeft < groundLeft)
			{
				player.alreadyDash = player.inDash = false;
				player.velocity.x = 0;
						
				player.x = groundLeft - plRW + 0.1;

				player.touchWall = true;
			}

			// 左側に壁があるかの判定
			if ((player.velocity.x < 0 || pressed("left")) && plLeft < groundRight && plRight > groundRight)
			{
				player.alreadyDash = player.inDash = false;
				player.velocity.x = 0;
				player.x = groundRight - plLW - 0.1;
				player.touchWall = true;
			}
		}
	}
}