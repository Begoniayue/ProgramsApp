import CryptoJS from 'crypto-js';
import Taro from "@tarojs/taro";

function generateAndEncryptToken(data, secret) {
  function generateQueryString(obj) {
    const filteredData = Object.entries(obj)
      .filter(([key, value]) => value !== null && value !== '' && value !== undefined)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    const queryString = Object.entries(filteredData)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return queryString;
  }

  const queryString = generateQueryString(data);
  console.log(queryString,'queryString');
  const encryptedToken = CryptoJS.MD5(queryString + secret).toString();
  return encryptedToken;
}
// example
// import generateAndEncryptToken from '../../util/sort'

// const data = {
//   page: page.value,
//   page_size: page_size.value,
//   groupid: groupid.value,
//   sort: sort.value,
//   keywords: keywords.value,
//   type: type.value,
//   uesr_token:Taro.getStorageSync('userUid'),
// }
// const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
// const encryptedToken = generateAndEncryptToken(data, secret);
export default generateAndEncryptToken;
