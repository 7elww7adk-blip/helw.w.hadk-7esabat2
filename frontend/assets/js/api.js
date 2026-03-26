window.apiCall = async function apiCall(body) {
  const res = await fetch(window.APP_CONFIG.API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'خطأ غير معروف');
  return data.data;
};

window.api = {
  login: (username, password) => apiCall({ action: 'login', username, password }),
  dashboard: (token, payload) => apiCall({ action: 'dashboard', token, payload }),
  list: (token, entity, payload) => apiCall({ action: 'list', token, entity, payload }),
  create: (token, entity, payload) => apiCall({ action: 'create', token, entity, payload }),
  update: (token, entity, id, payload) => apiCall({ action: 'update', token, entity, id, payload }),
  remove: (token, entity, id) => apiCall({ action: 'delete', token, entity, id })
};
