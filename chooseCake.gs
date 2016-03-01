// Take the cake with the most votes
// Place in new cell on chosenCakes sheet with date
function chooseCake() {
  var spreadsheet = SpreadsheetApp.openById('1ObvxVw2Yog2ZA1wHFFpCExiWPNS8ISG9sdwrtUYmk0Y');
  SpreadsheetApp.setActiveSpreadsheet(spreadsheet);
  var sheet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('chosenCake'));
  var rows = sheet.getRange('A1:B').getValues();
  
  var form = FormApp.openById('1Y9p4yyeeqw7u9NBYs_vW4nUcNgmpX9qgpI7tDxo6yOA');
  var formResponses = form.getResponses();
  var answers = [];
  var popular = ['', 0];
  var count = 1;
  
  // Harvest responses
  for (var i = 0; i < formResponses.length; i++) {
    for (var j = 0; j < formResponses[i].getItemResponses().length; j++) {
      answers.push(formResponses[i].getItemResponses()[j].getResponse());
    }
  }
  
  i = answers.length;
  answers.sort();
  
  // Find the cake with the most votes
  
  if (answers.length) {
    for (var i = 0; i < answers.length; i++) {
      if (answers[i] === answers[i+1]) {
        count++;
      } else {
        if (count > popular[1]) {
          popular[0] = answers[i];
          popular[1] = count;
          count = 1;
        }
      }
    }
  } else {
    popular[0] = 'No one voted :(';
  }
  
  // Assign to chosenCake sheet
  for (var i = 0; i < rows.length; i++) {
    // Remove empties
    if (typeof rows[i][0] !== 'object') {
      rows.splice(i, rows.length - i)
      break;
    }
  }
  sheet.getRange('A' + (rows.length+1) + ':B' + (rows.length+1)).setValues([['=A' + (rows.length) + '+7', popular[0]]]);  
}
