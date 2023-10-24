import { handleRequest } from '../../utils/axios';

export const findPostsAPI = async (data) => {
  const config = {
    url: '/post/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getPostByIdAPI = async (id) => {
  const config = {
    url: `/post/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createPostAPI = async (data) => {
  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: '/post/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const updatePostAPI = async (data) => {
  const config = {
    method: 'PUT',
    maxBodyLength: Infinity,
    url: '/post/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const deletePostAPI = async (id) => {
  const config = {
    url: `/post/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
export const getPostBySlugAPI = async (slug) => {
  const config = {
    url: `/post/slug/${slug}`,
    method: 'GET'
  };
  return handleRequest(config);
};
export const deletePostsAPI = async (ids) => {
  const config = {
    url: `/post/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
