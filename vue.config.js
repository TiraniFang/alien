const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: true,
    port: 8081,
    open: true,
    proxy: {
      "/method": {
        target: 'http://bs.itytl.cn/', 
        changeOrigin: true,
        pathRewrite: { 
          "^/": "" 
        },
      },
      "/api": {
        target: 'http://192.168.112.88:18018/', 
        changeOrigin: true,
        pathRewrite: { 
          "^/api": "" 
        },
      },
    },
    // setupMiddlewares: (middlewares, devServer) => {
    //   if (!devServer) {
    //     throw new Error('webpack-dev-server is not defined');
    //   }

    //   devServer.app.get('/test', (req, res) => {
    //     res.json({ message: 'Test route working' });
    //   });

    //   return middlewares;
    // },
  },
});
