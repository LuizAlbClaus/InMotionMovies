import os
from PIL import Image
from collections import Counter

path = "/Users/luizalbertoclausmaronna/Desktop/Antigravity Projects/InMotionMovies/public/logos/logo-governo-sc.png"
if os.path.exists(path):
    with Image.open(path) as img:
        img = img.convert("RGBA")
        pixels = list(img.getdata())
        # Print top 15 most common colors
        counter = Counter(pixels)
        print("Top 15 most common colors:")
        for color, count in counter.most_common(15):
            print(f"Color {color}: {count} pixels ({count/len(pixels)*100:.2f}%)")
        
        # Check corner colors to guess background
        w, h = img.size
        corners = [
            img.getpixel((0, 0)),
            img.getpixel((w-1, 0)),
            img.getpixel((0, h-1)),
            img.getpixel((w-1, h-1))
        ]
        print(f"Corner colors: {corners}")
else:
    print("File not found")
