/**
 * إعدادات النظام - عدّل القيم قبل النشر.
 */
const APP_CONFIG = {
  SPREADSHEET_ID: 'PUT_YOUR_SPREADSHEET_ID_HERE',
  APP_SECRET: 'CHANGE_ME_SECRET',
  ALLOW_ORIGINS: ['*'],
  SHEETS: {
    Users: ['id','username','passwordHash','fullName','role','branchIds','agentId','isActive','createdAt','updatedAt'],
    Branches: ['id','name','code','status','openingCapital','openingInventory','address','notes','createdAt','updatedAt'],
    DailyEntries: ['id','date','branchId','sales','returns','purchases','expenses','withdrawals','deposits','inventoryAdjustment','cashBalance','capitalCurrent','profitLoss','notes','createdBy','createdAt'],
    Purchases: ['id','date','branchId','vendorName','amount','notes','createdBy','createdAt'],
    Expenses: ['id','date','branchId','expenseType','amount','notes','createdBy','createdAt'],
    Deposits: ['id','date','branchId','amount','reason','createdBy','createdAt'],
    Withdrawals: ['id','date','branchId','amount','reason','createdBy','createdAt'],
    BranchTransfers: ['id','date','fromBranchId','toBranchId','transferType','amount','notes','createdBy','createdAt'],
    DeliveryAgents: ['id','name','phone','defaultBranchId','status','notes','createdAt','updatedAt'],
    Orders: ['id','date','branchId','agentId','customerName','address','orderValue','deliveryFee','totalCollectable','status','notes','createdAt'],
    DeliveryTrips: ['id','date','agentId','branchId','ordersCount','startedAt','endedAt','status','notes','createdAt'],
    DeliverySettlements: ['id','date','tripId','agentId','branchId','expectedAmount','actualAmount','difference','agentDue','deliveredCount','returnedCount','postponedCount','canceledCount','notes','createdBy','createdAt'],
    InventoryCounts: ['id','date','branchId','expectedValue','actualValue','difference','notes','createdBy','createdAt'],
    CapitalTransactions: ['id','date','branchId','type','amount','notes','createdBy','createdAt'],
    Settings: ['key','value','description','updatedAt']
  }
};
