import { test, expect } from '@playwright/test';

//AAA Patern

// [Arrange]
// [Act]
// [Assert]

const password = process.env.PASSWORD;

test.beforeAll(async ({ playwright }) => {
    test.skip(
        !!process.env.PROD,
        'Test intentionally skipped in production due to data dependency'
    )
    // start a server
    // create a db connection
    // reuse a sign in state
});

test.beforeEach(async({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    // Open a URL
    // Clean up the DB
    // Create a page object
    // Dismiss a modal
    // Load params
});

test.afterAll(async ({ page }, testInfo) => {
    console.log('Test file completed');
    // Close a DB connection
});

test.afterEach( async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

    if(testInfo.status !== testInfo.expectedStatus)
        console.log(`Did not run as expected, ended up at ${page.url()}`);
    // clean up all the data we created for this test through API calls
});

test.describe('Test Case', () => {
    test('Test Scenario One', async ({ page }) => {
        await test.step('Step One', async () =>{
            // ...
        });

        await test.step('Step Two', async () => {
            // ...
        });

        // ...
    });

    test('Test Scenario Two', async ({ page }) => {
        // Arrange
        // Act
        // Assert
    });

    test.only('Test Scenarion Three', async ({ page }) => {
        // Arrange
        // Act
        // Assert
    });

    test.skip('Test Scenario Four', async ({ page }) => {
        // Arrange
        // Act
        // Assert
    });
});

