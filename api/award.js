let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');

let pagesize = 30

exports.index =async function (req, res) {
    let phenixId = req.query.phenixId;
    let level = req.query.level;
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
   
    res.render('award', {
            address : '',
            balance:1,
            awardlist: [],
            phenixId : 1,
            level : 1,
            btnstate : 0,
            page: showPage.show(url, 0, pagesize, page),
        });
};
async function validCreateState(id,type1,type2){
    let task_create = await config.Task.find({"refId":id,$or:[{"type":type1},{"type":type2}]});
    if(task_create && task_create.length>0){
        for(var ak=0;ak<task_create.length;ak++){
            let txxs = await config.Transaction.findOne({"_id":task_create[ak].txId});
            if(txxs){
                if(txxs.state == 1 || txxs.state==0){
                    return 1;
                }else if(txxs.state==2){
                    return 2;
                }
                //    if(txxs.txhash && txxs.txhash.length==66){
                //        let recept = await config.web3.eth.getTransactionReceipt(txxs.txhash);
                //        if(recept.status){
                //            return 2;
    
    		    //         }
                //     }
                
            }
        }
    }
    return 3
}

exports.send_award = async function(req, res){
    let phenixId = req.body.phenixId;
    let level  = req.body.level;
    if(phenixId && level){
        let datas   = await config.Award.find({phenix:phenixId,roundIndex:level,state:0})
        if(datas && datas.length>0){
            for(var i =0;i<datas.length;i++){
                let accounts = await config.Account.findOne({"inviteCode":datas[i].inviteCode})
                if(accounts && accounts.address && accounts.address.length==42){
                    let tx_id = await saveTransaction(config.web3.utils.toWei(String(datas[i].amount*0.98),'ether'),accounts.address);
                    await config.Task({
                        refId : datas[i]._id,
                        txId : tx_id,
                        type : datas[i].type+"award"
                    }).save();
                    await config.Award.update({"_id":datas[i]._id},{$set:{"state":1}});
                }
            }
            return res.send({"resp":"发放奖励进行中"})
        }
    }
    return res.send({"resp":"failure"})
}



async function saveTransaction(value,address){
    let tx = await config.Transaction({
                    value : value,
                    sender : config.awardSender,
                    address : address,
                }).save()
    return tx._id;
}
