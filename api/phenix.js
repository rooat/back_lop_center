let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
let pagesize = 30;

exports.index =async function (req, res) {
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.db.position_management(1,10)
    res.render('phenix', {
            phenixlist: list.recordset,
            page: showPage.show(url, list.output.total, pagesize, page),
        });
};


exports.add= async function(req , res){
    let startGoal = req.body.amount;
    if(!startGoal){
        return res.send({"resp":"请输入正确的值"})
    }
    let ress = await config.db.generate_phoenix(startGoal)
    // console.log(ress)
    return res.send({"resp":ress.output.outmsg})
}





