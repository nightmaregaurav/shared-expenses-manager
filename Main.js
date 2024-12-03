function Main () {
  validateSheet();
  const rawSheets = groupRawDataByMonth();
  if (rawSheets.length === 0){
    deleteAllSheetsExcept("Raw");
    return;
  }
  rawSheets.forEach(rawSheetName => {
    splitFor(rawSheetName);
    calculateFor(rawSheetName.replace("Raw-", "Split-"));
    getTransactionRecommendationFor(rawSheetName.replace("Raw-", "Summary-"));
  });
}
