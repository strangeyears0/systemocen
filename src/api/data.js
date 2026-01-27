import api from './client';

export const dataApi = {
    getAllStudents: () => api.get('/students'),
    getAllClasses: () => api.get('/classes'),
    createClass: (data) => api.post('/classes', data),
};
