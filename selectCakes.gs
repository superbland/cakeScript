function openSpreadsheet() {
  // The code below will log the index of a sheet named "Expenses"
  var spreadsheet = SpreadsheetApp.openById('1ObvxVw2Yog2ZA1wHFFpCExiWPNS8ISG9sdwrtUYmk0Y');
  SpreadsheetApp.setActiveSpreadsheet(spreadsheet);
  var sheet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('cakeList'));
  var cakeList = sheet.getDataRange().getValues();
  Logger.log(cakeList);
  chooseCakeOptions(cakeList);
}

function chooseCakeOptions(cakeList) {
  var cakes = [0, 0, 0];

  assignNumbers();
  
  // Assign each key a valid cake
  // Non-unique will be reassigned
  // Non-enabled will be reassigned
  function assignNumbers(index) {
    if (index) {
      cakes[index] = Math.floor(Math.random()*cakeList.length);
    } else {
      cakes[0] = Math.floor(Math.random()*cakeList.length);
      cakes[1] = Math.floor(Math.random()*cakeList.length);
      cakes[2] = Math.floor(Math.random()*cakeList.length);
    }
    
    // Reassign non-unique
    var isUnique = checkDiff();
    if (isUnique !== true) {
      assignNumbers(isUnique);
    }
    
    // Reassign non-enabled
    var isEnabled = checkEnabled();
    if (isEnabled !== true) {
      assignNumbers(isEnabled);
    }
    
    // Carry on
    if (isEnabled === true && isUnique === true) {
      updateSurvey(cakeList);
    }  
  }
  
  // Check the values are unique
  // Return true if all clear, or index of non-unique cake
  function checkDiff() {
    var j;
    for (var i = 0; i < cakes.length; i++) {
      j = cakes.length;
      while (j) {
        j--;
        if (i === j) {
          continue;
        }
        if (cakes[i] !== cakes[j]) {
          continue;
        } else {
          return i;
        }
      }
    }
    return true;
  }
  
  // Return true or index for reassignment
  function checkEnabled() {
    for (var i = 0; i < cakes.length; i++) {
      if (cakeList[cakes[i]][1]) {
        continue;
      } else {
        return i;
      }
    }
    return true;
  }
  
  // Update options / date on cakeSurvey form
  // Wipe previous results
  function updateSurvey(cakeList) {
    var form = FormApp.openById('1Y9p4yyeeqw7u9NBYs_vW4nUcNgmpX9qgpI7tDxo6yOA');
    var oldItems = form.getItems().length;
    var question;
    form.deleteAllResponses();
    
    if (oldItems) {
      while (oldItems) {
        oldItems--;
        form.deleteItem(oldItems);
        
      }
    }
    question = form.addMultipleChoiceItem();
    question.setTitle('Which cake would you like next week?');
    question.isRequired();
    question.setChoices([
      question.createChoice(cakeList[cakes[0]][0]),
      question.createChoice(cakeList[cakes[1]][0]),
      question.createChoice(cakeList[cakes[2]][0])
     ]);
    
    toggleCakeState();
  }
  
  // Set all cakes to enabled state
  // Then disable the chosen cakes for next time
  function toggleCakeState() {
    var spreadsheet = SpreadsheetApp.openById('1ObvxVw2Yog2ZA1wHFFpCExiWPNS8ISG9sdwrtUYmk0Y');
    SpreadsheetApp.setActiveSpreadsheet(spreadsheet);
    var sheet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('cakeList'));
    var states = sheet.getRange('B1:B').getValues();
    
    
    for (var i = 0; i < states.length; i++) {
      // Set enabled
      if (states[i][0] === 0) {
        states[i][0] = 1;
      }
      // Remove empties
      if (typeof states[i][0] !== 'number') {
        states.splice(i, states.length - i)
        break;
      }
    }
    
    // Disable this weeks cakes
    for (var j = 0; j < cakes.length; j++) {
      states[cakes[j]][0] = 0;
    }
        
    // Update the sheet with the new states
    sheet.getRange('B1:B' + states.length).setValues(states);
    
  }
  // Remind the cake bearer
}
