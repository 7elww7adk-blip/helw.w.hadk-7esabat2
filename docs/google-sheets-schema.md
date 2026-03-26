# Google Sheets Schema (MVP)

## 1) Users
- `id`
- `username`
- `passwordHash`
- `fullName`
- `role` (OWNER | BRANCH_MANAGER | ACCOUNTANT | DELIVERY_AGENT | VIEWER)
- `branchIds` (comma-separated)
- `agentId` (اختياري)
- `isActive`
- `createdAt`
- `updatedAt`

## 2) Branches
- `id`
- `name`
- `code`
- `status` (ACTIVE | INACTIVE)
- `openingCapital`
- `openingInventory`
- `address`
- `notes`
- `createdAt`
- `updatedAt`

## 3) DailyEntries
- `id`
- `date`
- `branchId`
- `sales`
- `returns`
- `purchases`
- `expenses`
- `withdrawals`
- `deposits`
- `inventoryAdjustment`
- `cashBalance`
- `capitalCurrent`
- `profitLoss`
- `notes`
- `createdBy`
- `createdAt`

## 4) Purchases
- `id`, `date`, `branchId`, `vendorName`, `amount`, `notes`, `createdBy`, `createdAt`

## 5) Expenses
- `id`, `date`, `branchId`, `expenseType`, `amount`, `notes`, `createdBy`, `createdAt`

## 6) Deposits
- `id`, `date`, `branchId`, `amount`, `reason`, `createdBy`, `createdAt`

## 7) Withdrawals
- `id`, `date`, `branchId`, `amount`, `reason`, `createdBy`, `createdAt`

## 8) BranchTransfers
- `id`
- `date`
- `fromBranchId`
- `toBranchId`
- `transferType` (GOODS | CASH | CAPITAL_SUPPORT | INTERNAL_SETTLEMENT)
- `amount`
- `notes`
- `createdBy`
- `createdAt`

> التحويلات الداخلية لا تدخل ضمن المبيعات أو المصروفات.

## 9) DeliveryAgents
- `id`, `name`, `phone`, `defaultBranchId`, `status`, `notes`, `createdAt`, `updatedAt`

## 10) Orders
- `id`
- `date`
- `branchId`
- `agentId`
- `customerName`
- `address`
- `orderValue`
- `deliveryFee`
- `totalCollectable`
- `status` (ASSIGNED | DELIVERED | RETURNED | POSTPONED | CANCELED)
- `notes`
- `createdAt`

## 11) DeliveryTrips
- `id`, `date`, `agentId`, `branchId`, `ordersCount`, `startedAt`, `endedAt`, `status`, `notes`, `createdAt`

## 12) DeliverySettlements
- `id`
- `date`
- `tripId`
- `agentId`
- `branchId`
- `expectedAmount`
- `actualAmount`
- `difference`
- `agentDue`
- `deliveredCount`
- `returnedCount`
- `postponedCount`
- `canceledCount`
- `notes`
- `createdBy`
- `createdAt`

## 13) InventoryCounts
- `id`, `date`, `branchId`, `expectedValue`, `actualValue`, `difference`, `notes`, `createdBy`, `createdAt`

## 14) CapitalTransactions
- `id`, `date`, `branchId`, `type` (OPENING | SUPPORT | ADJUSTMENT), `amount`, `notes`, `createdBy`, `createdAt`

## 15) Settings
- `key`
- `value`
- `description`
- `updatedAt`
