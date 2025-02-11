

const DeleteUserByUserIdController = async (req, res) => {
    try {
        const { userId : userIdToDelete } = req.params; // Get the value of userId from the request params.
        
    } catch (err) {
        console.log(`Error in DeleteUserByUserIdController with error - ${err.message}`);

        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = DeleteUserByUserIdController; // Export DeleteUserByUserIdController.