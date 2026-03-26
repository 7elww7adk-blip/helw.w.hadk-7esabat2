function nowIso() {
  return new Date().toISOString();
}

function jsonResponse(payload, statusCode) {
  const out = ContentService.createTextOutput(JSON.stringify(payload));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function createId(prefix) {
  return `${prefix}-${Utilities.getUuid().slice(0, 8).toUpperCase()}`;
}

function hashPassword(password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + APP_CONFIG.APP_SECRET);
  return bytes.map((b) => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}

function ensureNumber(value) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function authorizedRoles(user, allowed) {
  return user && allowed.indexOf(user.role) > -1;
}

function userHasBranch(user, branchId) {
  if (!branchId) return true;
  if (!user || !user.branchIds) return false;
  if (user.role === 'OWNER') return true;
  const ids = String(user.branchIds).split(',').map((v) => v.trim()).filter(Boolean);
  return ids.indexOf(branchId) > -1;
}
