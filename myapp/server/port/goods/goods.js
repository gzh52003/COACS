const express = require('express');
const router  = express.Router();
const mongo   = require('../../utils/mongo');
const {formatData} = require('../../utils/tools')

/* 1.分页查询商品数据 */
router.get('/',async (req,res) =>{
    let {page=1,size=10,sort='addTime',goodName} = req.query;
    const skip = (page-1)*size;
    const limit = size*1;
    sort = sort.split(',');

    let sql;
    if(goodName){
        sql = {
            "goodName":goodName
        }
    }else{
        sql = {}
    }

    try{
        const result = await mongo.find('goods',sql,{skip,limit,sort});
        res.send(formatData({data:result}));
    }catch(err){
        res.send(formatData({code:0}))
    }
});

/* 2.新增商品信息 */
router.post('/',async(req,res)=>{
    let {gid,goodName,goodPic,salePrice,oldPrice,storageNum,supplierName,addTime} = req.body;
    /* 时间处理 */
    addTime = addTime.slice(0,10);
    try{
        let result = await mongo.insert('goods',{gid,goodName,goodPic,salePrice,oldPrice,storageNum,supplierName,addTime})
        res.send(formatData())
    }catch(err){
        res.send(formatData({code:0}))
    }

})

router.delete('/:id',async (req,res)=>{
    const {id} = req.params;
    try{
        const result = await mongo.remove('goods',{_id:id})
        res.send('success')
    }catch(err){
        res.send('fail');
    }
})

module.exports = router;