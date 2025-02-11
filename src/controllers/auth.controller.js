const { IsUserPresentUsingEmailService, CreateNewUserService } = require('./../services/user.service');
const CheckEmailDomainIsPersonalOrNotUtil = require('./../utils/auth.utils');
const { IsOrganizationPresentUsingOrgDomainService, CreateNewOrganizationService} = require('./../services/organization.service');
// ======================================================================================================================================
require('dotenv').config(); // Import and configure dotenv package.
const NODE_ENV = process.env.NODE_ENV; // Get the value of NODE_ENV from .env file.
const JWT_SECRET_KEY = process.env[`${NODE_ENV}_JWT_SECRET_KEY`]; // Get the value of JWT_SECRET_KEY from .env file.
const bcrypt = require('bcrypt'); // Import bcrypt package to hash the password.
const jwt = require('jsonwebtoken');
// ======================================================================================================================================

const SignupController = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // =================== Error Handling ===================
        if (!fullName) {
            const err = new Error("Full name is required");
            err.statusCode = 400;
            throw err;
        }

        if (!email) {
            const err = new Error("Email is required");
            err.statusCode = 400;
            throw err;
        }

        if (!password) {
            const err = new Error("Password is required");
            err.statusCode = 400;
            throw err;
        }
        // ======================================================

        // ===== Check if user already exists with this email.=====
        const IsUserPresentUsingEmailServiceResult = await IsUserPresentUsingEmailService(email);
        if (IsUserPresentUsingEmailServiceResult.success) {
            const err = new Error("User already exists with this email");
            err.statusCode = 400;
            throw err;
        }
        // ========================================================

        const emailDomain = email.split("@")[1]; // Get the domain from email.

        // ===================== Check if email domain is personal or not. ==================================
        const CheckEmailDomainIsPersonalOrNotUtilResult = await CheckEmailDomainIsPersonalOrNotUtil(emailDomain);
        if (CheckEmailDomainIsPersonalOrNotUtilResult.success) {
            res.status(201).json({
                success: true,
                message: "Email domain is personal"
            });
        } else {
            const organizationDomain = emailDomain;
            const organizationName = emailDomain.split(".")[0].toUpperCase();
            let organizationId;
            let organizationRole = "ORG_MEMBER";

            // ====== Check if organization is already present with this domain or not. ======
            const IsOrganizationPresentUsingOrgDomainServiceResult = await IsOrganizationPresentUsingOrgDomainService(organizationDomain);
            if (IsOrganizationPresentUsingOrgDomainServiceResult.success) {
                organizationId = IsOrganizationPresentUsingOrgDomainServiceResult.data._id;
            } else {
                const CreateNewOrganizationServiceResult = await CreateNewOrganizationService(organizationDomain, organizationName);
                if (!CreateNewOrganizationServiceResult.success) {
                    const err = new Error(`Unable to create organization with name: ${organizationName} and domain: ${organizationDomain}`);
                    err.statusCode = 500;
                    throw err;
                }
                organizationId = CreateNewOrganizationServiceResult.data._id;
                organizationRole = "ORG_ADMIN";
            }
        }
        // ===================================================================================

        // ====== Hash the password ======
        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(password, salt);
        // =================================

        // ====== Create new user =======
        const CreateNewUserServiceResult = await CreateNewUserService(fullName, email, encryptedPassword, organizationId, organizationRole);
        if (!CreateNewUserServiceResult.success) {
            const err = new Error(`Unable to create the user with this email: ${email}`);
            err.statusCode = 500;
            throw err;
        }

        const { fullName: fullNameDB, email: emailDB, organizationId: organizationIdDB, _id: userId } = CreateNewUserServiceResult.data;

        res.status(201).json({
            success: true,
            message: "User created successfully !!!",
            data: {
                fullName: fullNameDB,
                email: emailDB,
                organizationId: organizationIdDB,
                userId
            }
        });

    } catch (err) {
        console.log(`Error in SignupController with error - ${err}`);
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        });
    }
};

const SigninController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // =================== Error Handling ===================
        if (!email) {
            const err = new Error('Email is required');
            err.statusCode = 400;
            throw err;
        }

        if (!password) {
            const err = new Error('Password is required');
            err.statusCode = 400;
            throw err;
        }
        // ======================================================

        // ===== Check if user is present with this email or not. =====
        const IsUserPresentUsingEmailServiceResult = await IsUserPresentUsingEmailService(email);
        if (!IsUserPresentUsingEmailServiceResult.success || !IsUserPresentUsingEmailServiceResult.data) {
            const err = new Error("User not found with this email");
            err.statusCode = 404;
            throw err;
        }
        // ============================================================

        // ====== Get user details =======
        const { fullName, email: emailInDB, password: encryptedPasswordInDB, _id: userId, organizationId, role } = IsUserPresentUsingEmailServiceResult.data;

        const passwordCheck = await bcrypt.compare(password, encryptedPasswordInDB);
        if (!passwordCheck) {
            const err = new Error("Password is incorrect OR Invalid Credentials");
            err.statusCode = 400;
            throw err;
        }

        // ====== Create JWT Token =====
        const payload = {
            userId,
            role
        };
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '5m' });

        res.status(201).json({
            success: true,
            token: token
        });

    } catch (err) {
        console.log(`Error in SigninController with error - ${err}`);
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    SignupController,
    SigninController
};
