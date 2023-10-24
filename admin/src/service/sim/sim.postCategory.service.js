import { handleRequest } from "../../utils/axios";

export const findPostCategoriesAPI = async (data) => {
  const config = {
    url: '/post-category/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getPostCategoryByIdAPI = async (id) => {
  const config = {
    url: `/post-category/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createPostCategoryAPI = async (data) => {
  const config = {
    url: '/post-category/',
    method: 'POST',
    data
  };

  return handleRequest(config);
};

export const updatePostCategoryAPI = async (data) => {
  const config = {
    url: '/post-category/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deletePostCategoryAPI = async (id) => {
  const config = {
    url: `/post-category/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deletePostCategoriesAPI = async (ids) => {
  const config = {
    url: `/post-category/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};