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
    let list = await config.db.notice_list(page,pagesize) ;
    res.render('notice', {
            noticelist: list.recordset,
            page: showPage.show(url, list.output.total, pagesize, page),
        });
};

exports.findOne = async function(req , res){
    let rid = req.body.rid;
    let notice = await config.db.notice_info(rid) 
    res.send({"resp":notice.recordset[0]});
}

exports.add = async function(req , res){
    let msg = req.body.msg;
    let title = req.body.title;
    let ress = await config.db.add_notice(title,msg) 
    return res.send({"resp":ress.output.outmsg})
}

exports.edit =async function (req, res) {
    let rid = req.body.rid;
    let title = req.body.title;
    let msg = req.body.msg;
    let ress = await config.db.modify_notice(rid,title,msg) 
    // res.redirect('/notice')
    return res.send({"resp":ress.output.outmsg});
};

