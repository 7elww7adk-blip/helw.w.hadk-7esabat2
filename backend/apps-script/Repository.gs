function getSpreadsheet() {
  return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
}

function getSheet(name) {
  const sh = getSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error(`Sheet not found: ${name}`);
  return sh;
}

function sheetToObjects(name) {
  const sh = getSheet(name);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter((r) => r.some((v) => v !== '')).map((row) => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = row[idx]; });
    return obj;
  });
}

function appendObject(name, obj) {
  const sh = getSheet(name);
  const headers = APP_CONFIG.SHEETS[name];
  const row = headers.map((h) => obj[h] || '');
  sh.appendRow(row);
  return obj;
}

function updateObject(name, id, updates) {
  const sh = getSheet(name);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) throw new Error('No rows');
  const headers = values[0];
  const idCol = headers.indexOf('id');
  const rowIndex = values.findIndex((r, i) => i > 0 && r[idCol] === id);
  if (rowIndex === -1) throw new Error(`Not found: ${id}`);
  headers.forEach((h, idx) => {
    if (Object.prototype.hasOwnProperty.call(updates, h)) {
      sh.getRange(rowIndex + 1, idx + 1).setValue(updates[h]);
    }
  });
  return true;
}

function deleteById(name, id) {
  const sh = getSheet(name);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return false;
  const headers = values[0];
  const idCol = headers.indexOf('id');
  const rowIndex = values.findIndex((r, i) => i > 0 && r[idCol] === id);
  if (rowIndex === -1) return false;
  sh.deleteRow(rowIndex + 1);
  return true;
}
