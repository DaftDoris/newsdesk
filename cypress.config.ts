/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
    },
  },
  port: 3001,
  chromeWebSecurity: false,
  viewportWidth: 1920,
  viewportHeight: 1920,
  projectId: "aoadny",
})
