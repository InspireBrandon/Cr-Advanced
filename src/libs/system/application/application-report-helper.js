import ApplicationDetailsHelper from "./application-details-helper";

class ApplicationReportHelper extends ApplicationDetailsHelper {
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
                let cfg = self.getReportConfig(application.system_code)
                cfg.forEach(element => {
                    reportList.push(self.getReport(application.system_code, element.system_report_code))
                })
            }

        });

        return reportList
    }

    getApplicationReports(system_code) {

        return require(`@/assets/manifest/application/apps/${system_code}/Reports/reportConfig.json`);

    }
    getReportConfig(system_code, system_report_code) {
        return require(`@/assets/manifest/application/apps/${system_code}/Reports/${system_report_code}.json`);

    }
    
}
export default ApplicationReportHelper;