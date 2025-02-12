function createAndGetForm () {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName("Raw");
  if(rawSheet){
    throw new Error("Comment this line if you know what are doing!");
    var rawFormUrl = rawSheet.getFormUrl();
    if (rawFormUrl){
      FormApp.openByUrl(rawFormUrl).removeDestination();
    }
    ss.deleteSheet(rawSheet);
  }

  const spreadsheetFile = DriveApp.getFileById(ss.getId())
  const spreadsheetFileName = spreadsheetFile.getName();
  form = FormApp.create(spreadsheetFileName);
  form.setDescription("Form to record shared expenses so we can figure out who owes whom and how much.")
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  SpreadsheetApp.flush();

  const formUrl = form.getEditUrl().replace("edit", "viewform");
  const formSheet = ss.getSheets().find(s => s.getFormUrl() == formUrl);
  if (formSheet) {
    formSheet.setName("Raw");
    formSheet.getRange("G1").setValue("Settled?");
  }

  const formFile = DriveApp.getFileById(form.getId())
  const parentFolder = spreadsheetFile.getParents().next();
  formFile.moveTo(parentFolder);
  
  return form;
}

function getForm () {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName("Raw");
  if(!rawSheet){
    return;
  }

  const rows = rawSheet.getRange("A2:A").getValues();
  rows.forEach((row, rowIndex) => {
    if (row[0] !== "") {
      rawSheet.getRange(`G${rowIndex+2}`).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
    }
  });

  const formUrl = rawSheet.getFormUrl();
  if(!formUrl){
    return;
  }

  return FormApp.openByUrl(formUrl);
}

function addFormElements(form) {
  const existingFormItems = form.getItems();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let participantsSheet = ss.getSheetByName("Participants");
  if(!participantsSheet) {
    participantsSheet = ss.insertSheet("Participants");
  }

  const firstColumn = participantsSheet.getRange("A2:A").getValues();
  const participants = firstColumn.map(row => row[0]).filter(cell => cell !== "");
  if (participants.length === 0){
    participants.push("please");
    participants.push("add");
    participants.push("participants name");
    participants.push("in the");
    participants.push("participants");
    participants.push("sheet");
  }

  createOrUpdateWhoField(form, existingFormItems, participants);
  createOrUpdateWhyField(existingFormItems, form);
  createOrUpdateHowMuchField(existingFormItems, form);
  createOrUpdateSplitAmongField(existingFormItems, form, participants);
  createOrUpdateWhenField(existingFormItems, form);
}

function createOrUpdateSplitAmongField(existingFormItems, form, participants) {
  const splitAmongFieldTitle = "Split Among?";
  const splitAmongFieldDescription = "Who should be equally liable? (Expense will be splitted among selected participants only)";

  let splitAmongField = existingFormItems.find(item => item.getTitle() === splitAmongFieldTitle)?.asCheckboxItem();
  if (!splitAmongField) {
    splitAmongField = form.addCheckboxItem();
    splitAmongField.setTitle(splitAmongFieldTitle);
  }

  splitAmongField.setChoiceValues(participants);
  splitAmongField.setRequired(true);
  splitAmongField.setHelpText(splitAmongFieldDescription);
  splitAmongField.setValidation(FormApp.createCheckboxValidation().requireSelectAtLeast(1).build());
}

function createOrUpdateHowMuchField(existingFormItems, form) {
  const howMuchFieldTitle = "How Much?";
  const howMuchFieldDescription = "How much was spent?";

  let howMuchField = existingFormItems.find(item => item.getTitle() === howMuchFieldTitle)?.asTextItem();
  if (!howMuchField) {
    howMuchField = form.addTextItem();
    howMuchField.setTitle(howMuchFieldTitle);
  }

  howMuchField.setRequired(true);
  howMuchField.setHelpText(howMuchFieldDescription);
  howMuchField.setValidation(FormApp.createTextValidation().requireNumberGreaterThan(0).build());
}

function createOrUpdateWhyField(existingFormItems, form) {
  const whyFieldTitle = "Why?";
  const whyFieldDescription = "What was the expense for?";

  let whyField = existingFormItems.find(item => item.getTitle() === whyFieldTitle)?.asTextItem();
  if (!whyField) {
    whyField = form.addTextItem();
    whyField.setTitle(whyFieldTitle);
  }

  whyField.setRequired(true);
  whyField.setHelpText(whyFieldDescription);
}

function createOrUpdateWhenField(existingFormItems, form) {
  const whenFieldTitle = "When?";
  const whenFieldDescription = "When did this happen?";

  let whenField = existingFormItems.find(item => item.getTitle() === whenFieldTitle)?.asDateItem();
  if (!whenField) {
    whenField = form.addDateItem();
    whenField.setTitle(whenFieldTitle);
  }

  whenField.setRequired(true);
  whenField.setHelpText(whenFieldDescription);
}

function createOrUpdateWhoField(form, existingFormItems, participants) {
  const whoFieldTitle = "Who Spent?";
  const whoFieldDescription = "Who spent for shared purpose?";

  let whoField = existingFormItems.find(item => item.getTitle() === whoFieldTitle)?.asListItem();
  if (!whoField) {
    whoField = form.addListItem();
    whoField.setTitle(whoFieldTitle);
  }

  whoField.setChoiceValues(participants);
  whoField.setRequired(true);
  whoField.setHelpText(whoFieldDescription);
}
