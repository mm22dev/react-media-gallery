const path = require('path')

module.exports = (env, options) => {
  const isDevMode = options.mode === 'development'
  return {
    entry: {
      popreactrox: path.join(__dirname, '/src/index.js')
    },
    output: {
      libraryTarget: 'umd',
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].map'
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      modules: ['node_modules']
    },
    devtool: isDevMode ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(s*)css$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    watch: isDevMode
  }
}
