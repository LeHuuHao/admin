import { handleRequest } from '../../utils/axios';

export const findUserOrderAPI = async (data) => {
  const config = {
    url: '/user-order/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getUserOrderByIdAPI = async (id) => {
  const config = {
    url: `/user-order/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createUserOrderAPI = async (data) => {
  const config = {
    url: '/user-order/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updateUserOrderAPI = async (data) => {
  const config = {
    url: '/user-order/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteUserOrderAPI = async (id) => {
  const config = {
    url: `/user-order/delete/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteUserOrdersAPI = async (ids) => {
  const config = {
    url: `/user-order/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
