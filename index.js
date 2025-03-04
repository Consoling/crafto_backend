
require("dotenv").config();
const express = require('express')
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

const PORT = process.env.CRAFTO_MAINLINE_SERVER_PORT;
const dbURI = process.env.CRAFTO_MONGODB_SERVER_URI;

const indexRouter = require('./routes/index');
const initialSignupRouter = require('./routes/initial-signup');
const signupRouter = require('./routes/signup');
const otpAuthRouter = require('./routes/otp-auth');
const resendOTPRouter = require('./routes/resend-otp');
const tokenGenRouter = require('./routes/session-creation');
const updateProfileRouter = require('./routes/update-profile')
const loginRouter = require('./routes/sign-in');
const logoutRouter = require('./routes/sign-out');
const getDataRouter = require('./routes/fetch-data')
const updateDataRouter = require('./routes/update-data')

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/api/v1/initial-signup', initialSignupRouter)
app.use('/api/v1/otp-auth', otpAuthRouter)
app.use('/api/v1/resend-otp', resendOTPRouter)
app.use('/api/v1/generate-token', tokenGenRouter)
app.use('/api/v1/update-profile', updateProfileRouter)
app.use('/api/v1/login', loginRouter)
app.use('/api/v1/logout', logoutRouter)

app.use('/api/v1/user', getDataRouter)
app.use('/api/v1/user', updateDataRouter)

mongoose.connect(dbURI)
    .then(() => {
        console.log('Crafto MongoDB Server running successfully ✅');
    })
    .catch(err => {
        console.error('🔴Crafto MongoDB Server connection error:', err);
    });

app.listen(PORT, (err) => {
    if (err) (
        console.error('🔴Crafto Mainline Server stopped due to:', err)
    )
    console.log(`Crafto Mainline Server Running on ${PORT} ✅`)
})