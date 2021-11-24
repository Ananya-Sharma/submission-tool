const path=require('path');
const fs = require('fs');
const StudentAssignment = require('../models/student-assignment');

const express = require('express');

const router = express.Router();

const controller = require('../controllers/student');
const isAuth = require('../middleware/is-student-auth');

const multer = require('multer');

let fileeName;

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, 'public/uploads');
    },
    filename : (req,file,cb)=>{
        fileeName = file.fieldname + '-' + Date.now()+ '.'+file.originalname.split('.')[1];
        cb(null, fileeName);
    }
});

const upload = multer({storage});



router.get('/classes', isAuth, controller.getAllClasses);

router.post('/classes/enroll', isAuth, controller.enroll);

router.get('/assignments/:classId',isAuth, controller.getAssignments);

router.get('/submit-assignment-form/:assignId',isAuth,controller.getSubmitForm);

router.get('/download',isAuth,controller.downloadFiles);

router.post('/grade',isAuth,controller.getGrade);


router.post('/submit-assignment', isAuth, upload.single('myfile'), async(req,res,next)=>{
    let assignId = req.body.assignId;
    const name = req.body.name;
    const email=req.body.email;
    const rollno = req.body.rollno;

    let ObjectId = require('mongodb').ObjectId;
    assignId = new ObjectId(assignId);
    try{
        var target_path = 'public/uploads/' + fileeName;
        var file1=new StudentAssignment();
        file1.assignment= assignId;
        file1.file= target_path;
        file1.fileName=req.file.originalname;
        file1.name = name;
        file1.email = email;
        file1.rollno = rollno;
        file1.save();
        res.redirect('/student/classes');
    }
    catch (err)
    {
        console.log(err);
    }
});

module.exports = router;