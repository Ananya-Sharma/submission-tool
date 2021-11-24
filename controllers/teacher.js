const fs = require('fs');

const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Class = require('../models/class');
const Assignment = require('../models/assignment');
const StudentAssignment = require('../models/student-assignment');

//Displays the from to create a class

exports.getCreateClass = (req, res, next) => {
      res.render('./teacher/create-class', {
        pageTitle: 'Create class',
        path: '/teacher/create-class',
        formsCSS: true,
        productCSS: true,
      });
};

// Function to create a class

exports.postClass = async(req,res,next)=>{
    const className = req.body.name;
    const branch = req.body.branch;
    try{
        const teacher = await Teacher.findOne({email:req.teacher.email});
        if(teacher){
            const cl = new Class({
                className: className,
                branch: branch,
                teacher : teacher._id
            });
            await cl.save();
            res.redirect('/teacher/classes');
        }
    }
    catch (err)
    {
        console.log(err);
    }
};

// Function to display all the classes created by the logged in teacher

exports.getAllClasses = async(req,res,next)=>{
    try{
        const classes = await Class.find({teacher:req.teacher._id}).populate('teacher');
        res.render('./teacher/classes', {
            pageTitle: 'Classes',
            path: '/teacher/classes',
            formsCSS: true,
            productCSS: true,
            classes : classes
          });
    }
    catch (err)
    {
        console.log(err);
    }
};

// Function to delete a class (Can be done only by teacher who created the class)

exports.deleteClass = async(req,res,next)=>{
    const classId = req.body.classId;
    try{
        await Class.deleteOne({_id:classId,teacher: req.teacher._id});
        res.redirect('/teacher/classes');
    }
    catch (err)
    {
        console.log(err);
    }
}

// Function to delete the assignment

exports.deleteAssignment = async(req,res,next)=>{
    const assignId = req.body.assignId;
    try{
        await Assignment.deleteOne({_id:assignId});
        res.redirect('/teacher/classes');
    }
    catch (err)
    {
        console.log(err);
    }
}

// Displays the form to create an assignment

exports.getCreateAssignment = async(req,res,next)=>{
    const classId = req.params.classId;
    try{
        const cl = await Class.findById(classId).populate('teacher');
        res.render('./teacher/create-assignments', {
            pageTitle: 'Create Assignments',
            path: '/teacher/create-assignments',
            formsCSS: true,
            productCSS: true,
            cl :cl
          });
    }
    catch (err)
    {
        console.log(err);
    }
};

// Displays the assignments created by teacher for a class as well as the list of students enrolled

exports.getAssignments = async(req,res,next)=>{
    let classId = req.params.classId;
    let ObjectId = require('mongodb').ObjectId;
    classId = new ObjectId(classId);
    try{
        const assignments = await Assignment.find({class : classId });
        Class.findOne({_id : classId}).populate({path:'students', populate:{path:'student',model : 'Student'}}).exec(function(err,cl){
            const st = cl.students.student;
             res.render('./teacher/assignments', {
            pageTitle: 'Create Assignments',
            path: '/teacher/assignments',
            formsCSS: true,
            productCSS: true,
            assignments : assignments,
            students : st
          });
        });
    }
    catch (err)
    {
        console.log(err);
    }
}

// Displays the page which shows the number of students who have submitted the assignments, along with their name, roll no, assignment, and grade(given by the teacher)

exports.getAssignmentDetails = async(req,res,next)=>{
    try{
        const students = await Student.find();
        const assignments = await StudentAssignment.find({assignment : req.query.aId });
        res.render('./teacher/student-table', {
            pageTitle: 'Create Assignments',
            path: '/teacher/assignment-details',
            formsCSS: true,
            productCSS: true,
            assignments : assignments,
            students : students
          });
    }
    catch (err)
    {
        console.log(err);
    }
}

// Function to download assignment given by teacher to students

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

// Function to download assignments submitted by students

exports.downloadStudentFiles = (req, res) =>{
    StudentAssignment.find({_id:req.query.fileId})
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

// Function to give the grade for an assignment to student

exports.postGrade = async(req,res,next) =>{
    const grade = req.body.grade;
    const assignId = req.body.assignId;
    const email = req.body.email;
    try{
        const student = await Student.findOne({email:email});
        if(student){
            student.assignments.assignment.push({assignmentId : assignId,grade : grade});
            await student.save();
            res.redirect('/teacher/classes');
        }
    }
    catch (err)
    {
        console.log(err);
    }
}