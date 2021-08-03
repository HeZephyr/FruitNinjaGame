cc.Class({
    extends: cc.Component,

    properties: {
        buttonClip : cc.AudioClip,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    returnMenu(){
        cc.audioEngine.play(this.buttonClip, false, 1);
        cc.director.loadScene("Menu");
    }
    // update (dt) {},
});
