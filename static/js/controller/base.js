export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressed_keys = new Set();
        this.start();

    }


    start() {
        let outer = this;//使用outer表示上一个类
        this.$canvas.keydown(function (e) {//存入键盘输入
            outer.pressed_keys.add(e.key);

        });
        this.$canvas.keyup(function (e) {//当按键弹起时删掉
            outer.pressed_keys.delete(e.key);
        })
    }
}