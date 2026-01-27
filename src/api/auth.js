import api from './client';

export const authApi = {
    login: (email, password, type) => api.post('/auth/login', { email, password, type }),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
};
