"use strict"

const router = require('koa-router')();
const models = require('../models');
const logger = require('../libs/logger');

/**
 * 插入一条记录
 */
router.get('/insert',function *(){
    yield models.order_record.create({
        num: '11983',
        name: '刘琦',
        tel: '18211654327',
        amount: 34.4
    });
    this.body = {
        err: "",
        out: "ok"
    };
});

/**
 * 更新一条记录
 */
router.get('/update',function *(){
    yield models.order_record.update({tel: '13787263541'},{where:{name: '刘琦'}});
    this.body = {
        err: "",
        out: "ok"
    };
});

/**
 * 批量插入多条记录
 */
router.get('/insertmore',function *(){
    let datas = [
        {
            num: '11985',
            name: 'Melia',
            tel: '15827654312',
            amount: 87.9
        },
        {
            num: '11986',
            name: '刘泽',
            tel: '18812637342',
            amount: 77
        },
        {
            num: '11987',
            name: '黄泽',
            tel: '15898276232',
            amount: 25
        },
    ];
    yield models.order_record.bulkCreate(datas);
    this.body = {
        err: "",
        out: "ok"
    };
});

/**
 * 查询所有记录
 */
router.get('/findall',function *(){
    this.body = yield models.order_record.findAll();
});

/**
 * 查询结果个数
 */
router.get('/findcount',function *(){
    this.body = yield models.order_record.count();
});


/**
 * 过滤查询到的字段,并组合多种查询条件
 */
router.get('/findfilter',function *(){
    this.body = yield models.order_record.findAll({
        attributes: ['name','tel'],
        where: { // 查询条件：姓刘的或者金额大于50
            $or: [
                {name: { $like: '%刘%' }},
                {amount: { $gt: 50 }}
            ]
        }
    });
});

module.exports = router;