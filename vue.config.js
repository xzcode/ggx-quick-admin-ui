const path = require('path');
module.exports = {
    // publicPath: '/w01',
    productionSourceMap: false,
    configureWebpack: {
        resolve: {
            alias: {
                'quick-admin': path.resolve('./src')
            }
        }
    }
};
