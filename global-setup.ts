import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  try {
    // Pre-authenticate and save state
    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
    
    // Save authenticated state
    await page.context().storageState({ path: 'auth-state.json' });
    console.log('✅ Authentication state saved');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;