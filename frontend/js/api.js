// Shared helper for talking to the backend. Loaded before script.js and login.js.
const API = '/api';

const getToken = () => localStorage.getItem('token');

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
};

async function apiRequest(path, method = 'GET', body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;

    const res = await fetch(API + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));

    // Expired or invalid token on a protected route -> back to login
    if (res.status === 401 && token) {
        logout();
        throw new Error(data.message || 'Please log in again');
    }
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
}
