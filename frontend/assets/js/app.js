async function onLogin(ev) {
  ev.preventDefault();
  try {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    validators.required(username, 'اسم المستخدم');
    validators.required(password, 'كلمة المرور');

    const res = await api.login(username, password);
    saveSession(res.user);
    showToast('تم تسجيل الدخول بنجاح');
    initAppUI();
  } catch (err) {
    showToast(err.message, 'err');
  }
}

function renderTabs() {
  const tabsContainer = document.getElementById('tabs');
  const tabs = getTabs();
  tabsContainer.innerHTML = tabs.map((t) => `<button class="tab-btn ${state.currentTab === t.key ? 'active' : ''}" data-tab="${t.key}">${t.label}</button>`).join('') +
    '<button class="tab-btn" id="logoutBtn">تسجيل خروج</button>';

  tabsContainer.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentTab = btn.dataset.tab;
      renderTabs();
      renderCurrentTab();
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    initAppUI();
  });
}

async function renderDashboard() {
  const data = await api.dashboard(state.user, {});
  return `
    <div class="grid">
      <div class="kpi"><strong>مبيعات اليوم</strong><div>${data.sales}</div></div>
      <div class="kpi"><strong>مصروفات اليوم</strong><div>${data.expenses}</div></div>
      <div class="kpi"><strong>رصيد الخزنة</strong><div>${data.treasury}</div></div>
      <div class="kpi"><strong>أوردرات معلقة</strong><div>${data.pendingOrders}</div></div>
    </div>
  `;
}

async function renderBranches() {
  const branches = await api.list(state.user, 'branches', {});
  const table = renderTable(['id','name','code','status','openingCapital','openingInventory'], branches);
  return `
    <div class="card">
      <h3>إدارة الفروع</h3>
      <form id="branchForm" class="grid">
        <input name="name" placeholder="اسم الفرع" required />
        <input name="code" placeholder="كود الفرع" required />
        <input name="openingCapital" type="number" placeholder="رأس المال أول المدة" required />
        <input name="openingInventory" type="number" placeholder="بضاعة أول المدة" required />
        <button type="submit">حفظ فرع</button>
      </form>
      ${table}
    </div>
  `;
}

async function renderDaily() {
  const rows = await api.list(state.user, 'dailyEntries', {});
  const table = renderTable(['date','branchId','sales','returns','purchases','expenses','cashBalance','profitLoss'], rows);
  return `
    <div class="card">
      <h3>اليومية المحاسبية</h3>
      <form id="dailyForm" class="grid">
        <input name="date" type="date" required />
        <input name="branchId" placeholder="Branch ID" required />
        <input name="sales" type="number" placeholder="المبيعات" required />
        <input name="returns" type="number" placeholder="المرتجعات" value="0" />
        <input name="purchases" type="number" placeholder="المشتريات" value="0" />
        <input name="expenses" type="number" placeholder="المصروفات" value="0" />
        <input name="withdrawals" type="number" placeholder="المسحوبات" value="0" />
        <input name="deposits" type="number" placeholder="الإيداعات" value="0" />
        <textarea name="notes" placeholder="ملاحظات"></textarea>
        <button type="submit">تسجيل اليومية</button>
      </form>
      ${table}
    </div>
  `;
}

async function renderTransfers() {
  const rows = await api.list(state.user, 'transfers', {});
  const table = renderTable(['date','fromBranchId','toBranchId','transferType','amount','notes'], rows);
  return `
    <div class="card">
      <h3>التحويلات الداخلية</h3>
      <p class="hint">مهم: التحويلات لا تسجل كمبيعات أو مصروفات.</p>
      <form id="transferForm" class="grid">
        <input name="date" type="date" required />
        <input name="fromBranchId" placeholder="من فرع" required />
        <input name="toBranchId" placeholder="إلى فرع" required />
        <select name="transferType">
          <option value="GOODS">تحويل بضاعة</option>
          <option value="CASH">تحويل أموال</option>
          <option value="CAPITAL_SUPPORT">دعم رأس مال</option>
          <option value="INTERNAL_SETTLEMENT">تسوية داخلية</option>
        </select>
        <input name="amount" type="number" placeholder="القيمة" required />
        <textarea name="notes" placeholder="ملاحظات"></textarea>
        <button type="submit">حفظ التحويل</button>
      </form>
      ${table}
    </div>
  `;
}

