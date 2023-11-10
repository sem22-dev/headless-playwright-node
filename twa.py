from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Replace 'path/to/chromedriver' with the actual path to your ChromeDriver executable
driver_path = '/Users/thotsemjajo/Desktop/chromedriver_mac64'

# Use the ChromeOptions class to set the executable path and enable headless mode
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument(f'--webdriver={driver_path}')
chrome_options.add_argument('--headless')  # Add this line for headless mode

# Function to get follower count
def get_follower_count():
    driver = webdriver.Chrome(options=chrome_options)
    driver.get('https://livecounts.io/twitter-live-follower-counter/elonmusk')
    time.sleep(5)  # Wait for the page to load (adjust the sleep time as needed)
    follower_count_elements = driver.find_elements(By.CLASS_NAME, 'odometer-value')[:9]
    follower_count = ''.join([element.text for element in follower_count_elements])
    driver.quit()
    return follower_count

# Run the script in a loop, updating every 5 seconds
while True:
    follower_count = get_follower_count()
    print(f'Twitter Follower Count: {follower_count}')
    time.sleep(5)
