import api from './client';

export const subjectsApi = {
    getAll: () => api.get('/subjects'),
    create: (data) => api.post('/subjects', data),
    delete: (id) => api.delete(`/subjects/${id}`),
};
