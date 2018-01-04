let mix = require('laravel-mix')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');


mix.js('resources/assets/js/app.ts', 'public/js')
  .disableNotifications()
  .sass('resources/assets/sass/app.scss', 'public/css')
  .webpackConfig({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: { appendTsSuffixTo: [/\.vue$/] }
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.vue', '.ts', '.tsx'],
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        defaultSizes: 'gzip'
      })
    ]
  })
  .sourceMaps()
