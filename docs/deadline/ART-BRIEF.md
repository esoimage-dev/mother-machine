# DEADLINE · Art direction brief

One line: **a rainy city at night, drawn by an engineer who loves it.** Blade Runner gives us the weather, and Mother Machine gives us the rules. The city is a precise squared machine. The light is warm cream. The only things that burn tomato are the player and whatever answers back.

## 0 · What we take from the references (and what we leave)
- **The Last Night (Odd Tales):** flat 2D sprites made deep by *light, not detail*: many parallax planes, fog between them, dynamic light and post-processing on top. We take the split: crisp low-res sprites plus a separate soft light layer (our 480x270 canvas plus the full-res FX canvas). We leave behind the 3D engine and the dozens of layers. We use 3 layers and 2 fog bands.
- **Katana ZERO:** sprite shading shifts with the ambient light of each room, and the palette stays small (dark purples up to hot oranges). We take that rule: every sprite gets tinted by the day, and the art itself never changes.
- **Blade Runner 1982 / Syd Mead:** a desaturated charcoal-blue base, saturated neon only as accents, and smoke that *carries* the colour of the light. Light shafts through rain. Almost no fill light.
- **Hyper Light Drifter / Sayonara Wild Hearts:** one strong colour family per scene, a simple silhouette and a lot of empty space.
- **Cave / Ikaruga:** colour carries meaning (in Ikaruga the colour *is* the mechanic). The player hitbox is tiny and visible, and enemy bullets are the highest-contrast thing on screen. One player bullet stream that is thick and readable, and the player never looks at their own ship.
- **Rain in pixel art:** 1px streaks at a fixed slant, recycled with a random x. Splash crowns of 2-3 frames on rooftops.
- **Leave behind:** purple/pink synthwave gradients, the outrun sun, a katana, Japanese signs as wallpaper, chrome logos, and "everything glows".

## 1 · Fixed colours (never tinted)
| Role | Hex | Rule |
|---|---|---|
| Night | `#0F0F0E` | outline of every sprite, empty sky on NIGHT |
| Ink | `#121211` | text on light (SUN), enemy object outlines |
| Cream (light) | `#F4F2EC` | the colour of light: window light, bullet cores, HUD, the logo. **Never pure white.** |
| White hot | `#FBFAF7` | 1px cores only (shot head, neon core at peak) |
| Machine grey | `#BEC2BF` > `#7E8580` > `#4A4E4C` > `#2A2D2C` | ship hull, firewalls, rack metal |
| Skin pink | `#F2CDBE` | the Booking shield tint, Sunday warmth |
| **Tomato** | `#7A2416` > `#C23E26` > **`#FF5B3A`** > `#FF9A7A` > `#FFE3D6` | **player energy only**: shots, engines, player sparks, the clock fill, the selected UI item |
| Gold (bonus) | `#6E4A16` > `#B8862E` > `#E8B64A` > `#FFE08A` | golden enemy, capsules, the coin. Never used in the scenery |

**The tomato rule, applied:** no scenery pixel is ever more saturated than tomato within ±30° of its hue. So the SAT sunset is amber and dusty, FRI is a cool pink and MON is a deep crimson. Tomato must always be the hottest thing on screen.

## 2 · The days (one family)
Every day is the same 8-slot ramp: `sky top / sky mid / horizon / far / mid / near / fog / accent`. They all share the same values, so the city reads identically and only the hue and the weather change. The accent is used only for neon, enemy-bullet rings and billboards.

