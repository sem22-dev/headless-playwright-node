const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

async function scrapeAndSave() {
  try {
    // Fetch HTML content from the website
    const response = await axios.get('https://livecounts.io/embed/twitter-live-follower-counter/Thotsem22');
    const html = response.data;

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract follower count
    const followerCountElements = $('.odometer-value').slice(0, 9);
    const followerCount = followerCountElements.map((index, element) => $(element).text()).get().join('');

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
  }
}

// Set an interval to execute the scraping and saving function every 10 minutes (600,000 milliseconds)
setInterval(scrapeAndSave, 5000);
