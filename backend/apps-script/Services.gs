function setupSpreadsheet() {
  const ss = getSpreadsheet();
  Object.keys(APP_CONFIG.SHEETS).forEach((name) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const headers = APP_CONFIG.SHEETS[name];
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  });
}

function authenticate(username, password) {
  const users = sheetToObjects('Users');
  const hash = hashPassword(password);
  const user = users.find((u) => u.username === username && String(u.passwordHash) === hash && String(u.isActive) !== 'false');
  if (!user) throw new Error('بيانات الدخول غير صحيحة');
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    branchIds: user.branchIds,
    agentId: user.agentId
  };
}

function createRecord(entity, payload, actor) {
  const map = {
    branches: { sheet: 'Branches', prefix: 'BR' },
    dailyEntries: { sheet: 'DailyEntries', prefix: 'DE' },
    transfers: { sheet: 'BranchTransfers', prefix: 'TR' },
    orders: { sheet: 'Orders', prefix: 'OR' },
    settlements: { sheet: 'DeliverySettlements', prefix: 'DS' },
    expenses: { sheet: 'Expenses', prefix: 'EX' },
    deposits: { sheet: 'Deposits', prefix: 'DP' },
    withdrawals: { sheet: 'Withdrawals', prefix: 'WD' },
    inventory: { sheet: 'InventoryCounts', prefix: 'IC' },
    capital: { sheet: 'CapitalTransactions', prefix: 'CT' }
  };
  const conf = map[entity];
  if (!conf) throw new Error('Entity not supported');

  const row = Object.assign({}, payload, {
    id: payload.id || createId(conf.prefix),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    createdBy: actor ? actor.username : ''
  });

  if (entity === 'orders') {
    row.totalCollectable = ensureNumber(row.orderValue) + ensureNumber(row.deliveryFee);
  }

  if (entity === 'settlements') {
    row.difference = ensureNumber(row.actualAmount) - ensureNumber(row.expectedAmount);
  }

  return appendObject(conf.sheet, row);
}

function listRecords(entity, filters, actor) {
  const map = {
    users: 'Users',
    branches: 'Branches',
    dailyEntries: 'DailyEntries',
    transfers: 'BranchTransfers',
    agents: 'DeliveryAgents',
    orders: 'Orders',
    trips: 'DeliveryTrips',
    settlements: 'DeliverySettlements',
    expenses: 'Expenses',
    deposits: 'Deposits',
    withdrawals: 'Withdrawals',
    inventory: 'InventoryCounts',
    capital: 'CapitalTransactions',
    settings: 'Settings'
  };
  const sheet = map[entity];
  if (!sheet) throw new Error('Entity not supported');

  let rows = sheetToObjects(sheet);
  if (filters && filters.branchId) rows = rows.filter((r) => String(r.branchId || r.defaultBranchId || r.fromBranchId || '') === String(filters.branchId));
  if (filters && filters.dateFrom) rows = rows.filter((r) => !r.date || String(r.date) >= filters.dateFrom);
  if (filters && filters.dateTo) rows = rows.filter((r) => !r.date || String(r.date) <= filters.dateTo);

  rows = rows.filter((r) => {
    const b = r.branchId || r.defaultBranchId || r.fromBranchId || '';
    return userHasBranch(actor, b);
  });

  return rows;
}

function updateRecord(entity, id, payload) {
  const map = { branches: 'Branches', orders: 'Orders', dailyEntries: 'DailyEntries', transfers: 'BranchTransfers', expenses: 'Expenses' };
  const sheet = map[entity];
  if (!sheet) throw new Error('Entity not supported for update');
  payload.updatedAt = nowIso();
  updateObject(sheet, id, payload);
  return { id, updated: true };
}

function removeRecord(entity, id) {
  const map = { branches: 'Branches', orders: 'Orders', expenses: 'Expenses' };
  const sheet = map[entity];
  if (!sheet) throw new Error('Entity not supported for delete');
  return deleteById(sheet, id);
}

function getDashboard(actor, scope) {
  const branchId = scope && scope.branchId;
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  const daily = listRecords('dailyEntries', { branchId, dateFrom: today, dateTo: today }, actor);
  const sales = daily.reduce((sum, r) => sum + ensureNumber(r.sales), 0);
  const expenses = daily.reduce((sum, r) => sum + ensureNumber(r.expenses), 0);

  const treasury = listRecords('deposits', { branchId, dateFrom: '2000-01-01', dateTo: today }, actor)
    .reduce((sum, r) => sum + ensureNumber(r.amount), 0) -
    listRecords('withdrawals', { branchId, dateFrom: '2000-01-01', dateTo: today }, actor)
    .reduce((sum, r) => sum + ensureNumber(r.amount), 0);

  const pendingOrders = listRecords('orders', { branchId }, actor)
    .filter((o) => ['ASSIGNED', 'POSTPONED'].indexOf(String(o.status)) > -1).length;

  return {
    date: today,
    branchId: branchId || 'ALL',
    sales,
    expenses,
    treasury,
    pendingOrders,
    alerts: pendingOrders > 20 ? ['هناك ضغط أوردرات مؤجلة/مسندة'] : []
  };
}
