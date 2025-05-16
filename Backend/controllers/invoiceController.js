const Invoice = require("../models/Invoice");
const getFinancialYear = require("../utils/getFinancialYear");
const User = require("../models/User");

const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, invoiceDate, invoiceAmount } = req.body;
    if (!invoiceNumber || !invoiceDate || !invoiceAmount) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const fy = getFinancialYear(invoiceDate);
    const exitising = await Invoice.findOne({
      invoiceNumber,
      financialYear: fy,
    });
    if (exitising) {
      return res.status(400).json({ msg: "Invoice already exists" });
    }

    const prevv = await Invoice.findOne({
      financialYear: fy,
      invoiceNumber: invoiceNumber - 1,
    });

    const next = await Invoice.findOne({
      financialYear: fy,
      invoiceNumber: invoiceNumber + 1,
    });
    const newDate = new Date(invoiceDate);
    if (prevv && prevv.invoiceDate > newDate) {
      return res.status(400).json({
        msg: "Invoice date should be greater than previious invoice date",
      });
    }
    if (next && newDate > new Date(next.invoiceDate)) {
      return res
        .status(400)
        .json({ msg: `Date should be <= ${next.invoiceDate}` });
    }
    const invoiceNew = new Invoice({
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear: fy,
      createdBy: req.user.userId,
    });
    await invoiceNew.save();
    res.status(201).json({ msg: "Invoice created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error for creating error" });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const { invoiceDate, invoiceAmount } = req.body;

    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate;
    invoice.invoiceAmount = invoiceAmount || invoice.invoiceAmount;

    await invoice.save();
    res.json({ msg: "Invoice updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error for updating invoice" });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    const invoice = await Invoice.findOneAndDelete({ invoiceNumber });
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });

    res.json({ msg: "Invoice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting invoice" });
  }
};

const listallInvoices = async (req, res) => {
  try {
    const { fy, startDate, endDate, invoiceNumber, invoiceAmount } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    const requester = req.user;
    let allowedUserIds = [];

    if (requester.role === "SUPERADMIN") {
    } else if (requester.role === "ADMIN") {
      let adminGroupAdmins = [requester.userId];
      if (requester.groupId) {
        const adminInGroups = await User.find({
          groupId: requester.groupId,
          role: "ADMIN",
        }).select("_id");
        adminGroupAdmins = adminInGroups.map((a) => a._id.toString());
      }
      const unitManagers = await User.find({
        role: "UNITMANAGER",
        createdBy: { $in: adminGroupAdmins },
      }).select("_id");
      const unitManagerIds = unitManagers.map((um) => um._id.toString());

      const users = await User.find({
        role: "USER",
        createdBy: { $in: unitManagerIds },
      }).select("_id");
      const userIds = users.map((u) => u._id.toString());

      allowedUserIds = [...adminGroupAdmins, ...unitManagerIds, ...userIds];
      filter.createdBy = { $in: allowedUserIds };
    } else if (requester.role === "UNITMANAGER") {
      let unitManagersInGroup = [requester.userId];
      if (requester.groupBy) {
        const ums = await User.find({
          role: "UNITMANAGER",
          groupBy: requester.groupBy,
        }).select("_id");
        unitManagersInGroup = ums.map((um) => um._id.toString());
      }
      const users = await User.find({
        role: "USER",
        createdBy: { $in: unitManagersInGroup },
      }).select("_id");
      const userIds = users.map((u) => u._id.toString());

      allowedUserIds = [...unitManagersInGroup, ...userIds];
      filter.createdBy = { $in: allowedUserIds };
    } else if (requester.role === "USER") {
      filter.createdBy = requester.userId;
    }

    if (fy) {
      filter.financialYear = fy;
    }
    if (invoiceNumber) {
      filter.invoiceNumber = invoiceNumber;
    }
    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const invoices = await Invoice.find(filter)
    // .populate({path: "createdBy", select: "username role userId"})
      .limit(limit)
      .skip(skip)
      .sort({ invoiceDate: -1 });

    res.json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error for listing invoices" });
  }
};

module.exports = {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  listallInvoices,
};