async function renderDelivery() {
  const rows = await api.list(state.user, 'orders', {});
  const table = renderTable(['date','branchId','agentId','customerName','orderValue','deliveryFee','totalCollectable','status'], rows);
  return `
    <div class="card">
      <h3>إدارة الدليفري</h3>
      <form id="orderForm" class="grid">
        <input name="date" type="date" required />
        <input name="branchId" placeholder="Branch ID" required />
        <input name="agentId" placeholder="Agent ID" required />
        <input name="customerName" placeholder="اسم العميل" required />
        <input name="address" placeholder="العنوان" required />
        <input name="orderValue" type="number" placeholder="قيمة الأوردر" required />
        <input name="deliveryFee" type="number" placeholder="رسوم التوصيل" value="25" required />
        <select name="status">
          <option value="ASSIGNED">مسند</option>
          <option value="DELIVERED">تم التسليم</option>
          <option value="RETURNED">راجع</option>
          <option value="POSTPONED">مؤجل</option>
          <option value="CANCELED">ملغي</option>
        </select>
        <button type="submit">حفظ أوردر</button>
      </form>
      ${table}
    </div>
  `;
}

async function renderReports() {
  const daily = await api.list(state.user, 'dailyEntries', {});
  const transfers = await api.list(state.user, 'transfers', {});
  const expenses = await api.list(state.user, 'expenses', {});

  const totalSales = daily.reduce((s, r) => s + Number(r.sales || 0), 0);
  const totalExpenses = daily.reduce((s, r) => s + Number(r.expenses || 0), 0) + expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalTransfers = transfers.reduce((s, r) => s + Number(r.amount || 0), 0);

  return `
    <div class="grid">
      <div class="kpi"><strong>إجمالي المبيعات</strong><div>${totalSales}</div></div>
      <div class="kpi"><strong>إجمالي المصروفات</strong><div>${totalExpenses}</div></div>
      <div class="kpi"><strong>إجمالي التحويلات الداخلية</strong><div>${totalTransfers}</div></div>
      <div class="kpi"><strong>صافي تقريبي</strong><div>${totalSales - totalExpenses}</div></div>
    </div>
  `;
}

function getFormData(formEl) {
  const fd = new FormData(formEl);
  return Object.fromEntries(fd.entries());
}

async function bindForms() {
  const branchForm = document.getElementById('branchForm');
  if (branchForm) {
    branchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = getFormData(branchForm);
      payload.status = 'ACTIVE';
      await api.create(state.user, 'branches', payload);
      showToast('تم حفظ الفرع');
      renderCurrentTab();
    });
  }

  const dailyForm = document.getElementById('dailyForm');
  if (dailyForm) {
    dailyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = getFormData(dailyForm);
      payload.cashBalance = Number(payload.sales || 0) - Number(payload.returns || 0) - Number(payload.expenses || 0) - Number(payload.withdrawals || 0) + Number(payload.deposits || 0);
      payload.profitLoss = Number(payload.sales || 0) - Number(payload.returns || 0) - Number(payload.purchases || 0) - Number(payload.expenses || 0);
      payload.capitalCurrent = payload.cashBalance;
      await api.create(state.user, 'dailyEntries', payload);
      showToast('تم تسجيل اليومية');
      renderCurrentTab();
    });
  }

  const transferForm = document.getElementById('transferForm');
  if (transferForm) {
    transferForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = getFormData(transferForm);
      await api.create(state.user, 'transfers', payload);
      showToast('تم حفظ التحويل الداخلي');
      renderCurrentTab();
    });
  }

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = getFormData(orderForm);
      await api.create(state.user, 'orders', payload);
      showToast('تم حفظ الأوردر');
      renderCurrentTab();
    });
  }
}

async function renderCurrentTab() {
  try {
    const content = document.getElementById('content');
    const map = {
      dashboard: renderDashboard,
      branches: renderBranches,
      daily: renderDaily,
      transfers: renderTransfers,
      delivery: renderDelivery,
      reports: renderReports
    };
    const renderer = map[state.currentTab] || renderDashboard;
    content.innerHTML = await renderer();
    await bindForms();
  } catch (err) {
    showToast(err.message, 'err');
  }
}

function initAppUI() {
  const loginView = document.getElementById('loginView');
  const appView = document.getElementById('appView');
  const userInfo = document.getElementById('userInfo');

  if (!state.user) {
    loginView.classList.remove('hidden');
    appView.classList.add('hidden');
    userInfo.textContent = '';
    return;
  }

  loginView.classList.add('hidden');
  appView.classList.remove('hidden');
  userInfo.textContent = `${state.user.fullName} - ${state.user.role}`;
  renderTabs();
  renderCurrentTab();
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', onLogin);
  loadSession();
  initAppUI();
});
