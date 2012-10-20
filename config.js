exports.opts = {
  name: 'nodeV3',
  port: process.env.PORT || 8888,
  home: 'index.html',
  maxAge: 36e5 * 24 * 365,
  compress: /html|js|css|img/ig,
  env: process.env.NODE_ENV || 'development'
};