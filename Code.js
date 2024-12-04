function CreateForm () {
  const form = createAndGetForm();
  addFormElements(form);
}

function UpdateForm () {
  const form = getForm();
  addFormElements(form);
}

function UpdateSheets () {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const targetSheet = ss.getSheetByName("Raw");
  if (!targetSheet) {
    deleteAllSheetsExcept("Participants");
    return;
  }

  validateSheet();
  const rawSheets = groupRawDataByMonth();
  if (rawSheets.length === 0){
    deleteAllSheetsExcept("Participants", "Raw");
    return;
  }
  rawSheets.forEach(rawSheetName => {
    splitFor(rawSheetName);
    calculateFor(rawSheetName.replace("Raw-", "Split-"));
    getTransactionRecommendationFor(rawSheetName.replace("Raw-", "Summary-"));
  });
}