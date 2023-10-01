import { gamemap } from "/static/js/game_map/base.js";
import { Kyo } from "/static/js/player/kyo.js";


class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        // console.log(this.$kof)
        this.game_map = new gamemap(this);
        this.players = [//角色信息
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 920,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
            }),
        ];

    }
}

export {
    KOF
}