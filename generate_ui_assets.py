from PIL import Image, ImageDraw

def create_rookie_badge():
    w, h = 80, 50
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    # Shield shape
    draw.polygon([(40, 2), (76, 12), (64, 42), (40, 48), (16, 42), (4, 12)], fill=(234, 179, 8, 255), outline=(161, 98, 7, 255), width=2)
    draw.polygon([(40, 6), (72, 15), (61, 39), (40, 44), (19, 39), (8, 15)], fill=(30, 41, 59, 255))
    # Star & text
    draw.text((22, 14), "★", fill=(250, 204, 21, 255))
    draw.text((15, 26), "ROOKIE", fill=(255, 255, 255, 255))
    im.save("public/assets/images/ui/hud_rookie.png", "PNG")
    print("Created clean rookie badge!")

def create_team_badges():
    # Texas Home Badge (Star & T)
    im_tex = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d_tex = ImageDraw.Draw(im_tex)
    d_tex.ellipse([4, 4, 60, 60], fill=(30, 58, 138, 255), outline=(220, 38, 38, 255), width=3)
    d_tex.text((24, 16), "T", fill=(255, 255, 255, 255))
    d_tex.text((22, 34), "TEX", fill=(245, 158, 11, 255))
    im_tex.save("public/assets/images/ui/hud_tex_badge.png", "PNG")

    # Oakland Away Badge (Green & Gold A)
    im_oak = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d_oak = ImageDraw.Draw(im_oak)
    d_oak.ellipse([4, 4, 60, 60], fill=(20, 83, 45, 255), outline=(234, 179, 8, 255), width=3)
    d_oak.text((24, 16), "A", fill=(250, 204, 21, 255))
    d_oak.text((20, 34), "OAK", fill=(255, 255, 255, 255))
    im_oak.save("public/assets/images/ui/hud_oak_badge.png", "PNG")

    # Avatar Slugger icon
    im_av = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d_av = ImageDraw.Draw(im_av)
    d_av.ellipse([2, 2, 62, 62], fill=(29, 78, 216, 255), outline=(250, 204, 21, 255), width=2)
    d_av.text((20, 18), "⚾", fill=(255, 255, 255, 255))
    im_av.save("public/assets/images/ui/hud_avatar.png", "PNG")
    print("Created clean UI badges and logos!")

if __name__ == "__main__":
    create_rookie_badge()
    create_team_badges()
