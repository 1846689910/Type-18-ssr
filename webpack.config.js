/**
 *  reference: https://github.com/jantimon/html-webpack-plugin
 *  根据template.html生成所需的index.html, 并且引用合适的bundle.js
 * */
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * reference: https://github.com/johnagan/clean-webpack-plugin
 * 在build bundle.js时，清理原有的文件
 * */
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const preloadedFiles = require("./preloaded-files")(__dirname);
const { APP_SERVER } = process.env;
module.exports = env => ({
  // 在package.json的scripts中使用 --env.xxx=123传入参数就可以在这里用env.xxx获取到. config要改成module.exports=env=>object
  mode: env.production ? "production" : "development",
  entry: [
    "webpack-hot-middleware/client?quiet=true",
    "@babel/polyfill",
    ...preloadedFiles,
    `${__dirname}/src/client/js/index.jsx`
  ],
  output: {
    path: `${__dirname}/dist`, // packed file directory
    publicPath: "/",
    filename: env.ssr
      ? "main.bundle.js"
      : env.production
        ? "bundle.[contenthash].js"
        : "bundle.[hash].js" // name of packed file
  },
  devtool: "eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"), // 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录
    historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    inline: true, // 设置为true，当源文件改变时会自动刷新页面
    port: 8080 // 设置默认监听端口，如果省略，默认为”8080“
  },

  // optimization: {
  //     runtimeChunk: 'single',
  //     splitChunks: {
  //         chunks: 'all',  // split code in app and node_modules into bundle and vendor.bundle.js
  //         maxInitialRequests: Infinity,
  //         minSize: 0,
  //         cacheGroups: {  // keep splitting the node_modules chunks
  //             vendor: {
  //                 test: /[\\/]node_modules[\\/]/,
  //                 name(module) {
  //                     // get the name. E.g. node_modules/packageName/not/this/part.js
  //                     // or node_modules/packageName
  //                     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

  //                     // npm package names are URL-safe, but some servers don't like @ symbols
  //                     return `npm.${packageName.replace('@', '')}`;
  //                 },
  //             },
  //         },
  //     },
  // },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
              cacheDirectory: true,
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-syntax-dynamic-import",
                "transform-class-properties",
                "css-modules-transform",
                [
                  "react-css-modules",
                  {
                    webpackHotModuleReloading: true,
                    generateScopedName: `${
                      (APP_SERVER && APP_SERVER.endsWith("dev")) || env.development
                        ? "[name]__[local]___"
                        : ""
                    }[hash:base64:5]`
                  }
                ],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                "@babel/proposal-object-rest-spread"
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "underscore-template-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(css)$/,
        use: ExtractTextWebpackPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: `${
                  (APP_SERVER && APP_SERVER.endsWith("dev")) || env.development
                    ? "[name]__[local]___"
                    : ""
                }[hash:base64:5]`
              }
            }
          ]
        })
      },
      {
        test: /\.(scss|sass)$/, // 之后就可以在js中直接import ".../xxx.scss"文件作为css的替代品
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader"
            // options: {
            //   modules: true,
            //   localIdentName: `${env.production ? "" : "[name]__[local]___"}[hash:base64:5]`, //在npm run prod时文档的class会进一步缩减
            // },
          },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader?limit=100000", // 文件大小超过 100000 bytes, 会自动使用file-loader
            // loader: 'file-loader',  // 如果项目中对路径要求严格，此处也可用file-loader来显式地将文件添加至dist中
            options: {
              emitFile: true,
              name: "./images/[name].[ext]" // 这个相对路径是基于`${__dirname}/dist/...`
            }
          }
        ]
      },
      {
        test: /\.ico$/,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: true,
              name: "./[name].[ext]" // 这个相对路径是基于`${__dirname}/dist/...`
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?v=.*)?$/,
        use: [
          {
            loader: "url-loader?limit=100000",
            // loader: "file-loader",
            options: {
              name: "./fonts/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"] // 引入js相关文件可以省略扩展名
  },
  plugins: [
    new CleanWebpackPlugin(
      [
        // the path(s) that should be cleaned
        "dist/*.*"
      ],
      {
        // the clean options to use
        root: __dirname,
        exclude: [],
        verbose: false
      }
    ),
    new HtmlWebpackPlugin({
      title: "type-18-ssr",
      template: "./template/template-ssr.html",
      filename: "./main.html"
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProvidePlugin({
      // 使得在项目各处都可以通过$引用jQuery，并且bootstrap也可以找到jquery
      $: "jquery",
      jQuery: "jquery",
      jquery: "jquery"
    }),
    new ExtractTextWebpackPlugin({ filename: "main.bundle.css", allChunks: true }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
