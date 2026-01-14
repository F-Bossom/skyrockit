const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");

// Index /users/:userId/applications
router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    res.render("applications/index.ejs", {
      applications: currentUser.applications,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// New GET /users/:userId/applications/new
router.get("/new", (req, res) => {
  res.render("applications/new.ejs");
});

// Updates PUT /users/:userId/applications/:applicationId
router.put("/:applicationId", async (req, res) => {
  try {
    if (!req.body.company.trim()) {
      throw new Error("Please provide a valid Company Name");
    }
    if (!req.body.title.trim()) {
      throw new Error("Please provide a valid Title");
    }
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    /*
      const currentUser = await User.findByIdAndUpdate(req.params.id, { $set: { applications: applicationId} })
    */
    application.set(req.body);
    await currentUser.save();

    res.redirect(
      `/users/${req.session.user._id}/applications/${application._id}`
    );
  } catch (error) {
    req.session.message = error.message

    req.session.save(()=>{
      res.redirect(`/users/${req.session.user._id}/applications/${req.params.applicationId}/edit`);
    })
    
  }
});

// Delete Delete /users/:userId/applications/:applicationId
router.delete("/:applicationId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    currentUser.applications.id(req.params.applicationId).deleteOne();

    await currentUser.save();

    res.redirect(`/users/${req.session.user._id}/applications`);
  } catch (error) {
    res.redirect("/");
  }
});

// Created POST /users/:userId/applications/
router.post("/", async (req, res) => {
  const { company, title } = req.body;
  try {
    if (!company.trim()) {
      throw new Error("Please provide a valid Company Name");
    }
    if (!title.trim()) {
      throw new Error("Please provide a valid Title");
    }

    // find the user to add add a app too
    const user = await User.findById(req.params.userId);
    // add application to users applications array
    user.applications.push(req.body);
    // save user
    await user.save();

    res.redirect(`/users/${user._id}/applications`);
  } catch (error) {
    req.session.message = error.message;

    req.session.save(() => {
      res.redirect(`/users/${req.session.user._id}/applications/new`);
    });
  }
});

// GET EDIT /users/:userId/applications/:applicationId/edit
router.get("/:applicationId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const application = user.applications.id(req.params.applicationId);

    res.render("applications/edit.ejs", { application });
  } catch (error) {
    res.redirect("/");
  }
});

//SHOW GET /users/:userId/applications/:applicationId
router.get("/:applicationId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const application = user.applications.id(req.params.applicationId);

    res.render("applications/show.ejs", { application });
  } catch (error) {
    res.redirect("/");
  }
});

module.exports = router;
