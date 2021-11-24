const Student = require('../models/student');
const bcrypt = require('bcryptjs');

// Displays the login form for student

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
      message=message[0];
    }
    else{
      message = null;
    }
      res.render('./auth/student-login', {
        pageTitle: 'Login',
        path: '/student/login',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing:false,
        errorMessage : message
      });
};

// Displays the signup form for student

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
      message=message[0];
    }
    else{
      message = null;
    }
    res.render('./auth/student-signup', {
      pageTitle: 'Signup',
      path: '/student/signup',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing:false,
      errorMessage : message
    });
};

// Student Signup function

exports.postSignup = async(req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const branch = req.body.branch;
    const rollno = req.body.rollno;
    let password = req.body.pswd;
    const confirmPassword = req.body.cpswd;

    try
    {
        if(password != confirmPassword)
        {
            req.flash('error','Passwords do not match');
            return res.redirect('/student/signup');
        }
        else if(password.length<6){
            req.flash('error','Password must be at least 6 characters long');
            return res.redirect('/student/signup');
          }
        else
        {
            const student = await Student.findOne({email:email});
            if(student)
            {
                req.flash('error','Email already exists');
                return res.redirect('/student/signup');
            }
            else
            {
                console.log('Student id created');
                password = await bcrypt.hash(password, 12);
                const student = new Student({
                    name: name,
                    email: email,
                    password: password,
                    branch : branch,
                    rollno: rollno
                })
                await student.save();
                
                res.redirect('/student/login');
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }
};

// Student Login function

exports.postLogin = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.pswd;

    try 
    {
        const student = await Student.findOne({email:email});
        if(student)
        {
            const isMatched = await bcrypt.compare(password, student.password);
            if(isMatched)
            {
                req.session.isLoggedIn = true;
                req.session.student = student;
                req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            else
            {
                req.flash('error','Invalid password');
                return res.redirect('/student/login');
            }
        }
        else
        {
            req.flash('error','No user with this email found, please signup first');
            return res.redirect('/student/login');
        }
    }
    catch(err)
    {
        console.log(err);
    }
};

// Student Logout function

exports.postLogout = (req , res , next) => {
    try
    {
        req.session.destroy( (err) => {
            console.log(err);
            res.redirect('/') ;
        })
    }
    catch(err)
    {
        next(err) ;
    }
}