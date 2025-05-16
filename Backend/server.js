const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/invoice", invoiceRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on the port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDb:', error);
  });

