const utils = require('utils');
cc.Class({
    extends : cc.Component,
    properties : {
        //完整水果块。
        comFruit : cc.Node,
        //被切割的水果。
        splitAni :  cc.Node,
        //类型
        type : 'fruit',
        forceHorzMin : 0,
        forceHorzMax : 1000,
        forceMin : 30000,
        forceMax : 35000,
        colorType : 1,
        //音效
        cutFruitAudio : cc.AudioClip,
        cutBombAudio : cc.AudioClip, 
    },
    onLoad() {
        this.poolName = '';
        //获取游戏脚本组件,使用其上的函数。
        this.gameObj = cc.find('/Canvas/gameContainer').getComponent("Game");
        this.parent = this.node.parent.getComponent('FruitGroup');
        this.fruitJuiceGroup = cc.find('/Canvas/gameContainer/fruitJuice').getComponent("JuiceGroup");
        //如果是水果，就获取其上的动画组件。
        if (this.type == 'fruit') { 
            this.ani = this.splitAni.getComponent('cc.Animation');
        }
    },
    init(poolName, score) {
        this.poolName = poolName;
        this.score = score;
        this.isCut = false;
        //判断是否是水果类，更改其激活状态。
        if (this.type == 'fruit') {
            this.comFruit.active = true;
            this.splitAni.active = false;
            this.recoveryAniFirstFps();
        };
        let fruitNodeRigidBody = this.node.getComponent(cc.RigidBody);
        let forceY = Math.floor(utils.random(this.forceMin, this.forceMax)),
            forceX = Math.floor(utils.random(this.forceHorzMin, this.forceHorzMax));
        //刚体运动。
        fruitNodeRigidBody.angularVelocity = utils.random(-1, 1) > 0 ? 100 : -100; //角速度 默认100
        fruitNodeRigidBody.applyForceToCenter(cc.v2(this.node.x > 0 ? -forceX : forceX, forceY), true);
    },
    onCollisionEnter(other, self) {
        //检测是否与knife发生碰撞。
        if (other.tag == 50) {
            if (!this.isCut) {
                if (this.type == 'fruit') {
                    //创建果汁特效。
                    this.fruitJuiceGroup.createJuiceBg(this.node.getPosition(), this.colorType);
                    //播放动画特效。
                    this.playSplitAni();
                    //播放切水果音效
                    cc.audioEngine.play(this.cutFruitAudio, false, 1);
                    this.gameObj.updateScore(1, this.score);
                } else {
                    // 炸弹
                    this.parent.cutBombRemoveAllChildren()
                    //播放切炸弹音效
                    cc.audioEngine.play(this.cutBombAudio, false, 1);
                }
            };
            this.isCut = true;
        }
        //判断是否和地板发生碰撞。
        if (other.tag == 100) {
            this.backThisNode();
            this.parent.checkRemain()
        }
    },
    playSplitAni() {
        this.comFruit.active = false;
        this.splitAni.active = true;
        this.ani.play();
    },
    recoveryAniFirstFps() { //恢复动画的初始帧位置
        let aniName = this.ani.getClips()[0].name;
        let state = this.ani.getAnimationState(aniName);
        let curves = state.curves;
        let info = state.getWrappedInfo(0.01);
        for (let i = 0, len = curves.length; i < len; i++) {
            let curve = curves[i];
            curve.sample(info.time, info.ratio, this);
        }
    },
    backThisNode(isBombBack) {
        if (!isBombBack && this.type == 'fruit' && !this.isCut) {
            this.gameObj.updateScore(0, this.score);
        };
        //放回对象池。
        utils.backObjPool(this.parent, this.poolName, this.node);
    }
});