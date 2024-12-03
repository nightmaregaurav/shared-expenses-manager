function getTransactionRecommendationFor(summarySheetName){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const summarySheet = ss.getSheetByName(summarySheetName);
  const summarySheetData = summarySheet.getDataRange().getValues();
  const summarySheetRows = summarySheetData.slice(1);

  const diffMap = summarySheetRows.map(row => {
    const participant = row[0];
    const difference = row[3];
    return {
      "name": participant,
      "weight": difference
    };
  });

  const weightMap = {};
  diffMap.forEach(diff => {
    weightMap[diff.name] = diff.weight;
  });

  const recommendation = findTransitiveWeightSequence(weightMap);
  let recommendationSheet = ss.getSheetByName(summarySheetName.replace("Summary-", "Recommendation-"));
  if (!recommendationSheet) {
    recommendationSheet = ss.insertSheet(summarySheetName.replace("Summary-", "Recommendation-"));
  } else {
    recommendationSheet.clear();
  }

  const recommendationSheetHeaders = ["From", "To", "Amount"];
  const recommendationSheetRows = recommendation.map(transaction => {
    return [
      transaction.from,
      transaction.to,
      transaction.amount
    ];
  });

  const dataToWrite = [recommendationSheetHeaders, ...recommendationSheetRows];
  recommendationSheet.getRange(1, 1, dataToWrite.length, recommendationSheetHeaders.length).setValues(dataToWrite);

  SpreadsheetApp.flush();
}