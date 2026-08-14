# VMS Dhamotharan Thirumana Mandapam — Service Image Generation Prompts

Total: 6 services x 5 images = 30 images
Save as: `assets/images/services/<folder>/<folder>-1.jpg` … `-5.jpg`

---

## MASTER PROMPT (base style — every image-la ithu sethukanum)

> Professional event photography inside a South Indian (Tamil Nadu) wedding hall / thirumana mandapam.
> Large pillared hall with high ceiling, polished granite floor, warm decorative lighting,
> marigold and jasmine flower decorations, traditional kolam near the entrance.
> Shot on a full-frame DSLR, 35mm lens, f/2.8, natural warm golden lighting mixed with
> soft indoor lights, shallow depth of field, candid documentary style.
> Rich warm colour grade — gold, deep red, cream, marigold orange.
> Ultra realistic, sharp focus, high detail, 8k, photorealistic, no text, no watermark, no logo.
> **Aspect ratio 3:2 (landscape, 1920x1280).**

**Negative prompt (ellathukum common):**
> cartoon, 3d render, illustration, anime, distorted faces, extra fingers, deformed hands,
> blurry, low resolution, watermark, text, logo, western church wedding, outdoor beach,
> plastic skin, oversaturated, duplicate people, empty ugly hall

---

## 1. WEDDING → `wedding/`

1. Tamil Hindu bride and groom on a decorated mandapam stage, groom tying the thirumangalyam (thaali), bride in a red-and-gold kanjeevaram silk saree with temple jewellery, groom in white veshti and angavastram, priest and homam fire beside them, family standing around, marigold garlands overhead. *(+ MASTER PROMPT)*
2. Wide interior shot of a fully decorated Tamil wedding hall — rows of guests seated, flower-decorated stage with pillars wrapped in marigold and banana leaves, bright chandeliers, kolam on the floor, celebration in progress. *(+ MASTER PROMPT)*
3. Close-up of the muhurtham moment — hands exchanging garlands (maalai maatral), silk sarees and gold jewellery detail, soft bokeh of the decorated mandapam behind. *(+ MASTER PROMPT)*
4. Traditional nadaswaram and thavil musicians playing at the hall entrance, guests being welcomed with a thaambaalam of flowers and kumkumam, warm morning light through the mandapam doorway. *(+ MASTER PROMPT)*
5. Couple with both families in a joyful group photograph on the mandapam stage, everyone in bright silk traditional attire, flower backdrop, elders blessing the couple. *(+ MASTER PROMPT)*

## 2. RECEPTION → `reception/`

1. Evening reception stage inside the mandapam — couple standing on an elegantly lit flower-and-drape decorated stage, bride in a designer pastel saree/lehenga, groom in a sherwani, warm fairy lights and uplighting, guests below. *(+ MASTER PROMPT, evening mood)*
2. Couple cutting a tiered cake on the reception stage, sparklers glowing, guests clapping, deep evening ambience with golden bokeh lights. *(+ MASTER PROMPT, evening mood)*
3. Wide banquet view — round tables with floral centrepieces, elegant chair covers, guests dining, glowing stage in the background inside the mandapam hall. *(+ MASTER PROMPT, evening mood)*
4. Guests greeting the couple on stage and handing over gifts, candid smiles, professional stage lighting and flower backdrop. *(+ MASTER PROMPT, evening mood)*
5. Detail shot of the reception decoration — floral arch, drapes, LED backdrop with soft warm lights, empty elegant stage ready before guests arrive. *(+ MASTER PROMPT, evening mood)*

## 3. BIRTHDAY CELEBRATIONS → `birthday-celebrations/`

