const ORGANIZATIONSModel = require('./../models/organizations.model')


// =======  Check if organization is present with the given domain. =============
const IsOrganizationPresentUsingOrgDomainService = async (organizationDomain) => {  
    try {
        const organization =  await ORGANIZATIONSModel.findOne({domain: organizationDomain}).exex(); // Find the organization with the given domain.

        if(organization){
            return {
                success: true,
                data: organization
            }
        }else{
            throw new Error(`Unable to get organization detail with domain: ${organizationDomain}`);
        }
    } catch (err) {
        console.log(`Error in IsOrganizationPresentUsingOrgDomainService with error - ${err}`)
        return{
            success: false
        }
    }
}
// ===================================================================================


// ======= Create new organization with the given domain and name. =============
const CreateNewOrganizationService = async (organizationDomain, organizationName) =>{
    try {
        
        const organizationDetails = { // Create new organization details.
            name: organizationName // Add organization name to the organization details.
        }

        if(organizationDomain){ // If organization domain is present then add it to the organization details.
            organizationDetails.domain = organizationDomain; // Add organization domain to the organization details.
        }

        const organization = await ORGANIZATIONSModel.create(organizationDetails); // Create new organization with the given details.

        if(organization){ // If organization is created successfully then return the organization details.
            return {
                success: true,
                data: organization
            }
        }else{
            throw new Error(`Unable to create organization with name: ${organizationName} and domain: ${organizationDomain}`);
        }
    } catch (err) {
        console.log(`Error in CreateNewOrganizationService with error - ${err}`);
        return {
            success: false
        }
    }
}
// ===================================================================================

module.exports = {
    IsOrganizationPresentUsingOrgDomainService,
    CreateNewOrganizationService
}