import os
from PIL import Image

path = "/Users/luizalbertoclausmaronna/Desktop/Antigravity Projects/InMotionMovies/public/logos/logo-governo-sc.png"
if os.path.exists(path):
    with Image.open(path) as img:
        print(f"Format: {img.format}")
        print(f"Mode: {img.mode}")
        print(f"Size: {img.size}")
        if 'A' in img.mode:
            extrema = img.getextrema()
            print(f"Extrema (including alpha): {extrema}")
        else:
            print("No Alpha channel!")
else:
    print("File not found")
