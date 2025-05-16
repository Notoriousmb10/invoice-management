const express = require("express");
const router = express.Router();
const {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  listallInvoices,
} = require("../controllers/invoiceController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("ADMIN", "UNITMANAGER", "USER"),
  createInvoice
);

router.patch(
  "/update/:invoiceNumber",
  authenticateUser,
  authorizeRoles("ADMIN", "UNITMANAGER"),
  updateInvoice
);

router.delete(
  "/delete/:invoiceNumber",
  authenticateUser,
  authorizeRoles("ADMIN", "UNITMANAGER"),
  deleteInvoice
);

router.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "UNITMANAGER", "USER"),
  listallInvoices
);

module.exports = router;
