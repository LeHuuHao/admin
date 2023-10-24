import { handleRequest } from '../../utils/axios';

export const findSettingAPI = async (data) => {
  const config = {
    url: '/setting/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getSettingByIdAPI = async (id) => {
  const config = {
    url: `/setting/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createSettingAPI = async (data) => {
  const config = {
    url: '/setting/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updateSettingAPI = async (data) => {
  const config = {
    url: '/setting/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteSettingAPI = async (id) => {
  const config = {
    url: `/setting/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteSettingsAPI = async (ids) => {
  const config = {
    url: `/setting/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
