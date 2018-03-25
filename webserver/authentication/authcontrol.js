
var router = require('express').Router();
var authenticationProcessor = require("../authentication/authprocessor");

router.post('/signup',function(req,res){
	authenticationProcessor.signupProcessor(req,function(data){
		res.status(201).json(data);
	},function(err){
		console.log("error in signup --->",err);
		res.status(500).json({"error":"Error Occured"});
	});
});


router.post('/login',function(req,res){
	authenticationProcessor.loginProcessor(req,function(data){
		console.log("Successfully found User");
		res.status(200).json(data);
	},function(err){
		console.log("Error Out",err);
		res.status(500).json({error:"Error Occured"});
	},function(notFound){
		console.log("No User Exist");
		res.status(401).json(notFound);
	});
});

module.exports = router ;