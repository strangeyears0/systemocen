import api from './client';

export const gradesApi = {
    getByStudent: (studentId) => api.get(`/grades/student/${studentId}`),
    add: (data) => api.post('/grades', data),
};
