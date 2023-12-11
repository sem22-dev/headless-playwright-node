
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function scrapeAndSave() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/path/to/chrome', // Update this path with the correct one
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  });

  const page = await context.newPage();

  try {
    await page.setViewportSize({ width: 1366, height: 768 });
    
    await page.goto('https://livecounts.io/embed/twitter-live-follower-counter/Thotsem22', { waitUntil: 'domcontentloaded', timeout: 0 });
    
    await page.waitForTimeout(5000);

    const followerCount = await page.evaluate(() => {
      const followerCountElements = Array.from(document.querySelectorAll('.odometer-value')).slice(0, 9);
      return followerCountElements.map(element => element.textContent).join('');
    });

    console.log(`Twitter Follower Count: ${followerCount}`);

    const folderPath = path.join(__dirname, 'followerlist');
    const filePath = path.join(folderPath, 'followerlist.json');

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
    // Close the browser
    await browser.close();
  }
}

// Set an interval to execute the scraping and saving function every 5 seconds (5000 milliseconds)
setInterval(scrapeAndSave, 5000);