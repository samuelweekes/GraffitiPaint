var express = require("express");
var router = express.Router({mergeParams: true});
var Paint = require("../models/paint");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Paint.findById(req.params.id, function(err, paint){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {paint: paint});
        }
    })
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
   Paint.findById(req.params.id, function(err, paint) {
       if(err) {
           console.log(err);
           res.redirect("/paints");
         } else {
             Comment.create(req.body.comment, function(err, comment) {
                 if(err) {
                     req.flash("error", "Something went wrong");
                     console.log(err);
                 } else {
                 //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save comment
                 comment.save();
                 paint.comments.push(comment._id);
                 paint.save();
                 req.flash("success", "Successfully added comment");
                 res.redirect("/paints/" + paint._id);
                 }
             });
         }
    });
});

//Comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
             res.render("comments/edit", {paint_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err) {
           res.redirect("back");
       } else {
           res.redirect("/paints/" + req.params.id)
       }
    });
});

//Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/paints/" + req.params.id);
        }
    });
});

module.exports = router;
