import { handleRequest } from '../../utils/axios';

export const findStaffOrderAPI = async (data) => {
  const config = {
    url: '/staff-order/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getStaffOrderByIdAPI = async (id) => {
  const config = {
    url: `/staff-order/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createStaffOrderAPI = async (data) => {
  const config = {
    url: '/staff-order/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updateStaffOrderAPI = async (data) => {
  const config = {
    url: '/staff-order/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteStaffOrderAPI = async (id) => {
  const config = {
    url: `/staff-order/delete/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteStaffOrdersAPI = async (ids) => {
  const config = {
    url: `/staff-order/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
