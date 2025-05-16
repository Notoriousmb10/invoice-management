const express = require("express");
const router = express.Router();
const { authenticateUserr , authorizeDRoles } = require("../middleware/authMiddle");
const {
    createUser,
    updateUser,
    deleteUser,
    listUsers
} = require("../controllers/userController");
router.post(
    '/create',
    authenticateUserr,
    authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER"),
    createUser
)

router.patch(
    "/update-role",
    authenticateUserr,
    authorizeDRoles("SUPERADMIN", "ADMIN"),
    updateUser
);

router.delete(
    "/:userId",
    authenticateUserr,
    authorizeDRoles("SUPERADMIN", "ADMIN"),
    deleteUser
);

router.get(
    '/',
    authenticateUserr,
    authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER"),
    listUsers
)

module.exports = router;