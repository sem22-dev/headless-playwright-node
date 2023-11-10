const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const browserExecutablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: browserExecutablePath,
    headless: false, // Set to true for headless mode
  });

  const page = await browser.newPage();

  await page.goto('https://livecounts.io/embed/twitter-live-follower-counter/Thotsem22');
  await page.waitForTimeout(5000);

  const followerCountElements = await page.$$eval('.odometer-value', elements => elements.slice(0, 9).map(element => element.textContent));
  const followerCount = followerCountElements.join('');

  console.log(`Twitter Follower Count: ${followerCount}`);

  const folderPath = path.join(__dirname, 'followerlist');
  const filePath = path.join(folderPath, 'followerlist.json');

  try {
    // Create the folder if it doesn't exist
    await fs.mkdir(folderPath, { recursive: true });

    // Update or add the new follower count
    let data = {};
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const fileContent = await fs.readFile(filePath, 'utf8');
      data = JSON.parse(fileContent);
    }

    data.followtech = followerCount;

    // Save the updated data to the JSON file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
