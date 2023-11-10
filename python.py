from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import json
import os

# Replace 'path/to/chromedriver' with the actual path to your ChromeDriver executable
driver_path = '/Users/thotsemjajo/Desktop/chromedriver_mac64'

# Use the ChromeOptions class to set the executable path
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument(f'--webdriver={driver_path}')

# Create a ChromeDriver instance with the specified options
driver = webdriver.Chrome(options=chrome_options)

# Open the Twitter follower count page
driver.get('https://livecounts.io/embed/twitter-live-follower-counter/nutri1498811')

# Wait for the page to load (adjust the sleep time as needed)
time.sleep(5)

# Find the first and second elements with the class name 'odometer-value'
follower_count_elements = driver.find_elements(By.CLASS_NAME, 'odometer-value')[:10]

# Get the text from each element and concatenate them
follower_count = ''.join([element.text for element in follower_count_elements])

# Print and save the Twitter Follower Count
print(f'Twitter Follower Count: {follower_count}')

# Define the folder and file paths
folder_path = '/Users/thotsemjajo/Desktop/followerlist'
file_path = os.path.join(folder_path, 'followerlist.json')

# Check if the folder exists, create it if not
if not os.path.exists(folder_path):
    os.makedirs(folder_path)

# Check if the JSON file exists
if os.path.exists(file_path):
    # Load existing data from the JSON file
    with open(file_path, 'r') as file:
        data = json.load(file)
else:
    # Create a new dictionary if the file doesn't exist
    data = {}

# Update or add the new follower count
data['followtech'] = follower_count

# Save the updated data to the JSON file
with open(file_path, 'w') as file:
    json.dump(data, file, indent=2)

# Close the browser window
driver.quit()

