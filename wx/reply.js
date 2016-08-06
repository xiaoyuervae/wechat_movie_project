'use strict'
var Wechat = require('../wechat/wechat');
var wx = require('./index');
var wechatApi = wx.getWechat;
var config = wx.getConfig;
var path = require('path');
var movieApi = require('../app/api/movie') ;

exports.reply = function*(next) {
    var message = this.weixin;

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码进来的：' + message.EventKey + '' + message.ticket)
            }
            this.body = '亲爱的，欢迎关注科幻电影世界\n' +
                '回复 1 ~ 3，测试文字回复\n' +
                '回复 4，测试图文回复\n' +
                '回复 首页，进入电影首页\n' +
                '回复 电影名字，查询电影信息\n' +
                '某些功能订阅号无权限，如网页授权\n' +
                '回复 语音，查询电影信息\n' +
                '也可以点击 <a href="http://xrqutcxhlh.proxy.qqbrowser.cc/movie">语音查电影</a>'
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        } else if (message.Event === 'LOCATION') {
            this.body = '您上报的位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        } else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单：' + message.EventKey
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫二维码' + message.EventKey + ' ' + message.ticket)
            this.body = '看到你扫了一下哦'
        } else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接：' + message.EventKey
        } else if (message.Event === 'scancode_push') {
            console.log(message.ScanCodeInfo.ScanType)
            console.log(message.ScanCodeInfo.ScanResult)
            this.body = '您点击了菜单中的链接：' + message.EventKey
        } else if (message.Event === 'scancode_waitmsg') {
            console.log(message.ScanCodeInfo.ScanType)
            console.log(message.ScanCodeInfo.ScanResult)
            this.body = '您点击了菜单中的链接：' + message.EventKey
        } else if (message.Event === 'pic_sysphoto') {
            console.log(message.SendPicsInfo.PicList)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接：' + message.EventKey
        } else if (message.Event === 'pic_photo_or_album') {
            console.log(message.SendPicsInfo.PicList)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接：' + message.EventKey
        } else if (message.Event === 'pic_weixin') {
            console.log(message.SendPicsInfo.PicList)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接：' + message.EventKey
        } else if (message.Event === 'location_select') {
            console.log(message.SendLocationInfo.Location_X)
            console.log(message.SendLocationInfo.Location_Y)
            console.log(message.SendLocationInfo.Scale)
            console.log(message.SendLocationInfo.Label)
            console.log(message.SendLocationInfo.Poiname)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接：' + message.EventKey
        }
    }else if (message.MsgType === 'voice') {
       var movies = yield movieApi.searchByName(content) ;
       if (!movies || movies.length == 0) {
           movies = yield movieApi.searchByDouban(content) ; 
       } 

       if (movies && movies.length > 0) {
           reply = [] ; 
           movies = movies.slice(0 , 10) ; //微信最多能显示10条图文消息
           movies.forEach(function(movie) {
               reply.push({
                   title: movie.title ,
                   description: movie.title ,
                   picUrl: movie.poster ,
                   url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/movie/' + movie._id
               })
           })
       }
       else {
           reply = '并没有查询到有关' + content + '的电影\n' 
           + '要不要换个名字试试' ;
       }
    }
    else if (message.MsgType === 'text') {
        var content = message.Content
        var reply = '额，你说的“' + message.Content + '”太复杂了，我不懂。'

        if (content === '1') {
            reply = '天下第一吃大米'
            console.log(message)
        } else if (content === '2') {
            reply = '天下第一吃豆腐'
        } else if (content === '3') {
            reply = '天下第一吃仙丹'
        } else if (content === '张杨海是谁') {
            reply = '张'
        } else if (content === '4') {
            reply = [{
                title: '技术改变世界',
                description: '只是个描述而已',
                picUrl: 'http://tu.dytt.com/20160426054059859.jpg',
                url: 'http://virjay.com'
            }]
        } 
        else {
            var movies = yield movieApi.searchByName(content) ;
            if (!movies || movies.length == 0) {
                movies = yield movieApi.searchByDouban(content) ; 
            } 

            if (movies && movies.length > 0) {
                reply = [] ; 
                movies = movies.slice(0 , 10) ; //微信最多能显示10条图文消息
                movies.forEach(function(movie) {
                    reply.push({
                        title: movie.title ,
                        description: movie.title ,
                        picUrl: movie.poster ,
                        url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/movie/' + movie._id
                    })
                })
            }
            else {
                reply = '并没有查询到有关' + content + '的电影\n' 
                + '要不要换个名字试试' ;
            }
        }
        this.body = reply
    }
    yield next
}