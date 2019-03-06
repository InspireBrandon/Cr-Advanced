import ApplicationHelper from "./application-helper";

class ApplicationDetailsHelper extends ApplicationHelper {
    constructor() {
        super()
    }

    getAllApplicationDetails() {
        let self = this;
        let applicationDetailsList = [];
        
        self.applicationList.forEach(application => {
            applicationDetailsList.push(self.getApplicationDetailsBySystemCode(application.system_code));
        });

        return applicationDetailsList;
    }

    getApplicationDetailsBySystemCode(system_code) {
        return require(`@/assets/manifest/application/apps/${system_code}/details.json`);
    }
}

export default ApplicationDetailsHelper;