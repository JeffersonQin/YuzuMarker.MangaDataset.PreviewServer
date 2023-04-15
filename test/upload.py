import os
import base64
import requests

IMAGE_FOLDER = os.path.dirname(os.path.abspath(__file__))
SERVER_URL = "http://localhost:3000/api/upload"

# Read all image files in the folder
image_names = os.listdir(IMAGE_FOLDER)
# filter out images
image_names = [
    name for name in image_names if name.split(".")[-1] in ["jpg", "png", "jpeg"]
]
image_data = []
for name in image_names:
    with open(IMAGE_FOLDER + "/" + name, "rb") as f:
        ext = name.split(".")[-1]
        content = base64.b64encode(f.read()).decode("utf-8")
        image_data.append({"ext": ext, "content": content})

# Send the data to the server as POST request
response = requests.post(SERVER_URL, json={"images": image_data})

# Check if the request was successful
if response.status_code == 200:
    print("Images uploaded successfully!")
else:
    print("Error uploading images:", response.text)
