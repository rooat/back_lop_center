let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
let pagesize = 30

exports.index =async function (req, res) {
    let phenixId = req.query.phenixId;
   
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.db.rounds_management(page,pagesize,phenixId)
    // console.log(list.recordset)
    res.render('round', {
            block_number:1,
            roundlist: list.recordset,
            phenixId : phenixId,
            page: showPage.show(url, list.output.total, pagesize, page),
        });
};
exports.add_startNextRound = async function(req , res){
    let num = req.body.num;
    let level = req.body.level
    let automatic = req.body.automatic;
    if(!num || !level || !automatic){
        return res.send({"resp":"请输入正确的值"})
    }
    let ress = await config.db.Mine_recruitment(num,level,automatic)
    return res.send({"resp":ress.output.outmsg})
}
exports.overRound = async function(req,res){
    let nums = req.body.nums;
    let level = req.body.level;
    if(!nums || !level){
        return res.send({"resp":"请输入正确的值"})
    }
    let rss = await config.db.settle_account(nums,level)
    return res.send({"resp":rss.output.outmsg})
}

