import math
from PIL import Image, ImageDraw, ImageFilter

def create_stadium():
    # 1200 x 720 HD Stadium
    w, h = 1200, 720
    im = Image.new("RGBA", (w, h))
    draw = ImageDraw.Draw(im)

    # 1. Vibrant Cartoon Blue Sky with gradient
    for y in range(260):
        t = y / 260.0
        r = int(56 + t * 40)
        g = int(145 + t * 50)
        b = int(245 - t * 20)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # White fluffy cartoon clouds
    clouds = [
        (150, 70, 70), (200, 60, 90), (260, 70, 65),
        (850, 80, 80), (910, 70, 100), (980, 80, 75),
        (520, 50, 75), (580, 45, 95), (640, 50, 70)
    ]
    for cx, cy, cr in clouds:
        draw.ellipse([cx - cr, cy - cr*0.6, cx + cr, cy + cr*0.6], fill=(255, 255, 255, 210))

    # 2. Distant City Skyline / Mountains
    for i in range(25):
        bx = i * 50
        bw = 48
        bh = 45 + (i * 17) % 55
        by = 220 - bh
        draw.rectangle([bx, by, bx + bw, 220], fill=(120, 145, 175, 255), outline=(95, 120, 150, 255))
        # Small windows
        for wy in range(by + 6, 215, 10):
            draw.rectangle([bx + 8, wy, bx + 16, wy + 4], fill=(240, 245, 255, 180))
            draw.rectangle([bx + 26, wy, bx + 34, wy + 4], fill=(240, 245, 255, 180))

    # 3. Yellow Roller Coaster & Grandstand Structure (Signature Syntasia Theme Park Backdrop)
    # Golden coaster track arches
    for i in range(8):
        arc_x = i * 160
        draw.arc([arc_x - 40, 100, arc_x + 160, 260], start=180, end=360, fill=(245, 166, 35, 255), width=6)
        draw.arc([arc_x - 30, 110, arc_x + 150, 260], start=180, end=360, fill=(230, 140, 20, 255), width=3)
        # Vertical steel trestles
        draw.line([(arc_x + 60, 130), (arc_x + 60, 220)], fill=(245, 166, 35, 255), width=4)
        draw.line([(arc_x + 60, 130), (arc_x + 20, 220)], fill=(210, 130, 20, 255), width=2)
        draw.line([(arc_x + 60, 130), (arc_x + 100, 220)], fill=(210, 130, 20, 255), width=2)

    # 4. Outfield Bleachers & Cheering Crowd Tier
    # Bleachers concrete tier
    draw.rectangle([0, 210, w, 275], fill=(70, 85, 105, 255))
    # Crowd multi-color dot matrix
    crowd_colors = [
        (239, 68, 68), (59, 130, 246), (234, 179, 8), (249, 115, 22),
        (255, 255, 255), (168, 85, 247), (34, 197, 94), (14, 165, 233)
    ]
    for row in range(5):
        cy = 215 + row * 11
        for col in range(120):
            cx = col * 10 + (row % 2) * 5
            c = crowd_colors[(col * 7 + row * 13) % len(crowd_colors)]
            draw.ellipse([cx, cy, cx + 6, cy + 8], fill=c)

    # Stadium Floodlight Towers (Left & Right)
    for lx in [140, 1060]:
        draw.line([(lx, 100), (lx - 25, 240)], fill=(180, 195, 210, 255), width=5)
        draw.line([(lx, 100), (lx + 25, 240)], fill=(180, 195, 210, 255), width=5)
        draw.rectangle([lx - 40, 75, lx + 40, 100], fill=(220, 230, 242, 255), outline=(100, 115, 130, 255), width=2)
        for gx in range(lx - 32, lx + 35, 14):
            for gy in range(80, 98, 9):
                draw.ellipse([gx, gy, gx + 8, gy + 8], fill=(255, 255, 220, 255))

    # Center Stadium Jumbotron Scoreboard
    draw.rectangle([460, 145, 740, 225], fill=(30, 41, 59, 255), outline=(245, 158, 11, 255), width=4)
    draw.rectangle([470, 153, 730, 217], fill=(15, 23, 42, 255))
    draw.text((540, 162), "BASEBALL HEROES", fill=(250, 204, 21, 255))
    draw.text((515, 185), "HOME  0  -  0  AWAY", fill=(255, 255, 255, 255))

    # 5. Outfield Green Wall (Syntasia Signature Emerald Padded Wall)
    draw.rectangle([0, 270, w, 320], fill=(22, 101, 52, 255), outline=(20, 83, 45, 255), width=3)
    # Yellow home run boundary line atop the wall
    draw.line([(0, 270), (w, 270)], fill=(250, 204, 21, 255), width=5)

    # Wall padding seams and distance markers
    for x in range(0, w, 80):
        draw.line([(x, 272), (x, 320)], fill=(15, 70, 35, 255), width=2)
    # Distance markers
    draw.text((120, 285), "330 FT", fill=(255, 255, 255, 200))
    draw.text((575, 285), "400 FT", fill=(255, 255, 255, 200))
    draw.text((1030, 285), "330 FT", fill=(255, 255, 255, 200))

    # 6. Deep Outfield Warning Track (Reddish-brown clay)
    draw.polygon([(0, 320), (w, 320), (w, 355), (0, 355)], fill=(180, 95, 45, 255))

    # 7. Outfield & Infield Lawn with Lawn Mower Striping Pattern
    # Outer green lawn
    for y in range(355, 460):
        t = (y - 355) / 105.0
        # Alternating diagonal or vertical stripe bands
        for x in range(0, w, 60):
            stripe_color = (34, 197, 94, 255) if (x // 60) % 2 == 0 else (22, 163, 74, 255)
            draw.rectangle([x, y, x + 60, y + 1], fill=stripe_color)

    # Infield Diamond Dirt Cutout (Clay arc)
    # Infield dirt bounds: centered at x=600, y=720, radiating up to y=420
    draw.ellipse([200, 370, 1000, 850], fill=(195, 125, 75, 255), outline=(160, 95, 50, 255), width=3)

    # Infield Inner Grass Diamond
    draw.polygon([(600, 430), (840, 560), (600, 690), (360, 560)], fill=(34, 197, 94, 255))
    # Inner grass mowing stripes
    for stripe in range(380, 820, 45):
        if stripe % 90 == 0:
            draw.polygon([(600, 440), (stripe, 560), (600, 680), (1200 - stripe, 560)], fill=(22, 163, 74, 160))

    # Running baseline dirt tracks (1st, 2nd, 3rd)
    draw.line([(600, 700), (870, 550)], fill=(195, 125, 75, 255), width=26)
    draw.line([(870, 550), (600, 420)], fill=(195, 125, 75, 255), width=26)
    draw.line([(600, 420), (330, 550)], fill=(195, 125, 75, 255), width=26)
    draw.line([(330, 550), (600, 700)], fill=(195, 125, 75, 255), width=26)

    # Bright White Chalk Lines (Foul lines radiating from home plate to corners)
    draw.line([(600, 695), (1150, 320)], fill=(255, 255, 255, 255), width=4)
    draw.line([(600, 695), (50, 320)], fill=(255, 255, 255, 255), width=4)

    # Bases (1st, 2nd, 3rd Base Bags)
    def draw_base(bx, by):
        draw.polygon([(bx, by - 10), (bx + 14, by), (bx, by + 10), (bx - 14, by)], fill=(255, 255, 255, 255), outline=(180, 180, 180, 255))
    draw_base(870, 550) # 1st base
    draw_base(600, 420) # 2nd base
    draw_base(330, 550) # 3rd base

    # Pitcher Mound Clay Hill & Pitching Rubber (Centered at x=600, y=520 in 1200x720)
    draw.ellipse([540, 490, 660, 550], fill=(210, 140, 85, 255), outline=(175, 110, 60, 255), width=2)
    # White Pitcher's Plate Rubber
    draw.rectangle([585, 516, 615, 523], fill=(255, 255, 255, 255), outline=(160, 160, 160, 255))

    # Home Plate Area Clay Circle (at bottom center)
    draw.ellipse([450, 640, 750, 760], fill=(195, 125, 75, 255))

    # 100% CLEAN STADIUM: Zero characters, zero text watermarks, zero blur.
    im.save("public/assets/images/stadium/bh_stadium_1200.png", "PNG")
    im.save("public/assets/images/stadium/bh_stadium_perfect.png", "PNG")
    print("Created pristine vector-quality stadium backgrounds!")

def create_batter():
    # 260 x 374 HD Chibi Batter Sprite (Crisp RGBA with 0 transparent artifacts)
    w, h = 260, 374
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # Chibi character proportions: Large head, dynamic slugger pose, holding upright wood bat
    # Bat: Tilted upward to the left
    # Bat handle & knob
    bat_knob_x, bat_knob_y = 105, 175
    # Bat barrel tip
    bat_tip_x, bat_tip_y = 45, 30
    draw.line([(bat_knob_x, bat_knob_y), (bat_tip_x, bat_tip_y)], fill=(225, 175, 110, 255), width=22)
    # Bat barrel taper
    draw.line([(bat_knob_x - 15, bat_knob_y - 25), (bat_tip_x, bat_tip_y)], fill=(245, 195, 130, 255), width=26)
    # Bat barrel top cap
    draw.ellipse([bat_tip_x - 12, bat_tip_y - 12, bat_tip_x + 12, bat_tip_y + 12], fill=(225, 175, 110, 255))
    # Bat black grip tape
    draw.line([(bat_knob_x, bat_knob_y), (bat_knob_x - 20, bat_knob_y - 35)], fill=(30, 30, 30, 255), width=16)
    # "EXTREME" Red brand decal on barrel
    draw.rectangle([65, 65, 82, 110], fill=(220, 38, 38, 255))

    # Feet & Spikes (Left & Right cleats)
    # Back foot (left)
    draw.ellipse([80, 340, 125, 368], fill=(15, 23, 42, 255), outline=(59, 130, 246, 255), width=2)
    draw.rectangle([85, 362, 120, 367], fill=(255, 255, 255, 255)) # White sole
    # Front foot (right)
    draw.ellipse([145, 340, 195, 368], fill=(15, 23, 42, 255), outline=(59, 130, 246, 255), width=2)
    draw.rectangle([150, 362, 190, 367], fill=(255, 255, 255, 255)) # White sole

    # Legs & Baseball Pants (White with royal blue side piping)
    # Left leg
    draw.polygon([(92, 260), (125, 260), (120, 345), (88, 345)], fill=(248, 250, 252, 255), outline=(203, 213, 225, 255))
    draw.line([(90, 265), (89, 342)], fill=(29, 78, 216, 255), width=4) # Blue piping
    # Right leg
    draw.polygon([(145, 260), (180, 260), (185, 345), (150, 345)], fill=(248, 250, 252, 255), outline=(203, 213, 225, 255))
    draw.line([(180, 265), (184, 342)], fill=(29, 78, 216, 255), width=4) # Blue piping

    # Blue belt & waist
    draw.rectangle([105, 250, 170, 262], fill=(29, 78, 216, 255))
    draw.rectangle([132, 251, 144, 261], fill=(245, 158, 11, 255)) # Gold belt buckle

    # Torso: Royal Blue & White Jersey with Syntasia Number #3
    draw.polygon([(100, 175), (175, 175), (165, 252), (105, 252)], fill=(29, 78, 216, 255), outline=(30, 58, 138, 255), width=3)
    # Jersey front white button stripe
    draw.line([(135, 175), (135, 252)], fill=(255, 255, 255, 255), width=5)

    # Arms and Batting Gloves
    # Back arm & glove holding bat
    draw.ellipse([92, 170, 118, 196], fill=(234, 179, 8, 255), outline=(180, 120, 5, 255), width=2)
    # Front arm & glove gripping bat
    draw.ellipse([108, 160, 134, 186], fill=(234, 179, 8, 255), outline=(180, 120, 5, 255), width=2)

    # Chibi Large Head & Helmet
    # Head skin (anime chibi skin tone)
    head_cx, head_cy, head_r = 145, 115, 62
    draw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(254, 215, 170, 255))

    # Chibi Face Features
    # Big expressive anime eye
    draw.ellipse([160, 105, 186, 135], fill=(30, 41, 59, 255))
    draw.ellipse([168, 110, 182, 124], fill=(255, 255, 255, 255)) # Eye highlight
    # Eyebrow
    draw.arc([158, 92, 190, 108], start=200, end=350, fill=(71, 85, 105, 255), width=4)
    # Confident slugger smile
    draw.arc([165, 132, 185, 148], start=20, end=150, fill=(225, 29, 72, 255), width=3)

    # Glossy Blue Batting Helmet with Ear Flap & Visor
    draw.ellipse([head_cx - head_r - 4, head_cy - head_r - 8, head_cx + head_r + 4, head_cy + 15], fill=(30, 64, 175, 255), outline=(23, 37, 84, 255), width=3)
    # Helmet visor bill (extending forward to right)
    draw.polygon([(head_cx + 25, head_cy - 10), (head_cx + 82, head_cy), (head_cx + 50, head_cy + 18), (head_cx + 15, head_cy + 15)], fill=(29, 78, 216, 255), outline=(23, 37, 84, 255), width=2)
    # Ear flap guard
    draw.ellipse([head_cx - 15, head_cy + 10, head_cx + 35, head_cy + 65], fill=(30, 64, 175, 255), outline=(23, 37, 84, 255), width=2)
    # Helmet gloss highlight shine
    draw.arc([head_cx - 40, head_cy - 65, head_cx + 40, head_cy - 20], start=200, end=310, fill=(147, 197, 253, 255), width=6)

    # Save 130x187 proportional HD sprite
    batter_res = im.resize((130, 187), Image.Resampling.LANCZOS)
    batter_res.save("public/assets/images/characters/bh_batter_intact_clean.png", "PNG")
    batter_res.save("public/assets/images/characters/batter.png", "PNG")
    print("Created pristine chibi batter character sprite!")

