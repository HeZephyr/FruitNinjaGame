const utils = require('utils');
const INITPOOLCOUNT = 20;

let juiceColor = cc.Class({
    name: 'juiceColor',
    properties: {
        code: 0,
        color: cc.Color,
        opacity: 255
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        juiceColor: {
            default: [],
            type: juiceColor
        },
        juicePfb : cc.Prefab,
    },
    onLoad () {
        //创建对象池。
        let createPoolObj = {
            name: 'fruitJuice',
            prefab: this.juicePfb,
            initPoolCount: INITPOOLCOUNT
        };
        this.poolName = 'fruitJuicePool';
        utils.initObjPool(this, createPoolObj);
    },
    //创建果汁特效背景
    createJuiceBg(pos, colorType) {
        let currJuiceColor = this.juiceColor.filter(a => a.code == colorType)[0];
        let color = currJuiceColor.color;
        let rotation = utils.random(0, 359);
        let opacity = currJuiceColor.opacity;
        let juiceNode = utils.genNewNode(this[this.poolName], this.juicePfb, this.node);
        juiceNode.setPosition(pos);
        juiceNode.getComponent("FruitJuice").init(rotation, color, opacity);
    },
    //放回对象池。
    backNode(nodeInfo) {
        utils.backObjPool(this, this.poolName, nodeInfo)
    }
});
