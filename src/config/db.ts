import mongoose from 'mongoose';
 
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed', err);
  }
};
