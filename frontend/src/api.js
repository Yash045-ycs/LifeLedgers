const BASE = '/api';

function getToken() {
  return localStorage.getItem('ll_token');
}

function headers() {
  return {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login:    (body) => request('POST', '/auth/login', body),
  signup:   (body) => request('POST', '/auth/signup', body),
  me:       ()     => request('GET',  '/auth/me'),
  updateMe: (body) => request('PUT',  '/auth/me', body),
  updatePassword: (body) => request('PUT', '/auth/password', body),
  deleteAccount:  ()     => request('DELETE', '/auth/me'),

  // Obligations
  getObligations: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/obligations${q ? '?' + q : ''}`);
  },
  createObligation: (body)      => request('POST',   '/obligations', body),
  updateObligation: (id, body)  => request('PUT',    `/obligations/${id}`, body),
  updateObligationStatus: (id, status) => request('PATCH', `/obligations/${id}/status`, { status }),
  deleteObligation: (id)        => request('DELETE', `/obligations/${id}`),
  getAnalytics:    ()           => request('GET', '/obligations/analytics/summary'),

  // Documents
  getDocuments:   ()            => request('GET',    '/documents'),
  createDocument: (body)        => request('POST',   '/documents', body),
  updateDocument: (id, body)    => request('PUT',    `/documents/${id}`, body),
  deleteDocument: (id)          => request('DELETE', `/documents/${id}`),

  // Subscriptions
  getSubscriptions:   ()        => request('GET',    '/subscriptions'),
  createSubscription: (body)    => request('POST',   '/subscriptions', body),
  updateSubscription: (id,body) => request('PUT',    `/subscriptions/${id}`, body),
  cancelSubscription: (id)      => request('PATCH',  `/subscriptions/${id}/cancel`),
  deleteSubscription: (id)      => request('DELETE', `/subscriptions/${id}`),

  // Settings
  getNotifSettings: ()          => request('GET',  '/settings/notifications'),
  saveNotifSettings:(body)      => request('PUT',  '/settings/notifications', body),
};