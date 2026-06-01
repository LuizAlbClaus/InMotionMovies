import os
from PIL import Image

path = "/Users/luizalbertoclausmaronna/Desktop/Antigravity Projects/InMotionMovies/public/logos/logo-governo-sc-white.png"
if os.path.exists(path):
    with Image.open(path) as img:
        print(f"Format: {img.format}")
        print(f"Mode: {img.mode}")
        print(f"Size: {img.size}")
        if 'A' in img.mode:
            extrema = img.getextrema()
            print(f"Extrema (including alpha): {extrema}")
            # Check if there are transparent pixels
            alpha = img.split()[-1]
            alpha_data = list(alpha.getdata())
            transparent_count = sum(1 for p in alpha_data if p < 128)
            opaque_count = sum(1 for p in alpha_data if p >= 128)
            print(f"Transparent pixels (<128): {transparent_count}")
            print(f"Opaque pixels (>=128): {opaque_count}")
        else:
            print("No Alpha channel!")
else:
    print("File not found")
