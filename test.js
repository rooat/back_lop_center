
'use strict'
const mssql = require('mssql');
const conf = {
    user: 'swkdbsa',
    password: 'gft%$#@48828YTHEbds',
    server:'18.140.25.68',
    database: 'SuperKuang_new',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};
var connectionPool;
var getConnection = async function(){//连接数据库
  if(!(connectionPool && connectionPool.connected)) {
      connectionPool = await mssql.connect(conf);
  }
  return connectionPool;
}

async function generate_phoenix()  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('amount', 100000)
    .output('outmsg')
    .execute('p_background_generate_phoenix')
	console.log(result)
}
// generate_phoenix()
async function Mine_recruitment()  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('num', 3)
    .input('level', 1)
    .input('automatic', 10)
    .output('outmsg')
    .execute('p_background_Mine_recruitment')
	console.log(result)
}
// Mine_recruitment()
async function settle_account()  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('num', 1)
    .input('levle',1)
    .output('outmsg')
    .execute('p_background_settle_account')
	console.log(result)
}
// settle_account()
async function position_management(from_index,amount)  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('from_index',1)
    .input('amount',10)
    .output('total')
    .execute('p_background_position_management')
	console.log(result.output.total)
}
// position_management()
async function rounds_management(from_index,amount,num)  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('from_index',1)
    .input('amount',12)
    .input('num', 1)
    .output('total')
    .execute('p_background_rounds_management')
    console.log(result)
    return result
	// 
}
// rounds_management()
async function notice_list()  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('from_index', 1)
    .input('amount',1)
    .output('total')
    .execute('p_background_notice_list')
	console.log(result)
}
// notice_list()
async function notice_info()  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('rid', 10)
    .execute('p_background_notice_info')
	console.log(result)
}
// notice_info()
async function add_notice()  {
  let mssql_db = await getConnection(); 
    var result = await mssql_db.request()
    .input('title', 100000)
    .input('msg',"sss")
    .output('outmsg')
    .execute('p_background_add_notice')
	console.log(result)
}
// add_notice()
async function modify_notice()  {
  
    var result = await mssql_db.request()
    .input('rid', 10)
    .input('title',"ddd")
    .input('msg',"aaaa")
    .output('outmsg')
    .execute('p_background_modify_notice')
	console.log(result)
}
// modify_notice()
// var config = require('./config')
// let pwd = config.utils.md5("etz123456");
// console.log(pwd)
async function userinfo_list(){
  let mssql_db = await getConnection(); 
  var result = await mssql_db.request()
  .input("from_index",1)
  .input("amount",10)
  .output("total")
  .execute('p_background_userinfo_list')
  console.log(result)
  return result 
}
// userinfo_list()
async function modify_userinfo(){
  let mssql_db = await getConnection(); 
  var result = await mssql_db.request()
  .input("account","浪哥1")
  .input("status",1)
  .output("outmsg")
  .execute('p_background_modify_userinfo')
  console.log(result)
  return result 
}
// modify_userinfo()
async function search_account(){
  let mssql_db = await getConnection(); 
  var result = await mssql_db.request()
  .input("account","test016")
  .output("outmsg")
  .execute('p_background_search_account')
  console.log(result.recordset)
  return result 
}
// search_account("test001")
async function set_performance(account){
  let mssql_db = await getConnection(); 
  var result = await mssql_db.request()
  .input("account","test016")
  .input("perform",1111)
  .output("outmsg")
  .execute('p_background_set_performance')
  console.log(result)
  return result 
}
set_performance()
