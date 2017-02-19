const router = require('koa-router')();

router.get('/',function *(){
    console.log("hehe");
    this.body = "Welcom !";
});

module.exports = router;