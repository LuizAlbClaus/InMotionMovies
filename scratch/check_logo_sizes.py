import os
from PIL import Image

logo_dir = "/Users/luizalbertoclausmaronna/Desktop/Antigravity Projects/InMotionMovies/public/logos"
logos = [
    "logo-colcci.png",
    "logo-governo-sc-white.png",
    "logo-prefeitura-florianopolis-white.png",
    "logo-facisc.png",
    "logo-caasc-white.png",
    "logo-unicred.png",
    "logo-coc-floripa-white.png",
    "logo-brasil-atacadista.webp",
    "logo-costao-santinho-white.png",
    "logo-norte-construcoes.png",
    "logo-uniprime.png"
]

for logo in logos:
    path = os.path.join(logo_dir, logo)
    if os.path.exists(path):
        with Image.open(path) as img:
            w, h = img.size
            ratio = w / h
            print(f"{logo}: {w}x{h} (ratio: {ratio:.2f})")
    else:
        print(f"{logo} NOT FOUND")
