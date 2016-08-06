var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var fs = require('fs') ; 
var path = require('path')
//detail page
exports.detail = function(req, res){
	var id = req.params.id ;
	Movie.update({_id: id} , {$inc: {pv: 1}} , function(err){
		if(err) {
			console.log(err) ;
		}
	})
	Movie.findById(id , function(err , movie){
		Comment.find({movie: id})
		.populate('from' , 'name')
		.populate('reply.from reply.to' , 'name')
		.exec(function(err , comments){
			console.log(comments)
			res.render('detail' , {
				title:'movie '+ movie.title,
				movie: movie , 
				comments: comments
			})
		})
	})
	
}

//list page
exports.list = function(req, res){
	Movie.fetch(function(err , movies){
		if (err) {
			console.log(err)
		}
		res.render('list' , {
			title:'Movie列表页面' , 
			movies:movies
		})
	})
}


//admin page
exports.new = function(req, res){
	Category.fetch(function(err , categories){
		res.render('admin' , {
			title:'movie 后台录入页面' , 
			movie:{} , 
			categories: categories 
		})
	})
}
//admin update movie
exports.update = function(req, res) {
  var id = req.params.id

  if (id) {
    Movie.findById(id, function(err, movie) {
      Category.find({}, function(err, categories) {
        res.render('admin', {
          title: 'imooc 后台更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}
//admin post movie
exports.save = function(req , res){
	var movieObj = req.body.movie  ; 
	var id = movieObj._id ;
	var _movie ; 
	if(req.poster){
		movieObj.poster = req.poster ; 
	}
	if(id) {	//如果有id存在的话表明这是在更新
		Movie.findById(id , function(err , movie){
			if(err){
				console.log(err)
			}
			if(movie == undefined){	//如果没找到就新建
				movie = new Movie(movieObj)
			}
			_movie = _.extend(movie , movieObj)     //_.extend(destination, *sources) 复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象. 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).
			_movie.save(function(err , movie){
				if(err){
					console.log(err)
				}
				//console.log('转发时的id'+movie._id)
				res.redirect('/detail/'+movie._id)
			})
		})
	}else{	//这里是录入
		_movie = new Movie(movieObj) ; 
		var categoryId = movieObj.category ; 
		var categoryName = movieObj.categoryName ; 
		_movie.save(function(err , movie){
			if(err){
				console.log(err)
			}
			console.log('categoryId是: ') ;
			console.log(categoryId) ;
			if(categoryId){	//如果传过来了categoryId
				Category.findById(categoryId , function(err , category){
					console.log('category 是：') ;
					console.log(category) ; 
					if(err){
						console.log(err) ; 
					}
					category.movies.push(movie._id) ; 
					category.save(function(err,category){
						if(err){
							console.log(err) ; 
						}
						return res.redirect('/detail/'+ movie._id) ;
					})
				})

			}
			if(categoryName){
				var category = new Category({
					name: categoryName , 
					movies: [movie._id] 
				}) ; 
				category.save(function(err , category){
					movie.category = category._id ; 
					movie.save(function(err , movie){
						return res.redirect('/detail/'+ movie._id) ;
					})
				})
			}
			
		})

	}
}


//admin delete
exports.del = function(req , res){
	var id = req.query.id 
	console.log(id)
	if(id){
		Movie.remove({ _id:id } , function(err , movie){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1})
			}
		})
	}
}

//admin movie savePoster

exports.savePoster = function(req , res , next){ 
	var uploadPoster = req.files.uploadPoster ; 
	var filePath = uploadPoster.path ; 
	var originalname = uploadPoster.originalFilename ; 
	var fileType = uploadPoster.type.split('/')[1] ;
	if(originalname){
		fs.readFile(filePath , function(err , data){
			var timestamp = Date.now() ; 
			var newName = timestamp+ '.' + fileType ; 
			var newPath = path.join(__dirname , '../../' , '/public/upload/'+ newName) ; 
			fs.writeFile(newPath , data , function(err) {
				req.poster = newName ;
				next() ; 
			})
		})
	}
	else{
		next() ; 
	}

}