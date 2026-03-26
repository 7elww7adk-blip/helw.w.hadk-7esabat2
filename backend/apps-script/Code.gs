/**
 * REST-like endpoint for frontend.
 * Request body:
 * {
 *   action: 'login' | 'list' | 'create' | 'update' | 'delete' | 'dashboard',
 *   token: {username,role,branchIds,...},
 *   entity: 'branches' | ...,
 *   payload: {}
 * }
 */
function doGet() {
  return jsonResponse({ ok: true, message: 'MVP API is running' });
}

function doPost(e) {
  try {
    const req = parseBody(e);
    const action = req.action;

    if (action === 'login') {
      const user = authenticate(req.username, req.password);
      return jsonResponse({ ok: true, data: { user } });
    }

    const actor = req.token;
    if (!actor || !actor.username) {
      return jsonResponse({ ok: false, error: 'غير مصرح' });
    }

    if (action === 'dashboard') {
      return jsonResponse({ ok: true, data: getDashboard(actor, req.payload || {}) });
    }

    if (action === 'list') {
      return jsonResponse({ ok: true, data: listRecords(req.entity, req.payload || {}, actor) });
    }

    if (action === 'create') {
      return jsonResponse({ ok: true, data: createRecord(req.entity, req.payload || {}, actor) });
    }

    if (action === 'update') {
      return jsonResponse({ ok: true, data: updateRecord(req.entity, req.id, req.payload || {}) });
    }

    if (action === 'delete') {
      return jsonResponse({ ok: true, data: removeRecord(req.entity, req.id) });
    }

    return jsonResponse({ ok: false, error: 'Action غير مدعوم' });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Server error' });
  }
}