1. Indian family birthday party inside the hall — child in festive clothes cutting a colourful cake on a decorated table, balloon arch in pastel and gold, parents and kids around, joyful expressions. *(+ MASTER PROMPT, brighter and more colourful grade)*
2. Wide view of a birthday-decorated hall — balloon garlands, birthday backdrop, themed table with cake, gift table and party seating for guests. *(+ MASTER PROMPT, brighter)*
3. First-birthday celebration — toddler in traditional silk pattu pavadai on a decorated chair, grandparents feeding the first bite, family clapping. *(+ MASTER PROMPT, brighter)*
4. Kids enjoying at the party — children playing and laughing, balloons, colourful decorations, candid motion, warm indoor light. *(+ MASTER PROMPT, brighter)*
5. Close-up of a beautifully decorated birthday cake with candles glowing on the party table, balloons and lights blurred behind. *(+ MASTER PROMPT, brighter)*

## 4. KAATHUKUTHAL (Ear Piercing Ceremony) → `kaathukuthal/`

1. Traditional Tamil kaathukuthal ceremony inside the mandapam — baby in silk pattu pavadai and gold jewellery held on the maternal uncle's lap, goldsmith performing the ear piercing, family watching, flower decorations and lamp. *(+ MASTER PROMPT)*
2. Decorated ceremony stage with a traditional swing/wooden seat, brass kuthu vilakku lamps lit, banana stems and flowers at the sides, family gathered around the baby. *(+ MASTER PROMPT)*
3. Close-up of the baby's face with tiny gold ear studs after the ceremony, mother comforting the baby, soft warm light, shallow depth of field. *(+ MASTER PROMPT)*
4. Elders blessing the baby with turmeric rice (akshathai), the family seated in traditional silk attire, ceremonial thaambaalam with flowers, fruits and kumkumam in the foreground. *(+ MASTER PROMPT)*
5. Wide hall view of the kaathukuthal function — guests seated, decorated stage, nadaswaram musicians, warm daytime light entering through the mandapam. *(+ MASTER PROMPT)*

## 5. ENGAGEMENT → `engagement/`

1. Tamil engagement (nichayathartham) ceremony — couple seated on a decorated stage exchanging rings, bride in a bright silk saree, groom in silk shirt and veshti, both families beside them, flower decoration behind. *(+ MASTER PROMPT)*
2. Elders reading the lagna patrikai (engagement invitation) on stage, ceremonial plates with fruits, coconut, flowers and betel leaves arranged in front. *(+ MASTER PROMPT)*
3. Close-up of the ring exchange — hands with the engagement ring, silk saree and gold bangles detail, soft bokeh of decorated mandapam. *(+ MASTER PROMPT)*
4. Seer varisai trays — decorated gift trays with sarees, fruits, sweets and flowers arranged elegantly on the engagement stage. *(+ MASTER PROMPT)*
5. Happy group photo of both families with the engaged couple on stage, everyone in colourful traditional attire, floral backdrop. *(+ MASTER PROMPT)*

## 6. FAMILY FUNCTIONS → `family-functions/`

1. Large Tamil joint family gathering inside the mandapam — three generations seated and standing together for a group photograph in traditional attire, warmly lit decorated hall. *(+ MASTER PROMPT)*
2. Traditional feast — guests seated in rows eating a South Indian sadhya on banana leaves, servers moving along the rows, busy joyful hall. *(+ MASTER PROMPT)*
3. Seemantham / valaikaappu function — expectant mother seated on a decorated chair wearing glass bangles, women of the family blessing her, flowers and lamps around. *(+ MASTER PROMPT)*
4. House-warming / pooja style family function inside the hall — homam fire, priest performing rituals, family seated around in traditional attire, brass lamps and flowers. *(+ MASTER PROMPT)*
5. Candid celebration moment — relatives laughing, children running, elders chatting inside the decorated mandapam, natural documentary feel. *(+ MASTER PROMPT)*

---

## Output rules
- **Size:** 1920x1280 (3:2). Web-ku `.webp` or `.jpg` optimize pannunga (200–400 KB).
- **Naming:** `wedding-1.jpg`, `wedding-2.jpg` … `family-functions-5.jpg`
- **Consistency:** ella image-layum same mandapam feel — same pillar style, same warm gold grade. Wedding-la generate panna oru image-a reference-a kudutha (image-to-image / style reference), matha ellame same hall maadhiri varum.
- Face-la AI artifact irundha regenerate pannunga — group shot-la face chinnadha vachikkurathu safe.
