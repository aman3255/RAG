// Desc: User service file.
const USERSModel = require('./../models/users.model');


// ======= Check if user is present with the given email. =============
const IsUserPresentUsingEmailService = async (email) => { 
    try {
        const user =  await USERSModel.findOne({"email" : email}).exec(); // Find the user with the given email.

        if(user){ // If user is present with the given email then return the user details.
            return {
                success: true,
                data: user
            }
        }else{ // If user is not present then throw an error.
            throw new Error(`Unable to get user detail with email: ${email}`);
        }
        
    } catch (err) { // If any error occurs then return success as false.
        console.log(`Error in IsUserPresentUsingEmailService with error - ${err}`);
        return{
            success: false
        }
    }
}
// ===================================================================================


// ======= Check if user is present with the given userId. =============
const IsUserPresentUsingUserIdService = async (userId) => {
    try {
        const user =  await USERSModel.findOne({"_id" : userId}).exec(); // Find the user with the given userId.

        if(user){ // If user is present with the given userId then return the user details.
            return{
                success: true,
                data: user
            }
        }else{ // If user is not present then throw an error.
            throw new Error(`Unable to get user detail with userId: ${userId}`);
        }
    }catch(err){ // If any error occurs then return success as false.
        console.log(`Error in IsUserPresentUsingUserIdService with error - ${err}`);
        return {
            success: false
        }
    }
}
// ===================================================================================


// 
const CreateNewUserService = async = async (fullName, email, encryptedPassword, organizationId, organizationRole) => {
    try {
        const user =  await USERSModel.create({fullName: fullName, email: email, password: encryptedPassword, organizationId: organizationId, role: organizationRole}); // Create new user with the given details.  

        if(user){ // If user is created successfully then return the user details.
            return{
                success: true,
                data: user
            }
        }else{ // If user is not created then throw an error.
            throw new Error(`Unable to create user with email: ${email}`);
        }
    } catch (err) { // If any error occurs then return success as false.
        console.log(`Error in CreateNewUserService with error - ${err}`);
        return{
            success: false
        }
    }
}

// ======= Delete user with the given userId. =============
const DeleteUserByUserIdService = async (userId) => {
    try {
        const user =  await USERSModel.findByIdAndDelete(userId).exec(); // Find the user with the given userId and delete it.
        if(user){ // If user is deleted successfully then return the user details.
            return{
                success: true,
                data: user
            }
        }else{ // If user is not deleted then throw an error.
            throw new Error(`Unable to delete user with userId: ${userId}`);
        }
    } catch (err) { // If any error occurs then return success as false.
        console.log(`Error in DeleteUserByUserIdService with error - ${err}`);
        return{
            success: false
        }
    }
}
// ===================================================================================

// ======= Fetch organizationId using the given userId. =============
const FetchOrganizationIdUsingTheUserIdService = async (userId) => {
    try {
        const user = await USERSModel.findOne({"_id": userId}).exec(); // Find the user with the given userId.
        if(user){
            return{
                success: true,
                data: user.organizationId
            }
        }else{
            throw new Error(`Unable to get organizationId with userId: ${userId}`);
        }
    } catch (err) {
        console.log(`Error in FetchOrganizationIdUsingTheUserIdService with error - ${err}`);
    }
}
// ===================================================================================


module.exports = {
    IsUserPresentUsingEmailService,
    IsUserPresentUsingUserIdService,
    CreateNewUserService,
    DeleteUserByUserIdService,
    FetchOrganizationIdUsingTheUserIdService
}