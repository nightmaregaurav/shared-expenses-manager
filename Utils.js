function getCellValue(sheetName, cellAddress) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet with name "${sheetName}" does not exist!`);
  }

  const value = sheet.getRange(cellAddress).getValue();
  return value;
}

function getParticipants(rows) {
  return rows
    .map(row => row[4])
    .reduce((acc, namesString) => {
      const names = namesString.split(", ");
      for (const name of names) {
        if (!acc.includes(name)) {
          acc.push(name);
        }
      }
      return acc;
    }, []);
}

function deleteAllSheetsExcept(...sheetNames) {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    if (!sheetNames.includes(sheetName)) {
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
    }
  });
}