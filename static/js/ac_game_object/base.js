let AC_GAME_OBJECT = [];
class acgameobject {
    constructor() {
        AC_GAME_OBJECT.push(this);//保存每一个acgameobject
        this.timedelta = 0; //距离上一帧的时间间隔
        this.has_call_start = false; //用来表示当前对象有没有执行过start这个函数（最开始没有执行过）
    }
    start() { //初始执行一次

    }
    update() { //每一帧执行一次（除了第一帧以外）

    }

    destroy() { //删除当前对象
        for (let i in AC_GAME_OBJECT) {
            if (AC_GAME_OBJECT[i] === this) {
                AC_GAME_OBJECT.splice(i, i);//删除元素
                break;
            }
        }
    }
}
let last_timestamp; //记录一下是上一帧在什么时候执行过

let AC_GAME_OBJECT_FRAME = (timestamp) => {//表示当前这个函数执行的是什么时刻
    for (let obj of AC_GAME_OBJECT) {
        if (!obj.has_call_start) {//如果当前元素没有执行过start函数，就执行start函数
            obj.start();
            obj.has_call_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp//更新timedelta函数，使其等于当前执行时刻减去上一帧执行时刻
            obj.update();//执行update函数
        }
    }
    last_timestamp = timestamp//更新last_timestamp
    requestAnimationFrame(AC_GAME_OBJECT_FRAME);//使其每一帧执行一次
}
requestAnimationFrame(AC_GAME_OBJECT_FRAME);

export { acgameobject }