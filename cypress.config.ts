import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:8080',
    // One viewport for the whole suite. Neon resolves staves from cursor
    // coordinates (`getStaffByCoords`), so the viewport size changes what a
    // click or a fixed drag offset actually hits -- specs must not each pick
    // their own. These are the `macbook-13` dimensions the majority of the
    // suite already asked for. See issue #1039.
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    numTestsKeptInMemory: 0,
    retries: 2,
  },
});
