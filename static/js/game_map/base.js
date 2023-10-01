import { acgameobject } from '/static/js/ac_game_object/base.js';
import { Controller } from '/static/js/controller/base.js';
class gamemap extends acgameobject {//gamemap继承acgameobject
    constructor(root) {
        super();
        this.root = root;
        this.$canvas = $('<canvas tabindex=0 width="1280" height="720"></canvas>');//tabindex=0使canvas聚焦
        this.ctx = this.$canvas[0].getContext('2d');//取出canvas对象，上面的canvas是一个数组
        this.root.$kof.append(this.$canvas);//将canvas加入到root（kof）里面

        this.Controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class = "kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));
        this.time_left = 60000;//初始时间60秒
        this.$timer = this.root.$kof.find('.kof-head>.kof-head-timer');



    }

    start() {

    }

    update() {//每一帧执行一次清空地图
        this.$timer.text(parseInt(this.time_left / 1000));
        this.time_left -= this.timedelta;
        if (this.time_left < 0) {
            this.time_left = 0;
            let [a, b] = this.root.players;
            if (a.status !== 6 && b.status !== 6) {//平局
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        };



        this.render();
    }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);//清空指定矩形区域
        // console.log(this.ctx.canvas.width)//获取宽高
        // console.log(this.$canvas.width())//同理
        // this.ctx.fillStyle = 'black'; //将背景渲染成黑色
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height())

    }


}

export {
    gamemap
}