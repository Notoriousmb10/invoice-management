const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRouteshandle = require('./routes/userRouteshandle');
const invoiceRouteshandle = require('./routes/invoiceRouteshandle');
const authRouteshandle = require('./routes/authRouteshandle');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouteshandle);
app.use("/api/user", userRouteshandle);
app.use("/api/invoice", invoiceRouteshandle);

mongoose.connect(process.env.MONGODB_RI, {
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

