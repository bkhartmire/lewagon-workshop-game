import {startGame, vdp} from "../lib/vdp-lib";
import {clamp, getMapBlock, setMapBlock} from './utils';


function collidesAtPosition(left, top) {
		return getMapBlock('level1', Math.floor(left / 16), Math.floor(top / 16)) === 38;
}


function *main() {

	const mario = {
		left: 0,
		top: 0,
		width: 16,
		height: 16,
		get right() {return this.left + this.width;},
		get bottom() {return this.top + this.height;},
		horizontalVelocity: 0,
		verticalVelocity: 0,
	}

	const input = vdp.input;

	vdp.configBackdropColor('#59f');


	let counter = 0, angle = 0;
	while (true) {
		const lineTransform = new vdp.LineTransformationArray();
		for (let line =0; line < 256; line++) {
			const x = Math.sin((line + counter) / 20) * 10;
			lineTransform.translateLine(line, [x, 0])

		// 	lineTransform.rotateLine(line, angle);
		// 	// lineTransform.translateLine(line, [0, ])
		// 	const scale = 100 / (line + 50);
		// 	lineTransform.scaleLine(line, [scale, scale])
		}
		vdp.drawBackgroundTilemap('level1', {scrollX: 200, lineTransform });
		//
		// if (input.isDown(input.Key.Left)) {
		// 	angle += 0.01;
		// }
		//
		// if (input.isDown(input.Key.Right)) {
		// 	angle -= 0.01;
		// }


		vdp.drawObject(vdp.sprite('mario').tile(6), mario.left, mario.top);

		counter += 1;
		const colors = [
			'#f00', '#f80', '#ff0', '#f80', '#f00'
		];

		const paletteData = vdp.readPalette('level1');
		paletteData.array[7] = vdp.color.make(
			colors[Math.floor(counter / 8) % colors.length]
		);
		vdp.writePalette('level1', paletteData);

		const colorArray = new vdp.LineColorArray(0,0);
		for(let line = 0; line < colorArray.length; line++) {
			colorArray.setLine(line, vdp.color.make(255, line, line));
		}
		vdp.configColorSwap([colorArray])

		mario.left += mario.horizontalVelocity;
		mario.top += mario.verticalVelocity;

		mario.verticalVelocity += 0.2;
		while (collidesAtPosition(mario.left, mario.bottom)) {
			mario.verticalVelocity = 0;
			mario.top -= 1;
			//small decimal values was causing a vibrating affect
			mario.top = Math.floor(mario.top);
			mario.left = Math.floor(mario.left);
		}
		const blockId = getMapBlock('level1', Math.floor(mario.left / 16), Math.floor(mario.bottom / 16));


		if (input.hasToggledDown(input.Key.Up)) {
			mario.verticalVelocity -= 5;
		}
		if (input.isDown(input.Key.Down)) {
			mario.top += 1;
		}
		if (input.isDown(input.Key.Left)) {
			mario.left -= 1;
		}
		if (input.isDown(input.Key.Right)) {
			mario.left += 1;
		}

		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
