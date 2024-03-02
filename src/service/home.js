import request from './api';

//example
export const getUser = (userId) => {
  const url = `/user/${userId}`; // 替换为实际的API路径
  return request(url);
};
export const getSlider = () => {
  const url = `xcx/pano/banners_new`;
  return request(url);
};
