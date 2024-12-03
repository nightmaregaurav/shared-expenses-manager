function groupRawDataByMonth() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName("Raw");
  const sourceData = sourceSheet.getDataRange().getValues();
  
  if (sourceData.length < 2) {
    return [];
  }

  const header = sourceData[0];
  const rows = sourceData.slice(1);
  const monthGroups = {};

  rows.forEach(row => {
    const date = row[5];
    if (!(date instanceof Date)) {
      return;
    }

    const yearMonth = `${date.getFullYear()}-${date.toLocaleString("en-US", { month: "long" })}`;
    if (!monthGroups[yearMonth]) {
      monthGroups[yearMonth] = [];
    }
    monthGroups[yearMonth].push(row);
  });

  Object.keys(monthGroups).forEach(yearMonth => {
    let sheet = ss.getSheetByName(`Raw-${yearMonth}`);
    if (!sheet) {
      sheet = ss.insertSheet(`Raw-${yearMonth}`);
    } else {
      sheet.clear();
    }
    
    const dataToWrite = [header, ...monthGroups[yearMonth]];
    sheet.getRange(1, 1, dataToWrite.length, header.length).setValues(dataToWrite);
  });

  SpreadsheetApp.flush();
  
  return Object.keys(monthGroups).map(yearMonth => `Raw-${yearMonth}`);
}
