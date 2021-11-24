const path=require('path');
const fs = require('fs');
const Assignment = require('../models/assignment');

const express = require('express');

const router = express.Router();

const controller = require('../controllers/teacher');
const isAuth = require('../middleware/is-teacher-auth');

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



router.get('/create-class', isAuth, controller.getCreateClass);

router.get('/classes', isAuth,controller.getAllClasses);

router.post('/create-class', isAuth, controller.postClass);

router.post('/delete-class', isAuth, controller.deleteClass);

router.post('/delete-assignment', isAuth, controller.deleteAssignment);

router.get('/create-assignments/:classId',isAuth, controller.getCreateAssignment);

router.get('/assignments/:classId',isAuth, controller.getAssignments);

router.get('/assignment-details',isAuth,controller.getAssignmentDetails);

router.get('/download',isAuth,controller.downloadFiles);

router.get('/downloadFile',isAuth,controller.downloadStudentFiles);

router.post('/grade', isAuth, controller.postGrade);


// To store the assignments given by teacher in the server

router.post('/create-assignments', isAuth, upload.single('myfile'), async(req,res,next)=>{
    const classId = req.body.classId;
    const asName = req.body.name;
    const description = req.body.description;
    const tname= req.body.tname;
    const email=req.body.email;

    let ObjectId = require('mongodb').ObjectId;
    const clId = new ObjectId(classId);
    try{
        const file = req.file.path;
        var file_name = req.file.originalname.split('.')[1];
        let target_path = 'public/uploads/'+ fileeName;
        console.log(target_path);
        var file1=new Assignment();
        file1.class= clId;
        file1.file=target_path;
        file1.fileName=req.file.originalname;
        file1.asName=asName;
        file1.description=description;
        file1.name = tname;
        file1.email = email;
        file1.save();
        res.redirect('/teacher/classes');
    }
    catch (err)
    {
        console.log(err);
    }
});

module.exports = router;