var express = require("express");
var router = express.Router();
var Paint = require("../models/paint");
var middleware = require("../middleware");

//index route
router.get("/", function(req, res){
    //Get all Paints from DB
    Paint.find({}, function(err, allpaints) {
        if(err){
            console.log(err);
        } else {
            res.render ("paints/index",{paints: allpaints, currentUser: req.user});
        }
    });
});

//create route
router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to paints array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPaint = {name: name, image: image, description: desc, author: author};
    // Create a new paint and save to DB
    Paint.create(newPaint, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            //redirect back to paints page
            res.redirect("/paints");
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("paints/new");
});

//show route
router.get("/:id", function(req,res) {
    Paint.findById(req.params.id).populate("comments").exec(function(err, foundPaint) {
       if(err) {
           console.log(err)
       } else {
           res.render("paints/show", {paint: foundPaint});
       }
    });
});

//EDIT paint ROUTE
router.get("/:id/edit", middleware.checkPaintOwnership, function(req, res) {
    Paint.findById(req.params.id, function(err, foundPaint) {
         res.render("paints/edit", {paint: foundPaint});
     });
});

//UPDATE paint ROUTE
router.put("/:id", middleware.checkPaintOwnership, function(req, res){
   //find and update the correct paint
   Paint.findByIdAndUpdate(req.params.id, req.body.paint, function(err, updatedPaint){
       if(err){
           res.redirect("/paints");
       } else {
           res.redirect("/paints/" + req.params.id);
       }
   });
});

//Destroy paint route
router.delete("/:id", middleware.checkPaintOwnership, function(req, res) {
  Paint.findByIdAndRemove(req.params.id, function(err) {
     if(err) {
         res.redirect("/paints");
     } else {
         req.flash("success", "Deleted Successfully");
         res.redirect("/paints");
     }
  });
});

module.exports = router;
