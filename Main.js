const FORM_ID = "";

function UpdateSheets () {
  validateSheet();
  const rawSheets = groupRawDataByMonth();
  if (rawSheets.length === 0){
    deleteAllSheetsExcept("Participants", "FormInfo", "Raw");
    return;
  }
  rawSheets.forEach(rawSheetName => {
    splitFor(rawSheetName);
    calculateFor(rawSheetName.replace("Raw-", "Split-"));
    getTransactionRecommendationFor(rawSheetName.replace("Raw-", "Summary-"));
  });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const sortedSheets = ["FormInfo", "Participants", "Raw"];
  rawSheets.forEach(rawSheetName => {
    sortedSheets.push(rawSheetName.replace("Raw-", "Recommendations-"));
    sortedSheets.push(rawSheetName.replace("Raw-", "Summary-"));
    sortedSheets.push(rawSheetName.replace("Raw-", "Split-"));
    sortedSheets.push(rawSheetName.replace("Raw-", "Raw-"));
  });

  sheets.forEach(sheet => {
    setActiveSheet(sheet);
    if (sortedSheets.includes(sheet.getName())){
      ss.moveActiveSheet(sortedSheets.indexOf(sheet.getName()) + 1);
    }
  });
}

function CreateForm () {
  const form = createAndGetForm();
  addFormElements(form);
  saveFormInfoToSheet(form);
}

function UpdateForm () {
  const form = getForm();
  addFormElements(form);
  saveFormInfoToSheet(form);
}
