function calculateFor(splitSheetName){
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const splitSheet = ss.getSheetByName(splitSheetName);
  const splitSheetData = splitSheet.getDataRange().getValues();
  const splitSheetHeaders = splitSheetData[0];
  const splitSheetRows = splitSheetData
    .slice(1)
    .filter(row => row[5] === false);

  const participantsActualContribution = {};
  splitSheetRows.forEach(row => {
    const participant = row[2];
    const amount = row[4];

    if(!participantsActualContribution[participant]){
      participantsActualContribution[participant] = 0;
    }

    participantsActualContribution[participant] += amount;
  });

  const participantsExpectedContribution = {};

  const participants = splitSheetHeaders.slice(6).map(header => header.replace("'s Part", ""));
  const participantPartSections = splitSheetRows.map(row => row.slice(6));
  
  participants.forEach((participant, index) => {
    const participantPart = participantPartSections.map(part => part[index]);
    const totalPart = participantPart.reduce((acc, part) => acc + part, 0);
    participantsExpectedContribution[participant] = totalPart;
  });

  const participantsActualMinusExpected = {};
  participants.forEach(participant => {
    const actual = participantsActualContribution[participant] || 0;
    const expected = participantsExpectedContribution[participant] || 0;
    participantsActualMinusExpected[participant] = actual - expected;
  });

  let summarySheet = ss.getSheetByName(splitSheetName.replace("Split-", "Summary-"));
  if (!summarySheet) {
    summarySheet = ss.insertSheet(splitSheetName.replace("Split-", "Summary-"));
  } else {
    summarySheet.clear();
  }

  const summarySheetHeaders = ["Who", "Actual", "Expected", "Difference"];
  const summarySheetRows = participants.map(participant => {
    return [
      participant,
      participantsActualContribution[participant] || 0,
      participantsExpectedContribution[participant] || 0,
      participantsActualMinusExpected[participant]
    ];
  });

  const dataToWrite = [summarySheetHeaders, ...summarySheetRows];
  summarySheet.getRange(1, 1, dataToWrite.length, summarySheetHeaders.length).setValues(dataToWrite);

  SpreadsheetApp.flush();
}
