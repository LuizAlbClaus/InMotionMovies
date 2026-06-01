import os
from PIL import Image

src_path = "/Users/luizalbertoclausmaronna/Desktop/Antigravity Projects/InMotionMovies/public/logos/logo-governo-sc.png"
dest_path = "/Users/luizalbertoclausmaronna/Desktop/Antigravity Projects/InMotionMovies/public/logos/logo-governo-sc-white.png"

if os.path.exists(src_path):
    with Image.open(src_path) as img:
        img = img.convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            r, g, b, a = item
            # Remove light background (white, light gray)
            if r > 230 and g > 230 and b > 230:
                new_data.append((255, 255, 255, 0)) # transparent
            else:
                # Convert the logo content to solid white with full opacity
                new_data.append((255, 255, 255, 255))
                
        img.putdata(new_data)
        img.save(dest_path, "PNG")
        print("Success! Processed SC logo.")
        
        # Verify transparency of output
        alpha = img.split()[-1]
        alpha_data = list(alpha.getdata())
        transparent_count = sum(1 for p in alpha_data if p < 128)
        opaque_count = sum(1 for p in alpha_data if p >= 128)
        print(f"Transparent pixels in output: {transparent_count}")
        print(f"Opaque pixels in output: {opaque_count}")
else:
    print("Source file not found")
