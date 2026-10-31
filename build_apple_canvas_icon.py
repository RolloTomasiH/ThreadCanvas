import os
import subprocess
from PIL import Image, ImageDraw, ImageFilter

def build_apple_canvas_icon():
    SIZE = 1024
    PAD = 100
    CARD_W = SIZE - 2 * PAD  # 824
    CARD_H = SIZE - 2 * PAD  # 824
    RADIUS = 185  # Apple Big Sur / Sonoma superellipse corner radius

    im = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    # Helper: Super-sampled squircle mask
    def create_squircle_mask(w, h, r):
        mask = Image.new("L", (w * 4, h * 4), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle([0, 0, w * 4, h * 4], radius=r * 4, fill=255)
        return mask.resize((w, h), Image.Resampling.LANCZOS)

    squircle_mask = create_squircle_mask(CARD_W, CARD_H, RADIUS)

    # 1. Apple macOS Ambient Drop Shadows (Clean, natural shadows)
    # Diffuse ambient shadow
    s_diffuse = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    s_draw1 = ImageDraw.Draw(s_diffuse)
    s_draw1.rounded_rectangle([PAD, PAD + 24, PAD + CARD_W, PAD + CARD_H + 24], radius=RADIUS, fill=(0, 0, 0, 48))
    s_diffuse = s_diffuse.filter(ImageFilter.GaussianBlur(28))

    # Tight contact shadow
    s_contact = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    s_draw2 = ImageDraw.Draw(s_contact)
    s_draw2.rounded_rectangle([PAD, PAD + 10, PAD + CARD_W, PAD + CARD_H + 10], radius=RADIUS, fill=(0, 0, 0, 40))
    s_contact = s_contact.filter(ImageFilter.GaussianBlur(10))

    im = Image.alpha_composite(im, s_diffuse)
    im = Image.alpha_composite(im, s_contact)

    # 2. Base Plate: Apple Pearl White Canvas
    slab = Image.new("RGBA", (CARD_W, CARD_H), (255, 255, 255, 255))
    # Subtle vertical gradient from #FFFFFF down to #EDF1F7
    for y in range(CARD_H):
        t = y / float(CARD_H)
        r = int(255 * (1 - t) + 237 * t)
        g = int(255 * (1 - t) + 241 * t)
        b = int(255 * (1 - t) + 247 * t)
        for x in range(CARD_W):
            slab.putpixel((x, y), (r, g, b, 255))

    s_draw = ImageDraw.Draw(slab)

    # Infinite Canvas Grid: Architectural Micro-Dots
    STEP = 52
    for gx in range(48, CARD_W - 36, STEP):
        for gy in range(48, CARD_H - 36, STEP):
            s_draw.ellipse([gx - 1.5, gy - 1.5, gx + 1.5, gy + 1.5], fill=(148, 163, 184, 110))

    # Axis coordinate lines
    s_draw.line([CARD_W // 2, 80, CARD_W // 2, CARD_H - 80], fill=(203, 213, 225, 75), width=1)
    s_draw.line([80, CARD_H // 2, CARD_W - 80, CARD_H // 2], fill=(203, 213, 225, 75), width=1)

    # Inner rim border and top sheen
    s_draw.rounded_rectangle([1, 1, CARD_W - 2, CARD_H - 2], radius=RADIUS, outline=(226, 232, 240, 220), width=2)
    s_draw.line([RADIUS, 1, CARD_W - RADIUS, 1], fill=(255, 255, 255, 255), width=2)

    # Clip slab with squircle mask and paste onto main canvas
    slab.putalpha(squircle_mask)
    im.paste(slab, (PAD, PAD), slab)

    # 3. Floating Infinite Canvas Research Tree
    tree_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tree_layer)

    # Node geometries
    n1_x, n1_y, n1_w, n1_h = 205, 442, 225, 140  # Root Question (Left)
    n2_x, n2_y, n2_w, n2_h = 560, 275, 255, 155  # Alpha Deduction (Top Right)
    n3_x, n3_y, n3_w, n3_h = 560, 560, 255, 155  # Audit & Boundary (Bottom Right)

    # Cubic Bezier Branching Lines
    def draw_bezier(draw, p0, p1, p2, p3, color, width=4):
        steps = 80
        pts = []
        for i in range(steps + 1):
            t = i / float(steps)
            x = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
            y = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
            pts.append((x, y))
        for i in range(len(pts) - 1):
            draw.line([pts[i], pts[i+1]], fill=color, width=width)

    c1_p0 = (n1_x + n1_w, n1_y + n1_h // 2)
    c1_p3 = (n2_x, n2_y + n2_h // 2)
    c1_p1 = (c1_p0[0] + 70, c1_p0[1])
    c1_p2 = (c1_p3[0] - 70, c1_p3[1])

    c2_p0 = (n1_x + n1_w, n1_y + n1_h // 2)
    c2_p3 = (n3_x, n3_y + n3_h // 2)
    c2_p1 = (c2_p0[0] + 70, c2_p0[1])
    c2_p2 = (c2_p3[0] - 70, c2_p3[1])

    # Connecting branches in Apple Slate Gray (#334155)
    draw_bezier(tdraw, c1_p0, c1_p1, c1_p2, c1_p3, (51, 65, 85, 210), width=4)
    draw_bezier(tdraw, c2_p0, c2_p1, c2_p2, c2_p3, (51, 65, 85, 210), width=4)

    # Connection Port Knots
    for pt in [c1_p0, c1_p3, c2_p3]:
        tdraw.ellipse([pt[0] - 6, pt[1] - 6, pt[0] + 6, pt[1] + 6], fill=(30, 41, 59, 255))
        tdraw.ellipse([pt[0] - 2.5, pt[1] - 2.5, pt[0] + 2.5, pt[1] + 2.5], fill=(255, 255, 255, 255))

    # Floating Cards with Soft Blur Shadows
    for (x, y, w, h, accent, sk_lines) in [
        (n1_x, n1_y, n1_w, n1_h, (15, 23, 42, 255), 3),      # Root (Obsidian)
        (n2_x, n2_y, n2_w, n2_h, (16, 185, 129, 255), 4),    # Alpha (Emerald)
        (n3_x, n3_y, n3_w, n3_h, (2, 132, 199, 255), 4)      # Infra (Azure)
    ]:
        # Card shadow
        c_shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        cs_draw = ImageDraw.Draw(c_shadow)
        cs_draw.rounded_rectangle([x, y + 8, x + w, y + h + 8], radius=20, fill=(0, 0, 0, 36))
        c_shadow = c_shadow.filter(ImageFilter.GaussianBlur(12))
        tree_layer = Image.alpha_composite(tree_layer, c_shadow)

        # Card body
        card_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        cdraw = ImageDraw.Draw(card_layer)
        # Crisp white card surface
        cdraw.rounded_rectangle([x, y, x + w, y + h], radius=20, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
        # Header separator
        cdraw.line([x, y + 36, x + w, y + 36], fill=(241, 245, 249, 255), width=1)
        # Accent pill
        cdraw.rounded_rectangle([x + 16, y + 14, x + 36, y + 24], radius=4, fill=accent)
        # Title skeleton
        cdraw.rounded_rectangle([x + 44, y + 16, x + 115, y + 22], radius=3, fill=(148, 163, 184, 160))

        # Body skeleton lines
        cur_y = y + 50
        for i in range(sk_lines):
            line_w = int(w * (0.82 if i == 0 else (0.72 if i == 1 else (0.58 if i == 2 else 0.45))))
            cdraw.rounded_rectangle([x + 16, cur_y, x + 16 + line_w, cur_y + 7], radius=3, fill=(203, 213, 225, 220))
            cur_y += 17

        tree_layer = Image.alpha_composite(tree_layer, card_layer)

    im = Image.alpha_composite(im, tree_layer)

    # Save Master PNG
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_dir = os.path.join(script_dir, "resources", "icons")
    os.makedirs(out_dir, exist_ok=True)
    master_png = os.path.join(out_dir, "AppleCanvasPro.png")
    im.save(master_png, "PNG")
    print(f"Master icon PNG saved to {master_png}")

    # Build ICNS via macOS iconutil
    iconset_dir = "/tmp/CanvasAppIcon.iconset"
    os.makedirs(iconset_dir, exist_ok=True)

    sizes = [
        (16, "icon_16x16.png"),
        (32, "icon_16x16@2x.png"),
        (32, "icon_32x32.png"),
        (64, "icon_32x32@2x.png"),
        (128, "icon_128x128.png"),
        (256, "icon_128x128@2x.png"),
        (256, "icon_256x256.png"),
        (512, "icon_256x256@2x.png"),
        (512, "icon_512x512.png"),
        (1024, "icon_512x512@2x.png"),
    ]

    for s, name in sizes:
        resized = im.resize((s, s), Image.Resampling.LANCZOS)
        resized.save(os.path.join(iconset_dir, name))

    icns_path = os.path.join(out_dir, "AppleCanvasPro.icns")
    subprocess.run(["iconutil", "-c", "icns", iconset_dir, "-o", icns_path], check=True)
    print(f"Master icon ICNS generated at {icns_path}")

if __name__ == "__main__":
    build_apple_canvas_icon()
