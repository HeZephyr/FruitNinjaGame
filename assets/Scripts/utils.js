module.exports = {
    GD: null, // req user obj
    //批量初始化对象池 
    batchInitObjPool(ptO, objArray) {
        for (let i = 0; i < objArray.length; i++) {
            let objInfo = objArray[i];
            this.initObjPool(ptO, objInfo);
        }
    },
    //初始化对象池
    initObjPool(ptO, objInfo) {
        let name = objInfo.name,
            poolName = name + 'Pool';
        ptO[poolName] = new cc.NodePool();
        let initPoolCount = objInfo.initPoolCount;
        for (let i = 0; i < initPoolCount; ++i) {
            let nodeO = cc.instantiate(objInfo.prefab);
            ptO[poolName].put(nodeO);
        }
    },
    //生成节点
    genNewNode(pool, prefab, nodeParent) {
        let newNode = null;
        //判断对象池中是否还有
        if (pool.size() > 0) {
            newNode = pool.get();
        } 
        else {
            //没有就生成。
            newNode = cc.instantiate(prefab);
        };
        nodeParent.addChild(newNode);
        return newNode;
    },
    //放回对象池
    backObjPool(ptO, poolName, nodeInfo) {
        ptO[poolName].put(nodeInfo);
    },
    //获取随机数
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
};