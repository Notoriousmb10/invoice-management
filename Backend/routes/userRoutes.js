const { authenticateUserr , authorizeDRoles } = require("../middleware/authMiddle");

router.post(
    '/create',
    authenticateUserr,
    authorizeDRoles("SUPERADMIN", "ADMIN", "UNITMANAGER"),
    createUser
)