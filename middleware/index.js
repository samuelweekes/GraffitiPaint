var Paint = require("../models/paint");
var Comment = require("../models/comment");

// all middleware goes here

var middlewareObj = {};


middlewareObj.checkPaintOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
     Paint.findById(req.params.id, function(err, foundPaint) {
            if(err){
               res.redirect("back");
            } else {
                req.flash("error", "Not found");
                if(foundPaint.author.id.equals(req.user._id)) {
                    next();
                } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
                 }
            }
        });
            } else {
             req.flash("error", "You need to be logged in to do that");
             res.redirect("back");
            }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
     Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
               res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
                 }
            }
        });
            } else {
             req.flash("error", "You need to be logged in to do that");
             res.redirect("back");
            }
};

//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
