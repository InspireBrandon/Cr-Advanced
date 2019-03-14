// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: Common date helper
// Author: Brandon Lange
// Date: 2019/01/30
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Axios from 'axios';
import moment from 'moment';

class DateHelper {
    constructor(serverAddress) {
        let self = this;

        getRetailerDateFormat(serverAddress, format => {
            self.format = format;
        })
    }

    getMonthsBetween(date1, date2) {
        return Math.abs(Math.round(moment(date1).diff(moment(date2), 'months', true)))
    }
}

function getRetailerDateFormat(serverAddress, callback) {
    Axios.get(serverAddress + "RetailerConfig?db=CR-Hinterland-Live")
    .then(r => {
        callback(r.data.periodDateFormat);
    })
}

export default DateHelper;