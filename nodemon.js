const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const browserExecutablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function scrapeAndSave() {
  const browser = await puppeteer.launch({
    executablePath: browserExecutablePath,
    headless: 'new',
  });

  const page = await browser.newPage();


  try {
    await page.goto('https://livecounts.io/embed/twitter-live-follower-counter/Thotsem22');
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

// Set an interval to execute the scraping and saving function every 10 minutes (600,000 milliseconds)
setInterval(scrapeAndSave, 5000);
