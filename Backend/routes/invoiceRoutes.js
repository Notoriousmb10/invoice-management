const express = require("express");
const router = express.Router();
const {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  listallInvoices,
} = require("../controllers/invoiceController");

const {
  authenticateUserr,
  authorizeDRoles,
} = require("../middleware/authMiddle");

router.post(
  "/create",
  authenticateUserr,
  authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER", "USER"),
  createInvoice
);

router.patch(
  "/update/:invoiceNumber",
  authenticateUserr,
  authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER"),
  updateInvoice
);

router.delete(
  "/delete/:invoiceNumber",
  authenticateUserr,
  authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER"),
  deleteInvoice
);

router.get(
  "/",
  authenticateUserr,
  authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER", "USER"),
  listallInvoices
);

module.exports = router;
