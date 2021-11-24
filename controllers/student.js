const fs = require('fs');

const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Class = require('../models/class');
const Assignment = require('../models/assignment');
const StudentAssignment = require('../models/student-assignment');

exports.getAllClasses = async(req,res,next)=>{
    try{
        const classes = await Class.find().populate('teacher');
        res.render('./student/classes', {
            pageTitle: 'Classes',
            path: '/student/classes',
            formsCSS: true,
            productCSS: true,
            classes : classes,
            id : req.student._id
          });
    }
    catch (err)
    {
        console.log(err);
    }
}

exports.enroll = async(req,res,next)=>{
    const classId = req.body.classId;
    try{
        const cl = await Class.findOne({_id : classId});
        cl.students.student.push(req.student._id);
        console.log(cl.students);
        await cl.save();
        res.redirect('/student/classes');
    }
    catch (err)
    {
        console.log(err);
    }
}

exports.getAssignments = async(req,res,next)=>{
    let classId = req.params.classId;
    try{
        const assignments = await Assignment.find({class : classId });
        const studentAssignments = await StudentAssignment.find({email : req.student.email});
        res.render('./student/assignments', {
            pageTitle: 'Create Assignments',
            path: '/student/assignments',
            formsCSS: true,
            productCSS: true,
            assignments : assignments,
            studentAssignments:  studentAssignments
          });
    }
    catch (err)
    {
        console.log(err);
    }
}

exports.getSubmitForm = async(req,res,next)=>{
    const assignId = req.params.assignId;
    try{
        res.render('./student/assignment-submit-form', {
            pageTitle: 'Create Assignments',
            path: '/student/submit-assignment-form',
            formsCSS: true,
            productCSS: true,
            sname : req.student.name,
            semail : req.student.email,
            rollno : req.student.rollno,
            assignId : assignId
          });
    }
    catch (err)
    {
        console.log(err);
    }
}

exports.getGrade = async(req,res,next)=>{
    const assignId = req.body.assignId;
    const name = req.body.name;
    try{
        const student = await Student.findOne({_id:req.student._id});
        res.render('./student/grade', {
            pageTitle: 'Create Assignments',
            path: '/student/grade',
            formsCSS: true,
            productCSS: true,
            id : assignId,
            tname : name,
            student : student
          });
    }
    catch (err)
    {
        console.log(err);
    }
}

exports.downloadFiles = (req, res) =>{
    Assignment.find({_id:req.query.fileId})
      .then((docs)=>{
        const path = docs[0].file;
        const file = fs.createReadStream(path);
        const filename = docs[0].fileName;
        res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"');
        res.download(path, filename);
      })
      .catch(err=>{
          console.log(err);
      })
}