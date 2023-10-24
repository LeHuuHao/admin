import { handleRequest } from '../../utils/axios';

export const findMediaUsersAPI = async (data) => {
  const config = {
    url: '/user/search',
    method: 'POST',
    data,
  };
  return handleRequest(config);
};

export const updateMediaUserRoleAPI = async (data) => {
  const config = {
    url: '/user/role',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const searchUserAPI = async (search) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/user/search',
    headers: {
      'Content-Type': 'application/json',
    },
    data: search,
  };

  return handleRequest(config);
};

export const getUserByIdAPI = async (id) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `/user/${id}`,
  };
  return handleRequest(config);
};

export const updateUserAvatarAPI = async (data) => {
  const config = {
    method: 'PUT',
    url: '/user/avatar',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const updateMediaUserStatusAPI = async (data) => {
  const config = {
    url: '/user/status',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const updateMediaUserPhoneAPI = async (data) => {
  const config = {
    url: '/user/phone',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const updateMediaUserEmailAPI = async (data) => {
  const config = {
    url: '/user/email',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const updateMediaUserPasswordAPI = async (data) => {
  const config = {
    url: '/user/password',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const resetMediaUserPasswordAPI = async (data) => {
  const config = {
    url: '/user/reset/password',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};



export const updateMediaUserInfoAPI = async (data) => {
  const config = {
    url: '/user/update',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteMediaUserAPI = async (id) => {
  const config = {
    url: `/user/${id}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const deleteMediaUsersAPI = async (ids) => {
  const config = {
    url: `/user/all/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};

export const getMediaUserByIdAPI = async (id) => {
  const config = {
    url: `/user/${id}`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const getMediaCurrentUserAPI = async () => {
  const config = {
    url: `/user/me`,
    method: 'GET',
  };
  return handleRequest(config);
};

export const createMediaUserAPI = async (data) => {
  const config = {
    url: `/user/`,
    method: 'POST',
    data
  };
  return handleRequest(config);
};
