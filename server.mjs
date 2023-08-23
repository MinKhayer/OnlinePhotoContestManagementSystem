import express from 'express';
import cors from 'cors';
import contests from './routes/contests.mjs';
import registerRoute from './routes/registerRoute.mjs';
import loginRoute from './routes/loginRoute.mjs';
import logout from './routes/logout.mjs'
import sslcommerz from './routes/sslcomerz.mjs';
import cookieParser from 'cookie-parser';
import path from "path"

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
  };
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/contest', contests);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/payment',sslcommerz);
app.use('/logout',logout);
app.use(express.static(path.resolve('images','pending')));
console.log(path.resolve('images','pending'));



app.listen(PORT, ()=>{
    console.log("Server is running on: ",PORT);
})