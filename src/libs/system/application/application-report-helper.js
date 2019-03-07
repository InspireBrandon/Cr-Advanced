import ApplicationConfigHelper from "./application-config-helper";

class ApplicationReportHelper extends ApplicationConfigHelper {
    constructor() {
        super()
    }

    getAllReports() {
        let self = this
        let reportList = [];

        self.applicationList.forEach(application => {
            // Get application config
            let applicationConfig = self.getApplicationConfigBySystemCode(application.system_code);
            if (applicationConfig.report == true) {
                reportList.push(self.getReportConfig(application.system_code));
            }
        });

        return reportList
    }

    getReportConfig(system_code) {

        return require(`@/assets/manifest/application/apps/${system_code}/Reports/reportConfig.json`);

    }
}
export default ApplicationReportHelper;