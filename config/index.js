import ComponentsPlugin from 'unplugin-vue-components/webpack'
import NutUIResolver from '@nutui/auto-import-resolver'
const config = {
  projectName: 'APP',
  date: '2024-2-22',
  plugins: ['@tarojs/plugin-html'],
  designWidth (input) {
    // 配置 NutUI 375 尺寸
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375
    }
    // 全局使用 Taro 默认的 750 尺寸
    return 750
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'vue3',
  compiler: 'webpack5',
  cache: {
    enable: true,
  },
  mini: {
    webpackChain (chain) {
      chain.merge({
        module: {
          rule: {
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve('babel-loader')
                }
              }
            }
          }
        }
      })
      chain.plugin('unplugin-vue-components').use(ComponentsPlugin({
        resolvers: [NutUIResolver({taro: true})]
      }))
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
