const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (config, options) => {
  // Adiciona o plugin ESLint à configuração do Webpack
  config.plugins.push(
    new ESLintPlugin({
      extensions: ['ts', 'html'],
      emitWarning: true,
      emitError: true,
      failOnError: true,
      overrideConfigFile: './.eslintrc.json',
      context: 'src',
      lintDirtyModulesOnly: true,
    })
  );

  return config;
};