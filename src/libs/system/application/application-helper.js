// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: To allow the user to have full access of all the applications within the system 
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class ApplicationHelper {
    constructor() {
        this.applicationList = require('@/assets/manifest/application/app_manifest.json');
    }

    getAllApplications() {
        return this.applicationList;
    }
}

export default ApplicationHelper;