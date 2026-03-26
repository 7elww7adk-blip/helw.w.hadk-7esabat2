function seedInitialData() {
  const users = sheetToObjects('Users');
  if (users.length) return;

  appendObject('Branches', {
    id: 'BR-001', name: 'الفرع الأساسي', code: 'MAIN', status: 'ACTIVE',
    openingCapital: 100000, openingInventory: 50000, address: 'المدينة الرئيسية', notes: '',
    createdAt: nowIso(), updatedAt: nowIso()
  });
  appendObject('Branches', {
    id: 'BR-002', name: 'الفرع الجديد', code: 'NEW', status: 'ACTIVE',
    openingCapital: 50000, openingInventory: 25000, address: 'المنطقة الجديدة', notes: '',
    createdAt: nowIso(), updatedAt: nowIso()
  });

  appendObject('DeliveryAgents', {
    id: 'AG-001', name: 'مندوب 1', phone: '01000000001', defaultBranchId: 'BR-001', status: 'ACTIVE', notes: '', createdAt: nowIso(), updatedAt: nowIso()
  });

  const userSeeds = [
    ['USR-001', 'owner', 'صاحب المحل', 'OWNER', 'BR-001,BR-002', ''],
    ['USR-002', 'manager1', 'مدير الفرع الأساسي', 'BRANCH_MANAGER', 'BR-001', ''],
    ['USR-003', 'accountant', 'محاسب', 'ACCOUNTANT', 'BR-001,BR-002', ''],
    ['USR-004', 'agent1', 'مندوب 1', 'DELIVERY_AGENT', 'BR-001', 'AG-001'],
    ['USR-005', 'viewer', 'مشاهد', 'VIEWER', 'BR-001,BR-002', '']
  ];

  userSeeds.forEach((u) => {
    appendObject('Users', {
      id: u[0], username: u[1], passwordHash: hashPassword('123456'), fullName: u[2], role: u[3], branchIds: u[4], agentId: u[5],
      isActive: true, createdAt: nowIso(), updatedAt: nowIso()
    });
  });

  appendObject('Settings', { key: 'defaultDeliveryFee', value: '25', description: 'رسوم التوصيل الافتراضية', updatedAt: nowIso() });
  appendObject('Settings', { key: 'orderStatuses', value: 'ASSIGNED,DELIVERED,RETURNED,POSTPONED,CANCELED', description: 'حالات الأوردر', updatedAt: nowIso() });
  appendObject('Settings', { key: 'expenseTypes', value: 'إيجار,مرتبات,كهرباء,مياه,نثريات', description: 'أنواع المصروفات', updatedAt: nowIso() });
}
