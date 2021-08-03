 cc.Class({
    extends: cc.Component,

    properties: {
        juiceSprite: cc.Node,
    },

    onLoad() {
        this.parentObj = this.node.parent.getComponent('JuiceGroup');
    },
    init(rotation, color, opacity) {
        this.node.angle = rotation;
        this.juiceSprite.color = color;
        this.juiceSprite.opacity = opacity;
        //渐隐显示动画，并将其对象回收。
        cc.tween(this.juiceSprite).to(1.5, {opacity: 0}).call(() => {
            this.parentObj.backNode(this.node, this.colorType)
        }).start()
    }
});
