let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
let pagesize = 30;

exports.index =async function (req, res) {
    let inviteCode = req.query.inviteCode;
    let option = {};
    if(inviteCode){
        option ={"inviteCode":inviteCode}
    }
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    
    res.render('address_cal', {
            dataObj: {"address_count":0,"account_count":0,"valid_address_count":0},
            page: showPage.show(url, 1, pagesize, page),
        });
};

exports.add_amount =async function (req, res) {
    let id = req.body.id; 
    let amount = req.body.amount;
    let account = await config.Account.findOne({"_id":id});
    if(account && amount ){
        await config.Account.update({"_id":id},{$set:{"offerAchievement":amount}});
        return res.send({"resp":"success"});
    }
    return res.send({"resp":"请输入正确的值"})
};


exports.delete =async function (req, res) {
    let id = req.query.id;

    let notice = await config.Notice.findOne({"_id":id});
    if(notice && notice.state==0){
        await config.Notice.update({"_id":id},{$set:{"state":1}});
    }
    res.redirect('/notice');
};
