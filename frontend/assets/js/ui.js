window.showToast = function showToast(msg, type = 'ok') {
  const toast = document.getElementById('toast');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2600);
};

window.renderTable = function renderTable(headers, rows) {
  const th = headers.map((h) => `<th>${h}</th>`).join('');
  const tr = rows.map((r) => `<tr>${headers.map((h) => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tr || '<tr><td colspan="99">لا توجد بيانات</td></tr>'}</tbody></table></div>`;
};

window.getTabs = function getTabs() {
  const tabs = [
    { key: 'dashboard', label: 'لوحة التحكم', roles: ['OWNER','BRANCH_MANAGER','ACCOUNTANT','VIEWER'] },
    { key: 'branches', label: 'الفروع', roles: ['OWNER'] },
    { key: 'daily', label: 'اليومية المحاسبية', roles: ['OWNER','BRANCH_MANAGER','ACCOUNTANT'] },
    { key: 'transfers', label: 'التحويلات', roles: ['OWNER','ACCOUNTANT'] },
    { key: 'delivery', label: 'الدليفري', roles: ['OWNER','BRANCH_MANAGER','ACCOUNTANT','DELIVERY_AGENT'] },
    { key: 'reports', label: 'التقارير', roles: ['OWNER','BRANCH_MANAGER','ACCOUNTANT','VIEWER'] }
  ];
  return tabs.filter((t) => hasRole(t.roles));
};
