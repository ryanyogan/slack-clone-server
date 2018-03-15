export const IS_PROD = process.env.NODE_ENV === 'production';

export const SECRET = IS_PROD
  ? process.env.SECRET
  : 'sdfkdsfshsdfksdfjsdfjksdfj3k3jfskd';

export const SECRET_2 = IS_PROD
  ? process.env.SECRET_2
  : 'fjsdfsdfksf93992323rjfjf239jfsdkfsdfsldsj';
