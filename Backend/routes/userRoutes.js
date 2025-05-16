const express = require("express");
const { authenticateUserr , authorizeDRoles } = require("../middleware/authMiddle");
import { createUser } from "../controllers/userController";
import {
    createUser,
    updateUser,
    deleteUser,
    listUsers
} from "../controllers/userController";
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
    deleteUserget
);

router.get(
    '/',
    authenticateUserr,
    authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER"),
    listUsers
)

module.exports = router;