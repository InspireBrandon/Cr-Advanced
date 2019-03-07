// ////////////////////////////////////////////////////////////////////////////////////////////////////
// A simple library to assist in the conversion of a .csv file to a JSON object
// ////////////////////////////////////////////////////////////////////////////////////////////////////

class csvToDataObject {
  constructor() {

  }

  static objectFromCsv(csvData) {
    let lines = csvData.split('\n');
    let result = [];

    let brokenHeaders = lines[0].split(',');
    let headers = [];

    brokenHeaders.forEach(el => {
      headers.push(el.replace(/ /g, "_").replace(/"/g, "").replace(/\r/g, ""));
    })

    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentLine = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j].replace(/"/g, "").replace(/\r/g, "");
      }

      result.push(obj);
    }

    return result;
  }

  static arrayToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
}

export default csvToDataObject;
