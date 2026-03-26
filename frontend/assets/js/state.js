window.state = {
  user: null,
  currentTab: 'dashboard'
};

window.loadSession = function loadSession() {
  try {
    const raw = localStorage.getItem('mvp_session');
    state.user = raw ? JSON.parse(raw) : null;
  } catch (_) {
    state.user = null;
  }
};

window.saveSession = function saveSession(user) {
  state.user = user;
  localStorage.setItem('mvp_session', JSON.stringify(user));
};

window.clearSession = function clearSession() {
  state.user = null;
  localStorage.removeItem('mvp_session');
};
