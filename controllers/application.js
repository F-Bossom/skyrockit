const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Index /users/:userId/applications
router.get("/", async (req, res) => {
  try {
    res.render("applications/index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

// New GET /users/:userId/applications/new
router.get("/new", (req, res)=>{
  res.render("applications/new.ejs")
})

// Create POST /users/:userId/applications/
router.post("/", async (req, res)=>{
  try {
    // find the user to add an app to
    const user = await User.findById(req.session.user._id)
    // add application to users applications array
    user.applications.push(req.body)
    // save user
    await user.save()

    res.redirect(`/users/${user._id}/applications`)
  } catch (error) {
    console.log(error);
    res.redirect("/")
  }
})

module.exports = router;
