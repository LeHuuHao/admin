import { handleRequest } from '../../utils/axios';

export const findProfitConfigAPI = async (data) => {
  const config = {
    url: '/profit-config/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getProfitConfigByIdAPI = async (id) => {
  const config = {
    url: `/profit-config/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createProfitConfigAPI = async (data) => {
  const config = {
    url: '/profit-config/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updateProfitConfigAPI = async (data) => {
  const config = {
    url: '/profit-config/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteProfitConfigAPI = async (id) => {
  const config = {
    url: `/profit-config/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteProfitConfigsAPI = async (ids) => {
  const config = {
    url: `/profit-config/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
