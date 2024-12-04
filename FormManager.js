function createAndGetForm () {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  form = FormApp.create("Shared Expenses");
  form.setDescription("Form to record shared expenses so we can figure out who owes whom and how much.")
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  SpreadsheetApp.flush();

  const rawSheet = ss.getSheetByName("Raw");
  if(rawSheet){
    ss.deleteSheet("Raw");
  }
  const formUrl = form.getEditUrl().replace("edit", "viewform");
  const formSheet = ss.getSheets().find(s => s.getFormUrl() == formUrl);
  if (formSheet) {
    formSheet.setName("Raw");
  }
  return form;
}

function getForm (formId) {
  if(formId === ""){
    throw new Error("Form ID is not configured!");
  }
  const form = FormApp.openById(FORM_ID);
  return form;
}

function addFormElements(form) {
  const existingFormItems = form.getItems();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let participantsSheet = ss.getSheetByName("Participants");
  if(!participantsSheet) {
    participantsSheet = ss.insertSheet("Participants");
  }

  const firstColumn = participantsSheet.getRange("A1:A").getValues();
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

function saveFormInfoToSheet(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let formInfoSheet = ss.getSheetByName("FormInfo");
  if (!formInfoSheet) {
    formInfoSheet = ss.insertSheet("FormInfo");
  }

  const a1 = "Form URL";
  const b1 = form.getPublishedUrl();
  const a2 = "Form ID";
  const b2 = form.getId();

  formInfoSheet.getRange("A1").setValue(a1);
  formInfoSheet.getRange("B1").setValue(b1);
  formInfoSheet.getRange("A2").setValue(a2);
  formInfoSheet.getRange("B2").setValue(b2);
}
