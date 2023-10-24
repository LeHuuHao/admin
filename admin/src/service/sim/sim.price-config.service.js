import { handleRequest } from '../../utils/axios';

export const findPriceConfigAPI = async (data) => {
  const config = {
    url: '/price-config/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getPriceConfigByIdAPI = async (id) => {
  const config = {
    url: `/price-config/${id}`,
    method: 'GET',  
  };
  return handleRequest(config);
};

export const createPriceConfigAPI = async (data) => {
  const config = {
    url: '/price-config/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updatePriceConfigAPI = async (data) => {
  const config = {
    url: '/price-config/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deletePriceConfigAPI = async (id) => {
  const config = {
    url: `/price-config/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deletePriceConfigsAPI = async (ids) => {
  const config = {
    url: `/price-config/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
