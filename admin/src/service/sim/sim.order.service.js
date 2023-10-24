import { axiosSim, handleRequest } from '../../utils/axios';

export const findOrderAPI = async (data) => {
  const config = {
    url: '/order/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getOrderByIdAPI = async (id) => {
  const config = {
    url: `/order/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createOrderAPI = async (data) => {
  const config = {
    url: '/order/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updateOrderAPI = async (data) => {
  const config = {
    url: '/order/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteOrderAPI = async (id) => {
  const config = {
    url: `/order/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteOrdersAPI = async (ids) => {
  const config = {
    url: `/order/all/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const statisticOrderByUser = async (data) => {
  const config = {
    url: '/order/statistic-order-by-user',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const statisticOrder = async (data) => {
  const config = {
    url: '/order/statistic-order',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const orderExcelExport = async (data) => {
  const config = {
    url: '/order/excel/export',
    method: 'POST',
    responseType: 'blob',
    data
  };
  const resp = await axiosSim(config);
  return resp;
};
