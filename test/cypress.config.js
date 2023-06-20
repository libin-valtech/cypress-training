const { defineConfig } = require('cypress')
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      await addCucumberPreprocessorPlugin(on, config);
      
      on(
        "file:preprocessor",
            createBundler({
            plugins: [createEsbuildPlugin(config)],
            })
          
      );
      
      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
    specPattern: [
      'cypress/**/*.feature',
      'cypress/**/*.spec.js'
    ],
  },
});
