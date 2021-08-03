let lifeG = cc.Class({
    name: 'lifeG',
    properties: {
        index: 0,
        lifeConsume : cc.Node,
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        knife : cc.Node,
        //得分标签
        scoreLabel : cc.Label,
        lifeG: {
            default: [],
            type: lifeG
        },
        fruitGroup : require('FruitGroup'),
        gameOverMask : cc.Node,
        //最佳得分标签。
        bestScoreLabel : cc.Label,
        buttonClip : cc.AudioClip,
    },
    onLoad() {
        //获取与其相关联的碰撞管理器
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.debugDrawFlags = 0;
        this.knifeMotionS = this.knife.getComponent(cc.MotionStreak);
    },
    start() {
        this.knifeMove();
        this.init();
    },
    init() {
        this.gameOver = false;
        this.score = 0;
        this.bestScore = 0;
        let max = cc.sys.localStorage.getItem("Best score");
        //判断本地最佳分数是否存在
        if(max){
            this.bestScore = max;
            this.bestScoreLabel.string = "最佳分数 : " + this.bestScore;
        }
        this.life = 0;
        //将其都变为不可见。
        this.lifeG.forEach((a) => {
            a.lifeConsume.active = false;
        });
        //更新界面。
        this.upDateUi();
        //创建水果。
        this.fruitGroup.createFruitList();
    },
    knifeMove() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.startEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.endEvent, this);
    },
    startEvent(event) {
        let pos = this.node.convertToNodeSpaceAR(new cc.Vec2(event.getLocation()));
        this.knife.setPosition(pos);
        this.knife.group = 'knife';
        this.knifeMotionS.reset();
    },
    moveEvent(event) {
        let pos = this.node.convertToNodeSpaceAR(new cc.Vec2(event.getLocation()));
        this.knife.setPosition(pos);
    },
    endEvent(event) {
        this.knife.group = 'default';
    },
    updateScore(type, score) {
        if (this.gameOver) return;
        if (type) {
            this.score += score;
        } else {
            //分数不够减，那就直接减一条命
            if (this.score == 0) {
                this.lifeConsume();
            }
            //丢掉一个减两倍的分数。
            this.score = this.score < (score * 2) ? 0 : this.score - (score * 2);
        };
        this.upDateUi();
    },
    //更新生命值。
    lifeConsume() {
        this.life++;
        if (this.life == 3) this.gameOverHandle();
    },
    //更新分数。
    upDateUi() {
        this.scoreLabel.string = "分数 : " + this.score;
        //将已经损失的生命值的图片给激活显示。
        for (let i = 0; i < this.life; i++) {
            this.lifeG[i].lifeConsume.active = true;
        }
    },
    gameOverHandle() {
        this.gameOver = true;
        this.knife.group = 'default';
        //更新最佳成绩。
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreLabel.string = '最佳分数 : ' + this.bestScore;
            // this.updateBestScore();
            //保存到本地。
            cc.sys.localStorage.setItem("Best score" , this.bestScore);
        };
        //调用只运行一次的回调函数。
        this.scheduleOnce(() => {
            this.showTheGameOverMask(true);
        }, .5, this);
    },
    returnMenu() {
        cc.audioEngine.play(this.buttonClip, false, 1);
        cc.director.loadScene('Menu');
    },
    restartGame() {
        cc.audioEngine.play(this.buttonClip, false, 1);
        this.showTheGameOverMask(false);
        this.init();
    },
    showTheGameOverMask(bool) {
        if (bool) {
            this.gameOverMask.active = true;
            this.gameOverMask.opacity = 1;
            this.gameOverMask.scale = .95;
            cc.tween(this.gameOverMask).to(.4, { scale: 1, opacity: 255 }).start();
        } else {
            cc.tween(this.gameOverMask).to(.3, { opacity: 0 }).call(() => {
                this.gameOverMask.active = false;
            }).start();
        }
    },   
});