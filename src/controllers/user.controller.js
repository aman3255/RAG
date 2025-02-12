const { IsUserPresentUsingUserIdService, DeleteUserByUserIdService } = require("./../services/user.service");


// This controller is used to delete a user by userId.
const DeleteUserByUserIdController = async (req, res) => {
    try {
        const { userId: userIdToDelete } = req.params; // Get the value of userId from the request params.

        const adminUserId = req.userId; // Get the value of userId from the request object.

        const AdminDetail = await IsUserPresentUsingUserIdService(adminUserId); // Check if user is present using userId.
        const UserToDeleteDetail = await IsUserPresentUsingUserIdService(userIdToDelete); // Check if user is present using userId.

        const orgIdofAdmin = AdminDetail.data.organizationId; // Get the organizationId of adminUserId.

        const orgIdofUserToDelete = UserToDeleteDetail.data.organizationId; // Get the organizationId of userIdToDelete.

        // check organization of adminUserId and userIdToDelete is same or not, if not same throw err
        if (!orgIdofAdmin.equals(orgIdofUserToDelete)) { // Check if organizationId of admin and user to delete is same or not.
            const err = new Error(`Invalid request`);
            err.statusCode = 403;
            throw err;
        }

        const DeleteUserByUserIdServiceResult = await DeleteUserByUserIdService(userIdToDelete); // Delete user by userId.
        if (!DeleteUserByUserIdServiceResult.success) { // Check if user is deleted successfully or not.
            const err = new Error(`Unable to delete user with userId - ${userIdToDelete}`);
            err.statusCode = 500;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: `User with userId - ${userIdToDelete} deleted successfully.`
        })

    } catch (err) {
        console.log(`Error in DeleteUserByUserIdController with error - ${err.message}`);

        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = DeleteUserByUserIdController; // Export DeleteUserByUserIdController.