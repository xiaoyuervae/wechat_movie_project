var _ = require('underscore')
var User = require('../models/user')
//user signup
exports.signup = function(req , res){
	var _user = req.body.user ; 
	User.find({name: _user.name} , function(err , user){
		if(err){
			console.log(err) ; 
		}
		//console.log(user) ;
		if(user.name){
			//如果说已经注册过的话，直接跳转到登陆界面
			res.redirect('/login') ;
		}else{
			var user = new User(_user) ; 
			user.save(function(err , user){
				if(err){
					console.log(err) ; 
				}
				//console.log('come on') ;
				res.redirect('/admin/user/list') ; 
			})	
		}
	}) ;
	//console.log(_user) ; 
}


//user login
exports.login = function(req , res){
	//console.log('i am coming') ;
	var _user = req.body.user ; 
	var username = _user.name ; 
	var userpassword = _user.password ;
	User.findOne({name:username} , function(err , user){
		if(err){
			console.log(err) ; 
		}
		if(!user){
			//如果说没有找到，返回注册界面
			return res.redirect('/signup') ; 
		}
		user.comparePassword(userpassword , function(err , isMatched){
			if(err){
				console.log(err) ; 
			}
			//console.log(isMatched) ;
			if(isMatched){
				req.session.user = user ; 
				console.log('password is matched') ;
				return res.redirect('/') ;
			}else{
				return res.redirect('/signup') ;
				console.log('password is not matched') ;
			}
		})
	})

}

//user logout
exports.logout = function(req , res){
	delete req.session.user ; 
	//delete app.locals.user ; 
	res.redirect('/') ;

}

//admin user list
exports.list = function(req , res){
	User.fetch(function(err , users){
		if (err) {
			console.log(err)
		}
		res.render('userlist' , {
			title:'Movie 用户列表页面' , 
			users:users
		})
	})
}

//user showlogin
exports.showLogin = function(req , res){
	res.render('login' , {
		title: '用户登陆页面'
	})
}

//user showlogin
exports.showSignup = function(req , res){
	res.render('signup' , {
		title: '用户注册页面'
	})
}

//middleware for user
exports.loginRequired = function(req , res , next){
	var user = req.session.user ; 
	if(!user){
		return res.redirect('/login') ; 
	}

	next() ;
}

exports.adminRequired = function(req , res , next){
	var user = req.session.user ; 

	if(user.role <= 10){
		return res.redirect('/login') ; 
	}

	next() ;
}

