import { handleRequest } from '../../utils/axios';

export const findSimAPI = async (data) => {
  const config = {
    url: '/sim/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getSimByIdAPI = async (id) => {
  const config = {
    url: `/sim/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createSimAPI = async (data) => {
  const config = {
    url: '/sim/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const importExcelSimAPI = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = {
    url: `/sim/excel/import`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };
  return handleRequest(config);
};

export const updateSimAPI = async (data) => {
  const config = {
    url: '/sim/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const updateSimStatusAPI = async (data) => {
  const config = {
    url: '/sim/update/status',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteSimAPI = async (id) => {
  const config = {
    url: `/sim/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteSimsAPI = async (ids) => {
  const config = {
    url: `/sim/all/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
