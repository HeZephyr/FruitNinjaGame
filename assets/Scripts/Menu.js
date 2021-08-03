cc.Class({
    extends: cc.Component,
    properties: {
        knife : cc.Node,
        btnBeginCir : cc.Node,
        btnQuitCir : cc.Node,
        btnBeginfR : cc.Node,
        btnQuitfR : cc.Node,
        buttonClip : cc.AudioClip,
    },
    onLoad() {
        //预加载场景
        cc.director.preloadScene('Game');
        //获取knife上的拖尾特效组件。
        this.knifeMotionS = this.knife.getComponent(cc.MotionStreak);
    },
    start() {
        this.knifeMove();
        this.circleRotate();
    },
    knifeMove() {
        //事件响应。
        this.node.on(cc.Node.EventType.TOUCH_START, this.startEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveEvent, this);
    },
    //开始事件响应，即按住鼠标，这个时候设置位置但不开启拖尾特效。
    startEvent(e) {
        let pos = this.node.convertToNodeSpaceAR(new cc.Vec2(e.getLocation()));
        this.knife.setPosition(pos);
        this.knifeMotionS.reset();
    },
    //移动事件响应。
    moveEvent(e) {
        let pos = this.node.convertToNodeSpaceAR(new cc.Vec2(e.getLocation()));
        this.knife.setPosition(pos);
    },
    circleRotate() {
        let createRote = (angle) => {
            return cc.tween().by(7, { angle: angle }).repeatForever();
        }
        //让这四个组件旋转
        cc.tween(this.btnBeginCir).then(createRote(360)).start();
        cc.tween(this.btnQuitCir).then(createRote(360)).start();
        cc.tween(this.btnBeginfR).then(createRote(-360)).start();
        cc.tween(this.btnQuitfR).then(createRote(-360)).start();
    },
    backList() {
        cc.audioEngine.play(this.buttonClip, false, 1);
        cc.director.loadScene('Detail');
    },
    gameStart() {
        cc.audioEngine.stop(this.audio);
        cc.audioEngine.play(this.buttonClip, false, 1);
        cc.director.loadScene('Game');
    }
});