| Day | sky top | sky mid | horizon | far | mid | near | fog | accent | weather |
|---|---|---|---|---|---|---|---|---|---|
| TUE | `#0A0F1C` | `#121A2E` | `#22314D` | `#1A2440` | `#10172A` | `#090C15` | `#3A5078` | `#5FD3FF` | rain |
| WED | `#110D1C` | `#1D152E` | `#3A2852` | `#2C2142` | `#1A1428` | `#0D0A14` | `#6E5A94` | `#B99CFF` | violet fog |
| THU | `#0D110B` | `#171E15` | `#2F3A1F` | `#252E1C` | `#151B12` | `#0A0D08` | `#6F7F33` | `#C6EE48` | acid smog, flicker |
| FRI | `#140C16` | `#271329` | `#4E2147` | `#391A37` | `#210F21` | `#110910` | `#9A4D78` | `#FF86CF` | party lights, confetti |
| SAT | `#170E12` | `#3A1C22` | `#B5713E` | `#57302C` | `#2D1A1B` | `#140C0D` | `#C79465` | `#FFC56A` | sunset dust, spam swarms |
| SUN | `#93A8B8` | `#C9CDC6` | `#F4F2EC` | `#B3B8B2` | `#7C837E` | `#2A2D2C` | `#F4F2EC` | `#F2CDBE` | clear dawn, near silence |
| MON | `#110506` | `#280A0E` | `#561219` | `#3A0E13` | `#200A0C` | `#100506` | `#7A1C25` | `#E0263F` + glitch `#3CE6EE` | alarm, glitch |
| NIGHT | `#060B1E` | `#0C1838` | `#16295E` | `#132350` | `#0C1736` | `#060A18` | `#2F4C9A` | `#8FB4FF` | Night shift power and the CITY screen |

- SUN is the one value flip (a light sky with a dark near city). On SUN, enemy bullets swap to an ink core with a pink ring (see section 5).
- Lit windows are always the same on every day: `#F4F2EC` (70%), `#EAD9B8` (20%) and `#F2CDBE` (10%). Unlit windows use the near colour plus 1 step. The city is the client's business, so its light never changes colour. Only the sky changes.
- Day transition: crossfade the 8 slots over 1.2s, behind the "CLOCKED OUT 17:00" card.

