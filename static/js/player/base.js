import { acgameobject } from "/static/js/ac_game_object/base.js";

export class Player extends acgameobject {//继承游戏对象
    constructor(root, info) {
        super();
        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        this.vx = 0;//x轴方向速度
        this.vy = 0;//y轴方向速度

        this.direction = 1; //正方向定位1，反方向-1

        this.speedx = 400;//水平速度
        this.speedy = -1200; //跳起的初始速度

        this.gravity = 30;  //重力
        this.ctx = this.root.game_map.ctx;

        this.status = 3; //0:静止, 1:向前，2：向后 3：跳跃， 4 攻击，5被打，6：死亡
        this.pressed_keys = this.root.game_map.Controller.pressed_keys; //按键操控
        this.animations = new Map();//每一个状态的动作存到map（）里面
        this.frame_current_cnt = 0; //每过一帧记录一次，表示当前记录了多少帧
        this.hp = 100; //血量
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);//血槽
        this.$hp_div = this.$hp.find('div');

    }


    start() {

    }

    update_move() {
        this.vy += this.gravity //每一秒种加上一个g
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        let [a, b] = this.root.players;
        if (a !== this) [a, b] = [b, a];

        let r1 = {
            x1: a.x,
            y1: a.y,
            x2: a.x + a.width,
            y2: a.x + a.height,
        };
        let r2 = {
            x1: b.x,
            y1: b.y,
            x2: b.x + b.width,
            y2: b.y + b.height
        }
        // if (this.is_collision(r1, r2)) {//角色碰撞
        //     // this.x -= this.vx * this.timedelta / 1000;//阻止角色重合
        //     // this.y -= this.vy * this.timedelta / 1000;//后阻止角色重合
        //     a.x -= this.vx * this.timedelta / 1000 / 2;//碰撞后推动对方
        //     a.y -= this.vx * this.timedelta / 1000 / 2;
        //     b.x += this.vx * this.timedelta / 1000 / 2;
        //     b.y += this.vx * this.timedelta / 1000 / 2;

        //     if (this.status === 3) this.status = 0;

        // }
        if (this.y > 450) {//使其跳下后定住
            this.y = 450;
            this.vy = 0;

            if (this.status === 3) this.status = 0;//跳跃状态下落下后静止

        }
        if (this.x < 0) {//防止角色移动出界
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }


    }
    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');

        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        if (space) { //进攻状态
            this.status = 4;
            this.vx = 0;
            this.frame_current_cnt = 0;
        }
        else if (this.status === 0 || this.status === 1) {//如果处在静止状态或移动状态（向前或向后）则执行跳跃
            if (w) {//跳跃的各种情况
                if (d) {//向前跳
                    this.vx = this.speedx;
                } else if (a) {//向后跳
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;//当前处于跳跃状态
                this.frame_current_cnt = 0;
            } else if (d) {//如果处于向前移动
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {//如果处于后退状态
                this.vx = -this.speedx;
                this.status = 1;
            } else {//如果没有移动
                this.vx = 0;
                this.status = 0;
            }

        }
    }
    update_direction() {//判断角色初始方向
        if (this.status === 6) return;//死亡后不再改变方向
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;//在左方
            else me.direction = -1;
        }

    }
    is_attack() {//被攻击状态
        if (this.status === 6) return;//如果死亡后将不再被攻击
        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 20, 0);
        this.$hp_div.animate({//外层血量渐变
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);
        this.$hp.animate({//里层血量渐变
            width: this.$hp.parent().width() * this.hp / 100
        }, 800);
        // this.$hp.width(this.$hp.parent().width() * this.hp / 100); //改变血量

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0//死亡后速度清0
        }
        if (this.direction > 0) {//击退和击飞
            this.vx -= 100;
            this.vy -= 300;
        } else {
            this.vx += 100;
            this.vy -= 300;
        }
    }
    is_collision(r1, r2) {//判断两个矩形有没有交集
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }
    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 35) { //判断此时有没有完成出拳
            // this.status = 0; //出拳即使其状态为0
            let me = this, you = this.root.players[1 - this.id];
            let r1;//定义红色区域矩形坐标
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120, //左上角坐标
                    y1: me.y + 40, //左下角坐标
                    x2: me.x + 120 + 100,//右下角坐标
                    y2: me.y + 40 + 20,
                }
            } else {
                r1 = {
                    x1: me.x + me.width - 100 - 120, //左上角坐标
                    y1: me.y + 40, //左下角坐标
                    x2: me.x + me.width - 100 - 120 + 100,//右下角坐标
                    y2: me.y + 40 + 20,
                };
            }
            let r2 = {//蓝色区域矩形坐标
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if (this.is_collision(r1, r2)) {//如果两个矩形有交集
                you.is_attack();
            }
        }
    }
    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }
    render() {

        // this.ctx.fillStyle = 'blue';//渲染出一个角色大小的矩形
        // this.ctx.fillRect(this.x, this.y, this.width, this.height)
        // if (this.direction > 0) { //判断有没有达到攻击范围
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);
        // } else {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + this.width - 100 - 120, this.y + 40, 100, 20);

        // }


        // this.ctx.fillStyle = this.color;//渲染出一个矩形
        // this.ctx.fillRect(this.x, this.y, this.width, this.height)

        let status = this.status;
        if (this.status === 1 && this.direction * this.vx < 0) status = 2;//如果方向为负则处于后退状态 

        let obj = this.animations.get(status);

        if (obj && obj.loaded) { //如果已经被加载出来

            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt; //当前渲染到第几帧
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
            else {//翻转人物
                this.ctx.save();
                this.ctx.scale(-1, 1);//x* -1，y不变，关于y轴对称
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt; //当前渲染到第几帧
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);


                this.ctx.restore();
            }


        }
        if (status === 4 || status === 5 || status === 6) {//当播放完进攻动画后让人物静止，被击打也停止
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    this.frame_current_cnt--;//死亡后使其倒地不起
                } else {
                    this.status = 0;
                }

            }


        }
        this.frame_current_cnt++;
    }
}
