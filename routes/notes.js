const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const { findByIdAndDelete, findOneAndUpdate } = require('../models/Notes');

//create notes || login required
router.post('/createnotes', fetchuser, body('title', 'title is required').isLength({ min: 1 }), async (req, res) => {
  let success=false;
  //errors of express validator
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({success:success,error: error.array() });
  }
  try {
    const userid = req.user.id

    //creating note
    const note = await Notes.create({
      userId: userid,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag
    });
    if(note)success=true;
    res.json({success:success,note:note});
  } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
});


//get notes || login required
router.post('/getnotes', fetchuser, async (req, res) => {
  let success=false;
  try {
    const userid = req.user.id;
    const notes = await Notes.find({ userId: userid });
    success=true;
    res.json({success:success,notes:notes});
  } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
});

//update notes || Login requires
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  let success=false;
  try {
    const userid = req.user.id;

    const noteCheck = await Notes.findById(req.params.id);
    if (!noteCheck) return res.status(404).json({success:success,message:"404 Not found"});
    if (noteCheck.userId.toString() !== userid) return res.status(401).json({success:success,message:"Access Denied"});
    
    const newNote={title:req.body.title,description:req.body.description,tag:req.body.tag};
    
    const note= await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new : true})
    if(note)success=true;
    res.json({success:success,note:note});
  } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
});


//delete note

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  let success=false;
  try {
    const noteCheck = await Notes.findById(req.params.id);
    if (!noteCheck) return res.status(404).json({success:success,message:"Not Found"});
    if (noteCheck.userId.toString() !== req.user.id) return res.status(401).json({success:success,message:"Access Denied"});
    const note= await Notes.findByIdAndDelete(req.params.id);
    if(note)success=true;
    res.json({success:success,message:"Note deleted succesfully"});
  } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
})


module.exports = router;


