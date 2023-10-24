import { handleRequest } from '../../utils/axios';

export const findEmailAPI = async (data) => {
  const config = {
    url: '/email/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const getEmailByIdAPI = async (id) => {
  const config = {
    url: `/email/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createEmailAPI = async (data) => {
  const config = {
    url: '/email/',
    method: 'POST',
    data,
  };

  return handleRequest(config);
};

export const updateEmailAPI = async (data) => {
  const config = {
    url: '/email/',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteEmailAPI = async (id) => {
  const config = {
    url: `/email/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteEmailsAPI = async (ids) => {
  const config = {
    url: `/email/all/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};
