import { Player } from "/static/js/player/base.js";
import { GIF } from "/static/js/utils/git.js";

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }
    init_animations() {//初始化动画
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];//在移动时加上y轴偏移量22,跳跃落下时也加上偏移量
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,//将gif存到gif
                frame_cnt: 0,//当前动画的总帧数
                frame_rate: 10,//每10帧刷新一次
                offset_y: offsets[i], //竖直方向偏移量
                loaded: false, //判断有没有加载完成
                scale: 2, //放大两倍
            });
            gif.onload = function () { //当图片加载完之后更新一下
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true; //表示已经被加载出来
                if (i === 3) {
                    obj.frame_rate = 10;
                }
            }

        }
    }
}