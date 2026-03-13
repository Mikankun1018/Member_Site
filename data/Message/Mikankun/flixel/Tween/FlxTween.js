import { FlxEase } from "./FlxEase.js";
// Tweenクラスの定義
export class FlxTween {
	constructor(target, properties, duration, options) {
		this.target = target;
		this.properties = properties;
		this.duration = duration || 1000;
		this.easingFunction = options.easingFunction || FlxEase.quadInOut;
		this.onUpdate = options.onUpdate || (() => {});
		this.onComplete = options.onComplete || (() => {});
		this.startTime = null;
		this.isRunning = false;
		this.startDelay = options.startDelay || 0;
	}

	start() {
		setTimeout(() => {
			this.startTime = performance.now();
			this.isRunning = true;
			requestAnimationFrame(this.animate.bind(this));
		}, this.startDelay);
	}

	animate(timestamp) {
		if (!this.isRunning) return;

		const elapsed = timestamp - this.startTime;
		const progress = Math.min(1, elapsed / this.duration);
		const easedProgress = this.easingFunction(progress);

		for (const prop in this.properties) {
			if (this.properties.hasOwnProperty(prop)) {
				const startValue = this.getPropertyValue(this.target, this.properties[prop].from, prop);
				const endValue = this.properties[prop].to;

				// 単位の取得
				const unit = endValue.toString().replace(/[\d.]+/, '').replace('-','');
				const numericStartValue = parseFloat(startValue);
				const numericEndValue = parseFloat(endValue);

				// プロパティの値を計算し、単位を付与
				const calculatedValue = numericStartValue + (numericEndValue - numericStartValue) * easedProgress;
				this.setPropertyValue(this.target, prop, calculatedValue + unit);
			}
		}

		this.onUpdate(easedProgress);

		if (progress < 1) requestAnimationFrame(this.animate.bind(this));
		else {
			this.isRunning = false;
			this.onComplete();
		}
	}

	getPropertyValue(target, property, propName) {
		// 変数の場合、propertyが関数であるかどうかを確認して、関数なら実行し、それ以外ならそのまま返す
		if (target instanceof HTMLElement) {
			if (typeof property === 'function') return property(target);
			else if (propName === 'transform') return window.getComputedStyle(target).getPropertyValue(propName); // transformプロパティの場合は現在の値を取得
			else return property;
		} else {
			if (typeof property === 'function') return property(target);
			else return property;
		}
	}

	setPropertyValue(target, propName, value) {
		if (target instanceof HTMLElement) target.style[propName] = value;
		else target[propName] = value;
	}
}

function temp() {
  const targetElement = document.getElementById('targetElement');
  const playbackRate = 1; // Adjust playback rate as needed
  
  const tween = new Tween(targetElement, {
	left: { from: '0px', to: '300px' },
	opacity: { from: 1, to: 0 },
	transform: { from: 'rotate(0deg) scale(1)', to: 'rotate(360deg) scale(2)' }
  }, 200, {
	easingFunction: FlxEase.quadInOut,
	onUpdate: progress => {
	  // Optional onUpdate logic
	},
	onComplete: () => {
	  console.log('Animation complete!');
	}
  });
  
  // アニメーション開始
  tween.start();
}