import ApplicationHelper from "./application-helper";

class ApplicationConfigHelper extends ApplicationHelper {
    constructor() {
        super()
    }

    getAllApplicationDetails() {
        let self = this;
        let applicationConfigsList = [];
        
        self.applicationList.forEach(application => {
            applicationConfigsList.push(self.getApplicationConfigBySystemCode(application.system_code));
        });
             
        return applicationConfigsList;
    }

    getApplicationConfigBySystemCode(system_code) {
        return require(`@/assets/manifest/application/apps/${system_code}/config.json`);
    }
}

export default ApplicationConfigHelper;