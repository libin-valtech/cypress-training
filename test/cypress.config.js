const { defineConfig } = require('cypress')
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;

const xlsx = require('node-xlsx').default; 
const fs = require('fs'); // for file


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

      require('cypress-mochawesome-reporter/plugin')(on);

      on('task', { parseXlsx({ filePath }) 
      { return new Promise((resolve, reject) =>
        { try 
         {
            const jsonData = xlsx.parse(fs.readFileSync(filePath)); 
            resolve(jsonData);
            } catch (e) 
            {
               reject(e);
            } });
          }});
        
      

  
      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
    specPattern: [
      'cypress/**/*.feature',
      'cypress/**/*.spec.js',
      'cypress/**/*.cy.js'
    ],
  },
  reporter: 'cypress-mochawesome-reporter',
});
