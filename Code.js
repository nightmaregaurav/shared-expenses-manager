function CreateForm () {
  const form = createAndGetForm();
  addFormElements(form);
}

function UpdateForm (e) {
  if (e && e.changeType === 'OTHER') {
    return;
  }
  const form = getForm();
  if(!form){
    return;
  }
  addFormElements(form);
}

function UpdateSheets (e) {
  if (e && e.changeType === 'OTHER') {
    return;
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const targetSheet = ss.getSheetByName("Raw");
  if (!targetSheet) {
    deleteAllSheetsExcept("Participants", "Raw");
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

  warnAndHideSheetsExceptRawAndNonEmptyRecommendation();
}