def create_pitcher():
    # 140 x 128 HD Pitcher Sprite
    w, h = 140, 128
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # Pitcher facing home plate (rear/side dynamic angle on mound)
    # Cleats
    draw.ellipse([38, 108, 62, 122], fill=(15, 23, 42, 255))
    draw.ellipse([78, 108, 102, 122], fill=(15, 23, 42, 255))

    # White Pants
    draw.polygon([(42, 70), (64, 70), (60, 114), (40, 114)], fill=(241, 245, 249, 255), outline=(203, 213, 225, 255))
    draw.polygon([(76, 70), (98, 70), (100, 114), (80, 114)], fill=(241, 245, 249, 255), outline=(203, 213, 225, 255))

    # Emerald Green / Black Opponent Jersey (Sandlot Bandits / Grizzlies)
    draw.polygon([(46, 36), (94, 36), (90, 75), (50, 75)], fill=(21, 128, 61, 255), outline=(20, 83, 45, 255), width=2)
    draw.text((64, 45), "#9", fill=(255, 255, 255, 255))

    # Pitching Glove on left hand
    draw.ellipse([30, 42, 54, 66], fill=(180, 83, 9, 255), outline=(120, 53, 15, 255), width=2)

    # Baseball in right pitching hand
    draw.ellipse([88, 40, 106, 58], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255))
    # Red seam curve on ball
    draw.arc([92, 44, 102, 54], start=30, end=210, fill=(239, 68, 68, 255), width=2)

    # Pitcher Cap and Head
    head_cx, head_cy, head_r = 70, 26, 22
    draw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(254, 215, 170, 255))
    # Green Baseball Cap
    draw.ellipse([head_cx - head_r - 2, head_cy - head_r - 2, head_cx + head_r + 2, head_cy + 6], fill=(22, 101, 52, 255), outline=(20, 83, 45, 255), width=2)
    # Cap visor pointing forward
    draw.polygon([(head_cx + 10, head_cy - 4), (head_cx + 30, head_cy + 4), (head_cx + 12, head_cy + 9)], fill=(21, 128, 61, 255))

    im.save("public/assets/images/characters/bh_pitcher_transparent.png", "PNG")
    im.save("public/assets/images/characters/pitcher.png", "PNG")
    print("Created pristine chibi pitcher character sprite!")

