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

function warnAndHideSheetsExceptRawAndNonEmptyRecommendation() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();

  sheets.forEach(sheet => {
    const name = sheet.getName();
    const isRaw = name === "Raw";
    const isRecommendation = name.startsWith("Recommendation");

    const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    protections.forEach(p => p.remove());

    const protection = sheet.protect();
    protection.setWarningOnly(true);
    protection.setDescription("⚠️ This sheet is protected to prevent accidental edits. Please proceed only if you're sure.");

    if (!isRaw && !isRecommendation) {
      sheet.hideSheet();
    } else if (isRecommendation && sheet.getLastRow() <= 1) {
      sheet.hideSheet();
    } else {
      sheet.showSheet();
    }
  });
}
