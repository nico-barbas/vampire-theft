const path = require('path')

// Generates a HTML5 file that includes all generated webpack bundles via script tags
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Copies individual files or entire directories, which already exist, to the build directory.
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Uses tsconfig paths as resolver aliases without having to declare them separately
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: {
    app: './src/app.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 8080,
    static: path.resolve(__dirname, 'src'),
    open: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
        use: ['url-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      app: path.resolve(process.cwd(), 'src/app'),
      assets: path.resolve(process.cwd(), 'src/assets')
    },
    plugins: [
      new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/**/*',
          to: 'assets/[name][ext]'
        }
      ]
    })
  ]
}
