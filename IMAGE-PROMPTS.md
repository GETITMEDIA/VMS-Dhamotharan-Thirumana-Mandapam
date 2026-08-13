# Image prompts — Kaathukuthal & Family Functions (matched to your accepted set)

Your four accepted AI images (`wedding-1.png`, `reception-1.png`, `birthday-2.png`,
`engagement-1.png`) all share one specific look. The two you rejected
(`kaathukuthal-1.png`, `family-1.png`) missed it in two different ways:

| | Accepted set | `kaathukuthal-1.png` | `family-1.png` |
|---|---|---|---|
| Light | Bright, soft window daylight | Dim, warm tungsten, grainy | Flat fluorescent overhead |
| Colour | Punchy, saturated silks | Muted, desaturated | Muted, dull |
| Background | Creamy soft blur, one clear focal point | Busy, crowded, cluttered | Wrong setting — reads as a home living room, not a hall |
| Framing | Subject seated on floor, brass plate/pooja items in the near foreground, blurred | Standing group, no foreground prop | Standing group in a doorway, no foreground prop |

The two prompts below are built to match the accepted look exactly — same light,
same colour, same seated-with-foreground-prop framing — instead of the
documentary/candid tone that made the first two feel out of place.

**Target size:** 1024 × 1024 px (square) — same as your four accepted images, so
it drops in without any layout change.

---

## Shared style block — paste into both prompts

```
Bright soft natural window daylight from one side, slightly overexposed
highlights, warm golden colour grade, punchy saturated silk fabrics with visible
zari gold thread detail, subject in sharp focus with a smooth creamy soft-blur
background, shallow depth of field, professional DSLR portrait quality, 85mm
lens look, subjects seated on the floor or on a low stage, a brass plate with
pooja items (betel leaves, banana, flowers, coconut) softly blurred in the near
foreground, marigold and jasmine garland decoration behind, one or two seated
elders visible but out of focus in the background, natural skin texture with
visible pores, candid unposed moment, no one looking directly at the camera
```

## Shared negative prompt

```
AI generated, CGI, 3D render, plastic skin, airbrushed, waxy skin, symmetrical
face, perfect teeth, extra fingers, malformed hands, fused fingers, everyone
looking at the camera, studio softbox lighting, flat fluorescent lighting, dim
tungsten lighting, grainy, desaturated, muted colours, cluttered background,
home interior, living room, wooden furniture, sofa, television, watermark,
text, logo, distorted jewellery
```

---

## Kaathukuthal (ear-piercing ceremony)

```
[STYLE BLOCK]

A toddler girl of about two, in a small red and gold silk pavadai with a gold
waist chain and bangles, sits on her father's lap on the floor. The goldsmith's
hands, entering from the right edge of frame, hold a fine gold wire at her ear;
the father in a cream silk shirt steadies her with both hands, looking down at
her gently. The child's face is in three-quarter profile, mouth slightly open.
Sunlight falls warmly across them from a doorway just out of frame. A brass
plate of turmeric, rice and betel leaves sits softly blurred in the near
foreground. Traditional South Indian home or mandapam setting, marigold garland
strand visible at the edge of frame, other relatives seated cross-legged and
softly blurred behind. Tamil Nadu, India.
```

**Two alternative framings**, same style block:
- `a grandmother's weathered hands, gold bangles catching the light, placing a pinch of rice on the child's head in blessing — hands sharp in the foreground, her face and the child soft behind`
- `the child immediately after, being comforted against her mother's shoulder, cheek resting there, eyes closed, mother's green silk saree and gold jewellery sharp, background of seated relatives softly blurred`

---

## Family Functions

```
[STYLE BLOCK]

An elderly couple sit together on a low wooden bench, both in traditional
silk — the husband in a cream veshti and shawl, the wife in a warm brown silk
saree with a gold border. Their adult daughter, in a maroon silk saree with
jasmine in her hair, leans in from one side draping a fresh silk shawl over her
father's shoulders; her mother's hand rests warmly on his arm, everyone's
expression soft and unposed. A brass plate of fruit, flowers and a lit brass
lamp sits blurred in the near foreground. Marigold and mango-leaf garlands hang
softly out of focus behind them, a hint of a decorated pillar visible in the
background blur. Two or three relatives seated nearby, out of focus. Warm golden
window light from one side. Tamil Nadu, India.
```

**Two alternative framings**, same style block:
- `a grandmother holding a toddler granddaughter on her lap, both looking down at a small brass lamp between them, the child's gold jewellery and pavadai sharp, relatives blurred in a loose circle behind`
- `three generations seated together on a decorated stage step — grandfather, father and young grandson in matching cream veshti, seated close, looking at each other rather than the camera, garlands and a brass lamp softly blurred in the foreground`

---

## After generating

1. Save the chosen image as `kaathukuthal-2.png` and `family-2.png` in
   `assets/images/` (1024×1024, matching the other four).
2. Tell me to swap them in — I'll point `index.html` and `services.html` at the
   new files and fix the width/height attributes to match, the same way I did
   for the other four.
3. If a result still looks a little too "AI," the single most common fix is to
   ask specifically for **fewer people in frame** (3–4, not a crowd) — AI holds
   up much better with a small group than a packed one.
