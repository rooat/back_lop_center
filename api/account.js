let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
let pagesize = 30;

exports.index =async function (req, res) {
    let account = req.query.inviteCode;
    let option = {};
    
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list
    let count=1;
    if(account){
        list = await config.db.search_account(account)
    }else{
        list = await config.db.userinfo_list(page,pagesize);
        count = list.output.total;
    }
    
    res.render('account', {
            accountlist: list.recordset,
            page: showPage.show(url, count, pagesize, page),
        });
};

exports.add_amount =async function (req, res) {
    let id = req.body.id; 
    let amount = req.body.amount;
    console.log("id=="+id+",amount="+amount)
    if(!id ||!amount){
        return res.send({"resp":"请输入正确的值"})
    }
    let ress = await config.db.set_performance(id,amount);
    return res.send({"resp":ress.output.outmsg}) 
};
var totalDeposit = 0;
var totalWithdraw = 0;
var totalMember = 0;
var dataMap = new Map();
exports.calculate_total = async function (req, res) {
    let invite_code = req.body.inviteCode;
    // console.log("invite_code---",invite_code)
    let deposit_total =0;
    let withdraw_total =0;
    let member_total = 0;
    if(invite_code && dataMap.get(invite_code)){
        let data = dataMap.get(invite_code);
        return res.send({"resp":{"deposit":data.deposit_total,"withdraw":data.withdraw_total,"member":data.member_total}}); 
    }else{
        await findInvite(invite_code);
        deposit_total =totalDeposit;
        withdraw_total =totalWithdraw;
        member_total = totalMember;
        totalDeposit = 0;
        totalWithdraw = 0;
        totalMember = 0;
        dataMap.set(invite_code,{"deposit_total":deposit_total,"withdraw_total":withdraw_total,"member_total":member_total})
        setTimeout(function(){
            dataMap = new Map();
        },60000)
        return res.send({"resp":{"deposit":deposit_total,"withdraw":withdraw_total,"member":member_total}});
    }
}

async function findInvite(invite_code){
    if(invite_code>0){
        let inviteArr = await config.Account.find({"inviterCode":invite_code});
        if(inviteArr && inviteArr.length>0){
            for (let index = 0; index < inviteArr.length; index++) {
                let deposit = inviteArr[index].historyDeposit;
                let withdraw = inviteArr[index].historyWithdraw;
                totalDeposit += Number(deposit);
                totalWithdraw += Number(withdraw);
                totalMember++;
                await findInvite(inviteArr[index].inviteCode);
            }
        }
    }
}

exports.delete =async function (req, res) {
    let id = req.query.id;

    let notice = await config.Notice.findOne({"_id":id});
    if(notice && notice.state==0){
        await config.Notice.update({"_id":id},{$set:{"state":1}});
    }
    res.redirect('/notice');
};

exports.freeze = async function(req,res){
    let index = req.body.index;
    let account = req.body.account;
    if(!index ||!account){
        return res.send({"resp":"请输入正确的值"})
    }
    let ress = await config.db.modify_userinfo(account,index)
    return res.send({"resp":ress.output.outmsg})
}
