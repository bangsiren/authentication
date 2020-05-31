const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exhbs = require('express-handlebars');
const { getHashPassward } = require('./utils/passward_hash')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exhbs({extname: '.hbs'}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
var users = [
  {
    firstName:'Bangsi',
    lastName:'Rene',
    email:'bangsir61@gmail.com',
    passward:'YIguSmsvv9olJ2BXhDo4rDUQUfwS9lkZRZhT7kuMpgY='
  }
]
app.get('/', (req,res)=>{
  res.render('home')
});
app.get('/generate',(req,res)=>{
  passward ='Bangsi';
  hashedPassward = getHashPassward(passward)
  res.send(hashedPassward)
})
app.get('/register', (req,res)=>{
  res.render('registration',{
    // message:'This is the registration page',
    // messageClass:'alert-danger'
  })
});

app.post('/register', (req,res)=>{
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  if(password === confirmPassword){
    if(users.find((user=>user.email === email))){
      res.render('registration',{
        message:'User Already Exists',
        messageClass:'alert-warning'
      })
    }else{
      const hashedPassword = getHashPassward(password)
      users.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
      });
      console.log(`Email: ${email} Passward: ${password}`);
      res.render('registration', {
        message:'Successfully Registered',
        messageClass:'alert-success'
      })
      console.log(JSON.stringify(users))
    }
  }else{
   res.render('registration',{
     message:'Passward not matched',
     messageClass:'alert-danger'
   })
  }
});

app.get('/login',(req,res)=>{
  res.render('login', {})
});
app.post('/login',(req,res)=>{
  const {email, password} = req.body
  const hashedPassward = getHashPassward(password)
  if(users.find((user)=> user.email === email && user.password === hashedPassward)){
    res.render('protected')
  }else{
    res.render('login',{
     message:'User does not exists',
     messageClass:'alert-warning'
    })
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000,(er)=>{
  if(er) throw er;
  console.log('listenning on port:3000')
})

module.exports = app;
