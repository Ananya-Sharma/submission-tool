const Teacher = require('../models/teacher');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
      message=message[0];
    }
    else{
      message = null;
    }
      res.render('./auth/teacher-login', {
        pageTitle: 'Login',
        path: '/teacher/login',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing:false,
        errorMessage : message
      });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
      message=message[0];
    }
    else{
      message = null;
    }
    res.render('./auth/teacher-signup', {
      pageTitle: 'Signup',
      path: '/teacher/signup',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing:false,
      errorMessage : message
    });
};

exports.postSignup = async(req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.pswd;
    const confirmPassword = req.body.cpswd;

    try
    {
        if(password != confirmPassword)
        {
            req.flash('error','Passwords do not match');
            return res.redirect('/teacher/signup');
        }
        else if(password.length<6){
            req.flash('error','Password must be at least 6 characters long');
            return res.redirect('/teacher/signup');
          }
        else
        {
            const teacher = await Teacher.findOne({email:email});
            if(teacher)
            {
                req.flash('error','Email already exists');
                return res.redirect('/teacher/signup');
            }
            else
            {
                console.log('Teacher id created');
                password = await bcrypt.hash(password, 12);
                const teacher = new Teacher({
                    name: name,
                    email: email,
                    password: password
                })
                await teacher.save();
                
                res.redirect('/teacher/login');
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }
};

exports.postLogin = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.pswd;

    try 
    {
        const teacher = await Teacher.findOne({email:email});
        if(teacher)
        {
            const isMatched = await bcrypt.compare(password, teacher.password);
            if(isMatched)
            {
                req.session.isLoggedIn = true;
                req.session.teacher = teacher;
                req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            else
            {
                req.flash('error','Invalid password');
                return res.redirect('/teacher/login');
            }
        }
        else
        {
            req.flash('error','No user with this email found, please signup first');
            return res.redirect('/teacher/login');
        }
    }
    catch(err)
    {
        console.log(err);
    }
};

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