var Movie = require('../models/movie')
var Category = require('../models/category')
//index page
exports.index = function(req, res){
	Category
	.find({})
	.populate({
		path: 'movies' , 
		select: 'title poster' , 
		options: { limit: 6 }
	})
	.exec(function(err,categories){
		if (err) {
			console.log(err) ;
		}
		res.render('index' , {
			title:'Movie首页' , 
			categories: categories
		})
	})
}


//search page
exports.search = function(req, res){
	var catId = req.query.cat ; 
	var page = parseInt(req.query.p , 10) || 1 ; 
	var q = req.query.q ; 
	var count = 2 ; 
	var index = (page-1) * count ; 
	if(catId){
		Category
		.find({_id: catId})
		.populate({
			path: 'movies' , 
			select: 'title poster' , 
		})
		.exec(function(err,categories){
			var category = categories[0] || {} ; 
			var movies = category.movies || [] ;
			var results = movies.slice(index, index + count) ; 
			console.log(movies) ; 
			if (err) {
				console.log(err) ;
			}
			res.render('results' , {
				title:'Movie 分类列表页' , 
				keyword: category.name ,
				currentPage: page , 
				query: 'cat=' + catId , 
				totalPage: Math.ceil(movies.length / count) , 
				movies: results
			})
		})
	}
	else{
		Movie
			.find({title: new RegExp(q + '.*' , 'i')})
			.exec(function(err,movies){
				if (err) {
					console.log(err) ;
				}
				var results = movies.slice(index, index + count) ; 
				res.render('results' , {
					title:'Movie 分类列表页' , 
					keyword: q ,
					currentPage: page , 
					query: 'q=' + q , 
					totalPage: Math.ceil(movies.length / count) , 
					movies: results
				})
			})
	}
}