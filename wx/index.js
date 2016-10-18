'use strict'
var path = require('path') ; 
var wechat = require('../wechat/g') ; 
var util = require('../libs/util') ; 
var Wechat = require('../wechat/wechat') ;
var wechat_file = path.join(__dirname , '../config/wechat.txt') ; 
var wechat_ticket_file = path.join(__dirname , '../config/wechat_ticket.txt') ; 
var options = require('../options') ; 
var config = {
	wechat: {
		appID: options.appID , 
		appSecret: options.appSecret ,
		token: options.token ,
		getAccessToken: function() {
			return util.readFileAsync(wechat_file , 'utf-8') ; 
		} , 
		saveAccessToken : function(data) {
			data = JSON.stringify(data) ; 
			return util.writeFileAsync(wechat_file , data) ; 
		} ,
		getTicket: function() {
			return util.readFileAsync(wechat_ticket_file , 'utf-8') ; 
		} , 
		saveTicket : function(data) {
			data = JSON.stringify(data) ; 
			return util.writeFileAsync(wechat_ticket_file , data) ; 
		} 
	} 
} 
exports.getConfig = config ; 
exports.getWechat = function() {
	var wechatApi = new Wechat(config) ; 
	return wechatApi ; 
}