## 3 · The city (three layers, tuned by value)
| Layer | Parallax | Value contrast to sky | Saturation | Content |
|---|---|---|---|---|
| Far skyline | 0.05 | 10-15% | lowest | silhouettes only, 1 in 40 roof lights blinking slowly (accent) |
| Mid towers | 0.2 | 30% | medium | billboards (the only large saturated rectangles: winners' signs, one-colour neon), sparse windows, antenna blinkers |
| Near city | 0.5 (moves only when the ship moves) | 60%+ | highest | the six building types, the life windows, wet roof edges with a 1px cream rim, rain splashes |

- **Fog bands:** pre-bake one 480x40 offscreen image per day: a vertical gradient from fog colour to transparent, ordered-dithered with a 4x4 Bayer matrix (crisp pixels, no smears). Put it between far and mid at 0.35 alpha and between mid and near at 0.15. Scroll each band sideways with `sin(t)` ±6px. That gives cheap atmospheric perspective.
- **Smog (THU):** the same band, but baked with value noise and taller, and it drifts upward. Neon in the mid layer is drawn *under* it so the smog carries the colour.
- **Light shafts:** 2-3 trapezoids per day coming from billboards or searchlights, drawn on the FX canvas with a linear gradient, `globalCompositeOperation = 'lighter'` and alpha 0.06-0.1, swaying slowly. Rain inside a shaft's x-range is drawn one step brighter. This is the most Blade Runner move we have, and it costs almost nothing.

## 4 · Weather and effects (cheap canvas ops)
- **Rain:** a pool of about 180 drops, two depth classes. Far drops: 1x3px, fog colour plus 2 steps, alpha 0.4, slow. Near drops: 1x5px, cream at 0.5, fast, at a slant of 1 across for 4 down. They wrap to the top at a new random x. For the splash, a 3px crown on the near rooftops: frame 1 `.` and frame 2 `' '`. On the FX canvas there is no rain, except a faint streak inside the light shafts.
- **Wet street reflection:** a 12px street strip under the near city. Keep an *emissive-only* layer (windows, neon, billboards) and draw it flipped, at 0.5 vertical scale and 0.3 alpha, one row at a time (12 `drawImage` calls), with each row offset `round(sin(row*0.9 + t*3))` px. Under each neon sign, add one vertical 1px streak that fades from 0.5 to 0. Nothing dark is reflected, only light.
- **Window light:** 1x2px or 2x2px on the grid of each building type. Near-layer lit windows get a pre-baked 8px glow stamp on FX at 0.12. **A window going out** (an enemy landed): 3 flicker frames, then the near colour, plus a 1px cream ember that falls 4px and dies.
- **Confetti (FRI):** 2x1 rectangles in cream, the FRI accent, gold and grey (never tomato). Flip between 2x1 and 1x1 every 6 frames to fake rotation. Torn calendar pages are the same idea at 3x2.
- **Sparks:** enemy hit = 6-10 pixels in the enemy's own colours that fall with gravity and turn to cream before they die (as in the spec). Player shot impact = 3 tomato pixels plus 1 white-hot pixel for 1 frame.
- **Glitch (MON, logo, damage):** 1-3 horizontal slices of the low-res canvas (2-6 rows) redrawn shifted 2-8px for 60-90ms. The chromatic split is done on the FX canvas only: redraw the composite twice with `'lighter'`, red-tinted and cyan-tinted, at ±1 device px, 0.25 alpha. It is used only on a hit, on MONDAY and on the logo. With `prefers-reduced-motion`, there is no glitch, no flash and no shake, and the hit becomes a 1-frame cream outline.
- **Screen:** integer scale (x2, x3 or x4, letterboxed in night) with `imageSmoothingEnabled = false`. On FX, scanlines every 3 device px at 0.06, a soft vignette, and a slight barrel curve only inside the LG cabinet. Bloom is never a live blur: pre-bake radial glow stamps (4 sizes per accent plus tomato and cream) and stamp them with `'lighter'`. Flicker is just the stamp's alpha.

## 5 · Neon signs
1. **Tube (low-res):** a 1px path with corners cut at 45° (machine). The tube colour is the accent mixed 50% with cream, so it reads as a hot tube.
2. **Halo pixels:** 1px of the pure accent at 0.6 alpha, outside the tube on the horizontal runs only (vertical tubes stay clean).
3. **Bloom (FX):** the sign mask is blurred **once** at load into an offscreen canvas (`ctx.filter = 'blur(10px)'`) and stamped with `'lighter'` at 0.5-0.8.
4. **Off state:** the tube stays visible in `#3A3A38` (as in the LG room neon). A dead neon is grey glass, not nothing.
5. **Flicker:** each sign has its own deterministic string (`'1111101101111110'`) stepped at 12 fps. THU doubles the zeros.
6. **Winners' signs:** the logo is turned into one-colour neon (the sign engine in the spec). It is always drawn in the day's accent on the billboards, and in cream on the CITY screen, so every business looks good.

## 6 · Sprites
**Shared rules:** a maximum of 6 colours per sprite plus the outline. The outline is `#0F0F0E`, selective: dropped on the lit underside. **Lighting comes from the city below.** The undersides of everything get a 1px cream rim, and the tops pick up 1px of the day's accent from the sky. That one rule makes every sprite feel *in* the city. Shapes are squared with 45° cuts only. No curves except where noted.

- **The ship (about 19x15):** a pointed nose with swept wings and a machine-grey hull ramp. The cockpit is 1px white-hot, and **it is the hitbox** (Cave style, always visible). The tiny m mark (3x2, cream) is on the left wing. **Three tomato engines** form a row of three small arcs behind (the legs of the m). Their flames live on FX: 3 tapered glow stamps whose length depends on speed and doubles with AUTOMATION. To bank, swap the wing highlight 1px left or right. Never rotate the sprite.
- **Player shot:** a 1x4 dash, white-hot head and tomato body, with a 6px tomato trail on FX. It is the *only* vertical dash on screen.
- **Enemy projectiles:** diamonds (3x3 or 5x5) and arc rings, with a cream core and a 1px accent ring. On SUN the core is ink and the ring pink. They are always outlined in night, so they read on any sky, with a small glow on FX. Enemy bullets never use tomato, and the player shot never uses the accent.
- **Enemies are office objects:** flat paper and plastic in a paper ramp `#F4F2EC > #D9D4C7 > #9C978B > #55524B` with an ink outline and **one** accent detail each:
  - *Missed call (14x14):* an old handset. It shakes 1px left and right, and throws arc "rings" (1px arcs that open across 3 frames).
  - *Paper invoice (12x16):* a sheet with a folded corner, 3 grey text lines and an accent stamp "DUE". On a hit it tears into two 6x12 receipts with a zig-zag bottom edge.
  - *No-show (12x18):* **no fill**, a 1px dashed outline of a person (2 on, 2 off, with the dashes marching), carrying a tag "T4". Absence drawn as a line, as in the LG room.
  - *Spam (7x5):* an envelope with `!!!`. They come in swarms with a 2-frame wing-flap of the flap.
  - *Golden special:* any enemy recoloured in the gold ramp, with a 1px shine line sweeping across it every second.
  - *Double booking:* two calendar cards linked by a 1px accent line that pulses.
  - *URGENT (64x40, FRI 16:59):* a big envelope in the MON crimson (a preview of Monday) with a wax seal that beats.
  - *MONDAY (about 160x110):* a desk calendar with squared binder rings. The face is made from the grid: two cells for eyes and a row of cells for the mouth. When hurt, it tears pages that fly off as 3-frame rotating paper. Each phase turns one more cell red.
- **Death frame:** for 2 frames before the sparks, the enemy becomes a **cream 1px line drawing** of itself with no fill (the LG room language).
- **Firewalls:** machine-grey bricks 2x1 with a 1px cream lit top. Each one is its own small canvas eroded with `clearRect` one pixel at a time.
- **Booking shield:** see signature move 3.

## 7 · Logo, HUD, framing
- **DEADLINE:** squared pixel caps 9px tall with a 2px stroke and 45° chamfered corners, on a 1px grid. Cream tube with a cream-to-accent bloom. The **second D flickers** (its own flicker string). Under the word, a 1px tomato rule fills left to right like a clock and hits the right edge with a glitch. On the cabinet, it alternates with the scrolling leaderboard. The boot screen has "MOTHER MACHINE PRESENTS" in a 5x7 font with the pixel m drawn stroke by stroke.
- **Typography:** one custom 5x7 pixel font (caps, 1px tracking) for labels and one 4x6 mono digit set (slashed zero, a nod to DM Mono). No other fonts on the canvas.
- **HUD:** a 9px top band. Left: `TUE 09:00` with a thin progress line toward 17:00 (tomato fill). Centre: `HOURS SAVED 0412`. Its digits **roll like the elevator display** on the Studio page. Right: three 7x7 coffee cups with 2px of steam. When one is lost, the cup tips over and spills 3px. Bottom band: the active power with a draining bar, left, and the NIGHT SHIFT slot, right. The frame is 1px cream lines at 0.35 with 3px corner brackets, technical drawing style.
- **Day cards:** the day name appears like an elevator floor display (`TUE` rolls to `WED`, with a ding). "CLOCKED OUT 17:00" is set in the 5x7 font, plus the summary.

## 8 · Signature moves (what makes it ours)
1. **Tomato is the player's energy, and nothing else.** On a frozen frame you find the ship instantly.
2. **Cream is the light.** Windows, cores, rims and HUD. No pure white, no cold LED glow on our side.
3. **The Booking shield is the only round, soft thing in the game:** real glass. Every 4 frames grab a 32x32 copy of the scene behind the ship, blur it once, clip it to a circle, tint it 10% pink, add a 1px cream highlight arc at the top-left and a refraction offset of 1px. The site's glass technique, applied in-game (a frozen blurred copy, never a live backdrop filter).
4. **The m engines:** three tomato arcs. Whoever knows the logo sees it.
5. **The city lights you from below.** Every sprite's underside catches cream from the windows. The city is the client's business, and it is the thing you protect.
6. **Absence and death are drawn as lines.** The No-show and the death frames use the LG room's 1px cream line drawing.
7. **The building is the menu.** Days roll like elevator floors, and HOURS SAVED rolls like the Studio display.
8. **Paper weather.** Torn calendar pages, receipts and confetti instead of debris and explosions. Office life is the only humour, and it is never a joke in text.

## 9 · Avoid
- Muddy palettes: never mix two days' accents on one screen, and never grey down tomato.
- More than one accent per day, purple-pink synthwave gradients, the outrun sun, chrome, lens flares, kanji wallpaper.
- Bullets that match the background or the player shot. Soft or blurred enemy bullets. Enemy bullets without a night outline.
- Live blur or live backdrop filter, full-screen bloom, CRT curvature during play outside the cabinet.
- Mixed pixel sizes: everything sits on the 480x270 grid, nothing is scaled by non-integer values, and the 1px rim is never doubled.
- Rotating sprites in-engine (it breaks the pixel grid). Use frame swaps.
- Rain that is too dense to read through: max 180 drops, never over the HUD.
- Glow on everything: only neon, windows, tomato, gold and the shield emit light.
- The Vitalia's truck, client logos as enemies, and real brands on billboards (except approved winners).
