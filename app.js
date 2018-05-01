const
express        = require("express"),
app            = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
Paint          = require("./models/paint"),
User           = require("./models/user"),
flash          = require("connect-flash"),
seedDB         = require("./seeds"),
Comment        = require("./models/comment"),
methodOverride = require("method-override");

//Required Routes
const
commentRoutes    = require("./routes/comments"),
paintRoutes      = require("./routes/paints"),
indexRoutes      = require("./routes/index");


mongoose.connect(process.env.DATABASEURL);


app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Passport config
app.use(require("express-session")({
  secret: "Nelly is the cutest dog",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/paints", paintRoutes);
app.use("/paints/:id/comments", paintRoutes);

//Server start
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The PaintGraffiti server has started...");
});
