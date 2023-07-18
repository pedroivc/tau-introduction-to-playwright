import { test, expect, type Page } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import {
    BatchInfo,
    Configuration,
    EyesRunner,
    ClassicRunner,
    VisualGridRunner,
    BrowserType,
    DeviceName,
    ScreenOrientation,
    Eyes,
    Target
} from '@applitools/eyes-playwright';

export const USE_ULTRAFAST_GRID: boolean = false;
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
let eyes: Eyes;

const URL = 'https://playwright.dev/';
let homePage: HomePage;

test.beforeAll(async() =>{
    if (USE_ULTRAFAST_GRID) {
        Runner = new VisualGridRunner({ testConcurrency: 5 });
    }
    else{
        Runner = new ClassicRunner();
    }

    const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner'
    Batch = new BatchInfo({name: `Playwright website - ${runnerName}`});

    Config = new Configuration();
    Config.setApiKey("APPLITOOLS_API_KEY");

    Config.setBatch(Batch);
    if(USE_ULTRAFAST_GRID) {
        Config.addBrowser(800, 600, BrowserType.CHROME);
        Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
        Config.addBrowser(1024, 768, BrowserType.SAFARI);
        Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
        Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
    }
});

test.beforeEach(async ({page}) => {
    eyes = new Eyes(Runner, Config);
    await eyes.open(
        page,
        'Playwright',
        test.info().title,
        { width: 1024, height: 768 }
    );

    await page.goto(URL);
    homePage = new HomePage(page);
});

test.afterEach(async () => {
    await eyes.close();
});

test.afterAll(async () => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results);
});

async function clickGetStarted(page:Page) {
    await homePage.clickGetStarted();
}

test.describe('Playwright website', () => {
    test('has title', async () => {  
        // Expect a title "to contain" a substring.
        await homePage.assertPageTitle();
        await eyes.check('Home page', Target.window().fully());
    });
    
    test('get started link', async ({ page }) => {  
        // Click the get started link.
        await clickGetStarted(page);

        // Expects the URL to contain intro.
        await expect(page).toHaveURL(/.*intro/);
        await eyes.check('Get Started page', Target.window().fully().layout());
    });
    
    test.only('Check Java page', async ({page}) => {  
        await clickGetStarted(page);
        await page.getByRole('button', {name: 'Node.js'}).hover();
        await page.getByText('Java', {exact: true}).click();
    
        await expect(page).toHaveURL('https://playwright.dev/java/docs/intro');
        await expect(page.getByText('Installing Playwright', {exact:true})).not.toBeVisible();
    
        const javaDescription = `Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation.`
        await expect(page.getByText(javaDescription)).toBeVisible();
        await eyes.check('Java page', Target.window().fully().ignoreColors());
    })
});