def create_ball():
    # 32 x 32 Baseball with red stitches
    im = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw.ellipse([2, 2, 29, 29], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=2)
    # Red laces
    draw.arc([6, 6, 25, 25], start=45, end=135, fill=(220, 38, 38, 255), width=2)
    draw.arc([6, 6, 25, 25], start=225, end=315, fill=(220, 38, 38, 255), width=2)
    im.save("public/assets/images/characters/bh_ball_clean.png", "PNG")
    print("Created clean baseball sprite!")

def create_avatars():
    # Generate 10 clean vector chibi face portraits for lineups
    names = ['aaron', 'andy', 'anton', 'fonzo', 'jake', 'kirby', 'kyle', 'leon', 'lucas', 'marco']
    cap_colors = [
        (220, 38, 38), (37, 99, 235), (234, 179, 8), (147, 51, 234), (16, 185, 129),
        (249, 115, 22), (13, 148, 136), (225, 29, 72), (79, 70, 229), (100, 116, 139)
    ]
    for i, name in enumerate(names):
        im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(im)
        # Background circle badge
        draw.ellipse([2, 2, 61, 61], fill=(30, 41, 59, 255), outline=(245, 158, 11, 255), width=2)
        # Head skin
        draw.ellipse([14, 18, 50, 54], fill=(254, 215, 170, 255))
        # Baseball Cap
        c = cap_colors[i]
        draw.ellipse([12, 10, 52, 34], fill=c)
        draw.polygon([(26, 28), (56, 28), (44, 34)], fill=(max(0, c[0]-30), max(0, c[1]-30), max(0, c[2]-30), 255))
        # Eyes
        draw.ellipse([22, 32, 28, 40], fill=(15, 23, 42, 255))
        draw.ellipse([36, 32, 42, 40], fill=(15, 23, 42, 255))
        # Smile
        draw.arc([26, 40, 38, 48], start=20, end=160, fill=(185, 28, 28, 255), width=2)
        im.save(f"public/assets/avatars/face_{name}.png", "PNG")
    print("Created 10 pristine chibi avatar portraits!")

if __name__ == "__main__":
    create_stadium()
    create_batter()
    create_pitcher()
    create_ball()
    create_avatars()
    print("ALL CLEAN REGENERATED ASSETS BUILT SUCCESSFULLY!")
