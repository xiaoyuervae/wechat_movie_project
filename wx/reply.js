'use strict'
var Movie = require('../app/api/movie') ;
var help = '亲爱的，欢迎关注科幻电影世界\n' +
   '回复 1 ~ 3，测试文字回复\n' +
   '回复 4，测试图文回复\n' +
   '回复 首页，进入电影首页\n' +
   '回复 电影名字，查询电影信息\n' +
   '某些功能订阅号无权限，如网页授权\n' +
   '回复 语音，查询电影信息\n' +
   '也可以点击 <a href="http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/movie">语音查电影</a>'
exports.reply = function*(next) {
    var message = this.weixin;
    if (message.MsgType == 'event') {
        if (message.Event == 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码进来的：' + message.EventKey + '' + message.ticket)
            }
            this.body = help ; 
        } else if (message.Event == 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        } else if (message.Event == 'LOCATION') {
            this.body = '您上报的位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        } else if (message.Event == 'CLICK') {
              var news = []

              if (message.EventKey == 'movie_hot') {
                let movies = yield Movie.findHotMovies(-1, 10)

                movies.forEach(function(movie) {
                  news.push({
                    title: movie.title,
                    description: movie.title,
                    picUrl: movie.poster,
                    url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/jump/' + movie._id 
                  })
                })
              }
              else if (message.EventKey == 'movie_cold') {
                let movies = yield Movie.findHotMovies(1, 10)

                movies.forEach(function(movie) {
                  news.push({
                    title: movie.title,
                    description: movie.title,
                    picUrl: movie.poster,
                    url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/jump/' + movie._id 
                  })
                })
              }
              else if (message.EventKey == 'movie_crime') {
                let cat = yield Movie.findMoviesByCate('犯罪')

                cat.movies.forEach(function(movie) {
                  news.push({
                    title: movie.title,
                    description: movie.title,
                    picUrl: movie.poster,
                    url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/jump/' + movie._id 
                  })
                })
              }
              else if (message.EventKey == 'movie_cartoon') {
                let cat = yield Movie.findMoviesByCate('动画')

                cat.movies.forEach(function(movie) {
                  news.push({
                    _id: movie._id ,
                    title: movie.title,
                    description: movie.title,
                    picUrl: movie.poster,
                    url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/jump/' + movie._id 
                  })
                })
              }
              else if (message.EventKey == 'help') {
                news = help
              }
              this.body = news
        } 
    }else if (message.MsgType == 'voice') {
       var voiceText = message.Recognition ;
       var movies = yield Movie.searchByName(voiceText) ;
       
       if (!movies || movies.length == 0) {
           movies = yield Movie.searchByDouban(voiceText) ; 
       } 

       if (movies && movies.length > 0) {
           reply = [] ; 
           movies = movies.slice(0 , 10) ; //微信最多能显示10条图文消息
           movies.forEach(function(movie) {
               reply.push({
                   title: movie.title ,
                   description: movie.title ,
                   picUrl: movie.poster ,
                   url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/jump/' + movie._id
               })
           })
       }
       else {
           reply = '并没有查询到有关' + content + '的电影\n' 
           + '要不要换个名字试试' ;
       }
       this.body = reply ;
    }
    else if (message.MsgType == 'text') {
        console.log('来到了text');
        var content = message.Content
        var reply = '额，你说的“' + message.Content + '”太复杂了，我不懂。'

        if (content == '1') {
            reply = '天下第一吃大米'
            console.log(message)
        } else if (content == '2') {
            reply = '天下第一吃豆腐'
        } else if (content == '3') {
            reply = '天下第一吃仙丹'
        } else if (content == '张杨海是谁') {
            reply = '张'
        } else if (content == '4') {
            reply = [{
                title: '技术改变世界',
                description: '只是个描述而已',
                picUrl: 'http://tu.dytt.com/20160426054059859.jpg',
                url: 'http://virjay.com'
            }]
        } 
        else {
            var movies = yield Movie.searchByName(content) ;
            if (!movies || movies.length == 0) {
                movies = yield Movie.searchByDouban(content) ; 
            } 

            if (movies && movies.length > 0) {
                reply = [] ; 
                movies = movies.slice(0 , 10) ; //微信最多能显示10条图文消息
                movies.forEach(function(movie) {
                    reply.push({
                        title: movie.title ,
                        description: movie.title ,
                        picUrl: movie.poster ,
                        url: 'http://xrqutcxhlh.proxy.qqbrowser.cc/wechat/jump/' + movie._id
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