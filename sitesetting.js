const express      = require('express')
var mongoose       = require('mongoose');
const router       = express.Router();
var db = require('../model/sitesettingsdb');
var async          = require('async');
var cloudinary = require('cloudinary');
var multer       =   require('multer');
var config = require('../Nodedetails/config')
let common = require('../helpers/common');

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: config.cloudinaryData.cloud_name,
  api_key: config.cloudinaryData.api_key,
  api_secret: config.cloudinaryData.api_secret
});

let apiresponse = {
  status: 200,
  message: "",
  data: [],
  cmscount: 0
};

router.get('/get_settings', (req, res) => {
	try{
		db.findOne({},function(err,response){
			res.json({'status':true,'data':response})
		})
	}
	catch(e){
		console.log('get_settings',e)
	}
});


router.get('/getsettings', (req, res) => {
	try {
			common.redisConfig('sitesetting', '', (resData) => {
					var getarray={
						 copyrights: resData[0].copyrights ,
						 description: resData[0].description,
						 fb: resData[0].fb ,
						 insta: resData[0].insta ,
						 linked_in: resData[0].linked_in ,
						 sitename: resData[0].sitename ,
						 site_maintenance_reason: resData[0].site_maintenance_reason ,
						 site_maintenance: resData[0].site_maintenance ,
						 snapchat: resData[0].snapchat ,
						 title: resData[0].title ,
						 twitter: resData[0].twitter ,
						 youtube:  resData[0].youtube,
						 home_video: resData[0].home_video ,
						 site_logo: resData[0].site_logo ,
						 favicon: resData[0].favicon ,
						 contact_mail: resData[0].contact_mail ,
						 contact_phone: resData[0].contact_phone ,
						 contact_address: resData[0].contact_address,
						 contact_mapaddress: resData[0].contact_mapaddress
					};
				res.json({'status':true,'data':getarray})
		 })
			
	}
	catch (e) {
			res.json({
					status: false,
					"Message": "Something went wrong",
			})
	}
})


router.post('/edit_sitesetting', (req, res) => {
	try{
		db.findOne({},function(err,response){
			if(response){
				db.updateOne({},{ $set:{
				"copyrights":req.body.copyrights,
				"description":req.body.description,
				"fb":req.body.fb,
				"insta":req.body.insta,
				"linked_in":req.body.linked_in,
				"sitename":req.body.sitename,
				"snapchat":req.body.snapchat,
				"title":req.body.title,
				"twitter":req.body.twitter,
				"youtube":req.body.youtube,
				"contact_mail":req.body.contact_mail,
				"contact_phone":req.body.contact_phone,
				"contact_address":req.body.contact_address,			
				'home_video':req.body.home_video
					}}).exec(function(err, resUpdate){
						common.SetredisConfig('sitesetting', '', (resData) => {
							if(err){
								res.json({ "status": false});
							}
							else{
								res.json({ "status": true});
							}
						});						
				});
			}
			else{
				var myData = new db(req.body);
	      myData.save();
	      res.json({success:true})
			}
		})
	}
	catch(e){
		console.log('edit_sitesetting',e)
	}
});

router.post('/update_maintanance', (req, res) => {
	try{
		db.updateOne({},{ $set:{"site_maintenance":req.body.maintain,"site_maintenance_reason":req.body.reason}}).exec(function(err, resUpdate){
				common.SetredisConfig('sitesetting', '', (resData) => {
					if(err){
						res.json({ "status": false});
					}
					else{
						res.json({ "status": true});
					}
				});										
		});
	}
	catch(e){
		console.log('update_maintanance',e)
	}
});

router.post("/uploadPhoto",upload.array("uploads[]", 12), function (req, res) {
	try{
		if(req.files.length > 0){
			cloudinary.uploader.upload(req.files[0].path, function(result) {
				res.json({"status": true,"result":result});
			});
		}
		else{
			res.json({"status": false});
		}
	}
	catch(e){
		console.log("uploadPhoto",e);
	}
});

router.post('/updateimage1', (req, res) => {
	try{
		db.updateOne({},{ $set:{"site_logo":req.body.image}}).exec(function(err, resUpdate){
				common.SetredisConfig('sitesetting', '', (resData) => {
					if(err){
						res.json({ "status": false});
					}
					else{
						res.json({ "status": true});
					}
				});	
		});
	}
	catch(e){
		console.log('updateimage1',e)
	}
});

router.post('/updateimage2', (req, res) => {
	try{
		db.updateOne({},{ $set:{"favicon":req.body.image}}).exec(function(err, resUpdate){
				common.SetredisConfig('sitesetting', '', (resData) => {
					if(err){
						res.json({ "status": false});
					}
					else{
						res.json({ "status": true});
					}
				});	
		});
	}
	catch(e){
		console.log('updateimage2',e)
	}
});

module.exports = router;