const utils = require('utils')

let fruitG = cc.Class({
    name: 'fruitG',
    properties: {
        name: '',
        initPoolCount: 10,
        score: 0,
        type: 'fruit',
        prefab: cc.Prefab,
    }
});
cc.Class({
    extends : cc.Component,
    properties: {
        maxLength : 5,
        flashNode : cc.Node,
        fruitG : {
            default : [],
            type : fruitG,
        },
        throwBomb : cc.AudioClip,
    },
    onLoad() {
        this.gameObj = this.node.parent.getComponent('Game');
        //得到无炸弹数组。
        this.noBombArr = this.fruitG.filter(a => a.type == 'fruit');
        utils.batchInitObjPool(this, this.fruitG);
    },
    //创建水果。
    createFruitList() {
        let totalFr = this.fruitG;
        //获取水果的随机数。
        let randomLength = Math.floor(utils.random(1, this.maxLength + 0.4));
        for (let i = 0; i < randomLength; i++) {
            //ran为水果的随机种类，fruit表示水果，poolName则为水果对应的对象池。
            let ran = 0,fruit, poolName;
            ran = Math.floor(Math.floor(utils.random(0, totalFr.length - 0.1)));
            fruit = totalFr[ran];
            poolName = fruit.name + 'Pool';
            //生成对象。
            let fruitNode = utils.genNewNode(this[poolName], fruit.prefab, this.node);
            //设置其随机出现位置。
            fruitNode.setPosition(cc.v2(utils.random(-this.node.width / 2 + 
                fruitNode.width / 2, this.node.width / 2 - fruitNode.width / 2),
                    -(this.node.height / 2 - fruitNode.height / 2)));
            //初始化水果状态。
            fruitNode.getComponent("Fruit").init(poolName, fruit.score);
            //判断是不是炸弹，如果是炸弹，我们就将其设置为无炸弹的数组，确保只出现一个炸弹。
            if (fruit.type == 'bomb') {
                //是炸弹，播放炸弹扔上来的音效。
                cc.audioEngine.play(this.throwBomb, false, 1);
                totalFr = this.noBombArr;
            };
        };
    },
    //检查是否有剩余的水果。
    checkRemain() {
        //判断游戏是否结束。
        if (this.gameObj.gameOver) return;
        let childrenLength = this.node.children.length;
        if (childrenLength == 0) {
            //如果没有了，就继续生成。
            this.scheduleOnce(() => {
                this.createFruitList()
            }, .5, this)
        }
    },
    // 切到炸弹 
    cutBombRemoveAllChildren() {
        //播放炸弹闪烁特效。
        this.flashScreen();
        //获取剩下的水果。
        let childObjArr = this.node.children.map((a) => {
            return a.getComponent("Fruit")
        });
        //将剩下的水果回收。
        for (let i = 0; i < childObjArr.length; i++) {
            childObjArr[i].backThisNode(true);
        };
        //更新游戏界面和生命情况。
        this.gameObj.lifeConsume();
        this.gameObj.upDateUi();
        //如果游戏没有结束，继续创建。
        if (!this.gameObj.gameOver) {
            this.scheduleOnce(() => {
                this.createFruitList()
            }, 0.5, this)
        }
    },
    //闪屏特效。
    flashScreen() {
        this.flashNode.active = true;
        this.flashNode.opacity = 230;
        //使用渐变效果实现。
        cc.tween(this.flashNode).to(.8, { opacity: 0 }).call(() => {
            this.flashNode.active = false;
        }).start()
    }
});