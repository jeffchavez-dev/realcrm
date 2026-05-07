import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 10000 });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('realcrm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  r => r.data,
  e => {
    if (e.response?.status === 401) {
      localStorage.removeItem('realcrm_token');
      localStorage.removeItem('realcrm_user');
      window.location.href = '/login';
    }
    return Promise.reject(e.response?.data?.error || e.message);
  }
);

export const auth = {
  login:  (email, password) => api.post('/auth/login', { email, password }),
  me:     ()                => api.get('/auth/me'),
  logout: ()                => api.post('/auth/logout'),
};

export const leads = {
  list:        (params) => api.get('/leads', { params }),
  get:         (id)     => api.get(`/leads/${id}`),
  create:      (data)   => api.post('/leads', data),
  update:      (id, d)  => api.patch(`/leads/${id}`, d),
  delete:      (id)     => api.delete(`/leads/${id}`),
  logActivity: (id, d)  => api.post(`/leads/${id}/activities`, d),
};

export const pipeline = {
  get:       ()            => api.get('/pipeline'),
  moveStage: (id, stage)   => api.patch(`/pipeline/${id}/stage`, { stage }),
  create:    (data)        => api.post('/pipeline', data),
  update:    (id, d)       => api.patch(`/pipeline/${id}`, d),
};

export const agents  = { list: () => api.get('/agents'), get: (id) => api.get(`/agents/${id}`) };
export const dashboard = { get: () => api.get('/dashboard') };
export const tasks = {
  list:     (params) => api.get('/tasks', { params }),
  create:   (data)   => api.post('/tasks', data),
  complete: (id)     => api.patch(`/tasks/${id}`, { completed: true }),
  delete:   (id)     => api.delete(`/tasks/${id}`),
};
export const integrations = {
  list:        ()              => api.get('/integrations'),
  mlsSearch:   (params)        => api.get('/integrations/mls/search', { params }),
  sendSMS:     (data)          => api.post('/integrations/twilio/sms', data),
  sendDocSign: (data)          => api.post('/integrations/docusign/send', data),
  setStatus:   (name, status)  => api.patch(`/integrations/${name}/status`, { status }),
};

export default api;
