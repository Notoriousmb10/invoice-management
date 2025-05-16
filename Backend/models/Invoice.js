const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
      type: Number,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    invoiceAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    financialYear: {
      type: String,
      required: true,
    }
}, { timestamps: true });
invoiceSchema.index({invoiceNumber:1, financialYear:1}, { unique: true });
module.exports = mongoose.model('Invoice', invoiceSchema);