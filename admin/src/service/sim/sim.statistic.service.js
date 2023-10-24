import { handleRequest } from '../../utils/axios';

export const getSimStatisticAPI = async () => {
  const config = {
    url: `/statistic/`,
    method: 'GET'
  };
  return handleRequest(config);
};