// api.js

import Taro from '@tarojs/taro';

const BASE_URL = 'https://vr.justeasy.cn/'; // 替换为你的实际API基础URL

// 封装请求函数
const request = async (url, method = 'GET', data = {}) => {
  const token = ''; // 如果有需要可以添加token等认证信息

  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const options = {
    url: `${BASE_URL}${url}`,
    method,
    data,
    header,
  };

  try {
    const response = await Taro.request(options);
    return response.data;
  } catch (error) {
    // 处理请求错误，比如网络错误等
    console.error('Request Error:', error);
    throw error;
  }
};

export default request;
