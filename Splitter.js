function splitFor(rawSheetName){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(rawSheetName);
  const sourceData = sourceSheet.getDataRange().getValues();
  const rows = sourceData.slice(1);
  
  const participants =  getParticipants(rows);
  const participantsHeaders = participants.map(name => `${name}'s Part`);
  const splitSheetHeaders = ["Timestamp", "Date", "Who", "Why", "Amount", ...participantsHeaders];
  
  const splitSheetRows = rows.map(row => {
    const transactionRecordedTimestamp = row[0];
    const transactionDoneBy = row[1];
    const transactionReason = row[2];
    const transactionAmount = row[3];
    const transactionParticipants = row[4].split(", ");
    const transactionDate = row[5];

    const participantPart = participants.map(participant => {
      if(transactionParticipants.includes(participant)){
        return transactionAmount / transactionParticipants.length;
      } else {
        return 0;
      }
    });

    return [
      transactionRecordedTimestamp,
      transactionDate,
      transactionDoneBy,
      transactionReason,
      transactionAmount,
      ...participantPart
    ];
  });

  let splitSheet = ss.getSheetByName(rawSheetName.replace("Raw-", "Split-"));
  if (!splitSheet) {
    splitSheet = ss.insertSheet(rawSheetName.replace("Raw-", "Split-"));
  } else {
    splitSheet.clear();
  }

  const dataToWrite = [splitSheetHeaders, ...splitSheetRows];
  splitSheet.getRange(1, 1, dataToWrite.length, splitSheetHeaders.length).setValues(dataToWrite);

  SpreadsheetApp.flush();
}