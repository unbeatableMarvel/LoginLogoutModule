var jwt = require("jsonwebtoken");
var config = require("../config/configurations");
var mongoose = require('mongoose');
var User = require('../authentication/userschema');

var signupProcessor = function(req, SuccessCB, ErrorCB) {
	console.log("----signupprocessor-----------------------",req.body);
    console.log("CB-----------------",SuccessCB);

    var newUser = new User({
        name: req.body.name,
        telephone: req.body.telephone,
        email: req.body.email,
        location: req.body.location,
        password: req.body.password,
        confirmpwd: req.body.cfpwd
       
    });

    newUser.save(function(err, data) {
                if (err) {

                    console.log("error was there in newUser Creation", err);
                    
                } else {
                    console.log("data successfully saved", data);
                    //SuccessCB({ "success": "created successfully" });
                    
                }
            }, function(err, results) {
        
        if (err) {
        
            ErrorCB(err);
        } else {
        
            SuccessCB({ "success": "created successfully" });
        }
    });
};

var loginProcessor = function(req, SuccessCB, ErrorCB, notFoundCB) {
    console.log("----------+loginprocessor---------",req.body);
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            console.log("Error Out when Sign In --> ", err);
            ErrorCB({ error: "Error Occured During Login" });
        };

        console.log("data----->", user);

        if (!user) {
            notFoundCB({ error: "User Not Found" });
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var authToken = jwt.sign({ user: user.email }, config.secret, {
                        expiresIn: 10080 //seconds
                    });
                    SuccessCB({ name: user.name, telephone: user.telephone, email: user.email, location: user.location, password: user.password,confirmpwd: user.cfpwd , authToken: 'JWT ' + authToken });
                } else {
                    notFoundCB({ error: "Password Doesnot match" });
                }
            });
        };
    });
}

module.exports = {
    signupProcessor: signupProcessor,
    loginProcessor: loginProcessor
}