import { handleRequest } from '../../utils/axios';

export const findOperatorAPI = async (data) => {
  const config = {
    url: '/operator/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getOperatorByIdAPI = async (id) => {
  const config = {
    url: `/operator/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createOperatorAPI = async (data) => {
  const config = {
    method: 'POST',
    url: '/operator/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const updateOperatorAPI = async (data) => {
  const config = {
    method: 'PUT',
    url: '/operator/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const deleteOperatorAPI = async (id) => {
  const config = {
    url: `/operator/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteOperatorsAPI = async (ids) => {
  const config = {
    url: `/operator/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
