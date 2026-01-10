const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ; //|| 'http://localhost:5000'

function getAuthHeaders() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    : { 'Content-Type': 'application/json' };
}

export async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unable to fetch profile');
  return res.json();
}

export async function saveProfile(profile) {
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Unable to save profile');
  return res.json();
}

export async function getDiscover() {
  const res = await fetch(`${API_BASE_URL}/api/discover`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unable to load matches');
  return res.json();
}

export async function getMatches() {
  const res = await fetch(`${API_BASE_URL}/api/match`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unable to load matches');
  return res.json();
}

export async function requestMatch(targetId) {
  const res = await fetch(`${API_BASE_URL}/api/match/request`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ targetId })
  });
  if (!res.ok) throw new Error('Unable to send request');
  return res.json();
}

export async function respondMatch(matchId, action) {
  const res = await fetch(`${API_BASE_URL}/api/match/respond`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ matchId, action })
  });
  if (!res.ok) throw new Error('Unable to update request');
  return res.json();
}

export async function fetchMessages(matchId) {
  const res = await fetch(`${API_BASE_URL}/api/messages/${matchId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unable to load messages');
  return res.json();
}

export async function sendMessage(matchId, text) {
  const res = await fetch(`${API_BASE_URL}/api/messages/${matchId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Unable to send message');
  return res.json();
}

export { API_BASE_URL };
