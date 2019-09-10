var express = require('express');
var router = express.Router();
var login = require('../api/login');
var phenix = require('../api/phenix')
var round = require('../api/round')
var notice = require('../api/notice');
var account = require('../api/account')
var common = require('../api/common')
var datas = require('../api/datas')
var award = require('../api/award')

var auth = function (req, res, next) {
	if (req.session && req.session.isLogged) {
		return next();
		// req.session.destroy();
	}	
	else
		return res.json({ status: 'FAILED', message: 'Please Enter Deails gain.' });
};

router.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});


//=========================================================

//admin

router.get('/', login.index);
router.get('/login', login.Glogin);
router.post('/login', login.Plogin);
router.get('/logout', login.logout);
router.get('/home', login.home);

router.get('/phenix',phenix.index);
router.post('/add_startNewPhenix',phenix.add);

router.get('/round',round.index);
router.post('/add_startNextRound',round.add_startNextRound);
router.post('/overRound',round.overRound);

router.get('/notice',notice.index);
router.post('/find_notice',notice.findOne)
router.post('/add_notice',notice.add);
router.post('/update_notice',notice.edit);

router.get('/account',account.index);
router.post('/freeze_account',account.freeze);
router.post('/updateAmount',account.add_amount);
router.post('/calculateTotal',account.calculate_total);

router.get('/award',award.index);
router.post('/sendAward',award.send_award)
router.get('/latest_blocknumber',common.getBlockNumber);

router.get('/data_address',datas.index);
module.exports = router;