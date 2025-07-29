import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './Router/UserRoute.js'
import adminRoute from './Router/TempMalik.js'
import orderRoute from './Router/SellRoute.js'
import connectDB from './Database/ConnectDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

connectDB();



// CORS for frontend (React/Vite)
const allowedOrigins = [
  'https://kabadiwala.onrender.com',
  'https://kabadiwala-1.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

app.use(`/user`, userRoutes);
app.use(`/admin`, adminRoute);
app.use(`/order`, orderRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
