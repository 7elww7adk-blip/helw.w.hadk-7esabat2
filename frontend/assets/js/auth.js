window.hasRole = function hasRole(roles) {
  if (!state.user) return false;
  return roles.includes(state.user.role);
};

window.canAccessBranch = function canAccessBranch(branchId) {
  if (!state.user) return false;
  if (state.user.role === 'OWNER') return true;
  const ids = (state.user.branchIds || '').split(',').map((x) => x.trim());
  return ids.includes(branchId);
};
