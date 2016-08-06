'use strict'
var wx = require('../../wx/index') ; 
var wechatApi = wx.getWechat() ;
var util = require('../../libs/util') ;
var movieApi = require('../api/movie') ;

exports.guess = function *(next) {
	var data = yield wechatApi.fetchAccessToken() ; 
	var access_token = data.access_token ; 
	var ticketData = yield wechatApi.fetchApiTicket(access_token) ; 
	var ticket = ticketData.ticket ; 
	var url = this.href.replace(':8000' , '') ; 
	var params = util.sign(ticket , url) ;
	yield this.render('wechat/game' , params) ;
}

exports.find = function *(next) {
	var id = this.params.id ; 
	var data = yield wechatApi.fetchAccessToken() ; 
	var access_token = data.access_token ; 
	var ticketData = yield wechatApi.fetchApiTicket(access_token) ; 
	var ticket = ticketData.ticket ; 
	var url = this.href.replace(':8000' , '') ; 
	var params = util.sign(ticket , url) ;
	var movie = yield movieApi.searchById(id) ; 
	params.movie = movie ; 
	yield this.render('wechat/movie' , params) ;
}