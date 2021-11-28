const path= require ('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser') ;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const Teacher = require('./models/teacher');
const Student = require('./models/student');

const indexRoute = require('./routers/index') ;
const teacherAuthRoute = require('./routers/teacher-auth');
const studentAuthRoute = require('./routers/student-auth');
const teacherRoutes = require('./routers/teacher');
const studentRoutes = require('./routers/student');

const MONGODB_URI = `mongodb+srv://classroom:classroom@cluster0.kqlrm.mongodb.net/classroom?retryWrites=true&w=majority`;

const app = express() ;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname ,'public'))) ;

app.use(
    session({ 
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false ,
        store: store
    })
);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(flash());

app.use(async (req , res , next) => {
    if(req.session.teacher)
    {
        const id = req.session.teacher._id ;
        const teacher = await Teacher.findById(id) ;
        if(teacher)
        {
            req.teacher = teacher;
            res.locals.teacher= true;
            res.locals.student = false;
        }
    }
    next() ;
});

app.use(async (req , res , next) => {
    if(req.session.student)
    {
        const id = req.session.student._id ;
        const student = await Student.findById(id) ;
        if(student)
        {
            req.student = student;
            res.locals.teacher= false;
            res.locals.student = true;
        }
    }
    next() ;
});

app.use(async(req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use(indexRoute) ;
app.use('/teacher',teacherAuthRoute) ;
app.use('/student',studentAuthRoute) ;
app.use('/teacher',teacherRoutes);
app.use('/student',studentRoutes);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true,  useUnifiedTopology: true })
.then(result=>{
    console.log('Connected');
    app.listen(process.env.PORT || 5000);
})
.catch(err=>{
    console.log(err);
});