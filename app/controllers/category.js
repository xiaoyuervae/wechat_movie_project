var _ = require('underscore')
var Category = require('../models/category')
var Comment = require('../models/comment')
//detail page
//admin post category
exports.new = function(req , res){
	res.render('category_admin' ,{
		title: 'movie 分类录入页面' ,
		category: {}
	}) ; 
}


// admin post category
exports.save = function(req, res) {
  var _category = req.body.category ; 
  console.log(_category) ; 
  var category = new Category(_category)

  category.save(function(err, category) {
    if (err) {
      console.log(err)
    }

    res.redirect('/admin/category/list')
  })
}

// catelist page
exports.list = function(req, res) {
  Category.fetch(function(err, catetories) {
    if (err) {
      console.log(err)
    }

    res.render('categorylist', {
      title: 'movie 分类列表页',
      catetories: catetories
    })
  })
}