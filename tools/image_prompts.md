# ชุดคำสั่งสร้างภาพวัตถุดิบสำหรับ Gemini

วิธีใช้: คัดลอกคำสั่งของแต่ละแผ่นไปวางใน Gemini ทีละแผ่น แล้วบันทึกภาพเป็นชื่อไฟล์ที่กำหนด (sheet-01.png …) ไว้ในโฟลเดอร์ `thai-nutrition-plate\img-src\`
แต่ละแผ่นเป็นตาราง 4×4 ผมจะตัดภาพทีละช่อง ลบพื้นขาว และย่อขนาดให้เอง

> ถ้า Gemini วางภาพไม่ครบหรือสลับช่อง ให้สั่งสร้างแผ่นนั้นใหม่ หรือบอกผมว่าช่องไหนผิด

## แผ่นที่ 1 → บันทึกเป็น `sheet-01.png`

```
Create one square image: a clean 4 x 4 grid of 16 separate food items, evenly spaced with wide white gaps, one item per cell, in this exact order left-to-right, top-to-bottom: 1) a mound of cooked brown rice; 2) a mound of cooked white jasmine rice; 3) a small heap of dry rolled oats; 4) two slices of whole wheat bread; 5) a peeled hard-boiled egg cut in half; 6) a glass of low-fat milk; 7) a small bowl of plain Greek yogurt; 8) cubes of firm white tofu; 9) a small heap of cooked brown lentils; 10) a small heap of cooked mung beans; 11) a pile of boiled spinach leaves; 12) boiled broccoli florets; 13) boiled carrot slices; 14) a whole green guava with a slice cut; 15) a ripe yellow banana; 16) a whole orange with one segment opened. Style: 3D illustration, soft clay-like render with realistic food colors and textures, 3/4 top-down view (about 35 degrees), soft studio lighting from the top-left, gentle contact shadow under each item, pure white background (#FFFFFF), no plate, no table, no text, no labels, no numbers, no hands. Every item the same visual scale as a single serving.
```

| ช่อง | รายการ |
|---|---|
| 1 | ข้าวกล้องสุก (US169704) |
| 2 | ข้าวขาวสุก ไม่เสริมสารอาหาร (US169757) |
| 3 | ข้าวโอ๊ตแห้ง (US169705) |
| 4 | ขนมปังโฮลวีต (US172688) |
| 5 | ไข่ต้มสุก (US173424) |
| 6 | นมไขมัน 1% เสริม A และ D (US170872) |
| 7 | กรีกโยเกิร์ตรสธรรมชาติ ไร้ไขมัน (US170894) |
| 8 | เต้าหู้แข็ง ใช้แคลเซียมซัลเฟต (US172475) |
| 9 | ถั่วเลนทิลต้ม ไม่ใส่เกลือ (US172421) |
| 10 | ถั่วเขียวต้ม ไม่ใส่เกลือ (US174257) |
| 11 | Spinach ต้ม (ผักโขมฝรั่ง) (US168463) |
| 12 | บรอกโคลีต้ม (US169967) |
| 13 | แครอตต้ม (US170394) |
| 14 | ฝรั่งสด (US173044) |
| 15 | กล้วย (US173944) |
| 16 | ส้ม (US169097) |

## แผ่นที่ 2 → บันทึกเป็น `sheet-02.png`

```
Create one square image: a clean 4 x 4 grid of 16 separate food items, evenly spaced with wide white gaps, one item per cell, in this exact order left-to-right, top-to-bottom: 1) peeled boiled sweet potato chunks; 2) a cooked salmon fillet; 3) a whole grilled mackerel fish; 4) a sliced roasted skinless chicken breast; 5) sliced roasted pork loin; 6) a small glass bottle of soybean oil; 7) a small glass bottle of canola oil; 8) a small heap of toasted sesame seeds; 9) a small heap of roasted peanuts; 10) a bunch of fresh morning glory (water spinach); 11) boiled morning glory (water spinach); 12) a fresh napa cabbage; 13) boiled napa cabbage leaves; 14) boiled bok choy; 15) two fresh whole carrots; 16) a fresh raw broccoli head. Style: 3D illustration, soft clay-like render with realistic food colors and textures, 3/4 top-down view (about 35 degrees), soft studio lighting from the top-left, gentle contact shadow under each item, pure white background (#FFFFFF), no plate, no table, no text, no labels, no numbers, no hands. Every item the same visual scale as a single serving.
```

| ช่อง | รายการ |
|---|---|
| 1 | มันเทศต้ม ปอกเปลือก (US168484) |
| 2 | แซลมอนแอตแลนติกสุก (US175168) |
| 3 | Atlantic mackerel สุก (US175120) |
| 4 | อกไก่อบ ไม่ติดหนัง (US171477) |
| 5 | หมูสันนอกอบ เฉพาะเนื้อ (US168233) |
| 6 | น้ำมันถั่วเหลือง (US171411) |
| 7 | น้ำมันคาโนลา (US172336) |
| 8 | งาเต็มเมล็ดคั่ว (US170151) |
| 9 | ถั่วลิสงคั่ว ไม่ใส่เกลือ (US173806) |
| 10 | ผักบุ้ง ดิบ (Water convolvulus) (US169301) |
| 11 | ผักบุ้ง ต้ม ไม่ใส่เกลือ (US169302) |
| 12 | ผักกาดขาว ดิบ (pe-tsai) (US169979) |
| 13 | ผักกาดขาว ต้ม ไม่ใส่เกลือ (US169980) |
| 14 | ผักกวางตุ้งฮ่องเต้ ต้ม ไม่ใส่เกลือ (US170391) |
| 15 | แครอต ดิบ (US170393) |
| 16 | บรอกโคลี ดิบ (US170379) |

## แผ่นที่ 3 → บันทึกเป็น `sheet-03.png`

```
Create one square image: a clean 4 x 4 grid of 16 separate food items, evenly spaced with wide white gaps, one item per cell, in this exact order left-to-right, top-to-bottom: 1) a fresh red tomato with one slice; 2) a fresh cucumber with slices; 3) boiled sweet yellow corn kernels on the cob; 4) a ripe papaya cut in half; 5) fresh pineapple chunks; 6) a wedge of red watermelon; 7) a ripe yellow mango cut in cheeks; 8) fresh jackfruit pods; 9) durian flesh pods; 10) a bunch of fresh longan; 11) fresh lychees, one peeled; 12) a mandarin orange, partly peeled; 13) a red apple; 14) a bunch of green and red grapes; 15) pomelo segments; 16) cooked red kidney beans. Style: 3D illustration, soft clay-like render with realistic food colors and textures, 3/4 top-down view (about 35 degrees), soft studio lighting from the top-left, gentle contact shadow under each item, pure white background (#FFFFFF), no plate, no table, no text, no labels, no numbers, no hands. Every item the same visual scale as a single serving.
```

| ช่อง | รายการ |
|---|---|
| 1 | มะเขือเทศ สด (US170457) |
| 2 | แตงกวา พร้อมเปลือก สด (US168409) |
| 3 | ข้าวโพดหวานเหลือง ต้ม ไม่ใส่เกลือ (US169999) |
| 4 | มะละกอ สด (US169926) |
| 5 | สับปะรด สด (US169124) |
| 6 | แตงโม สด (US167765) |
| 7 | มะม่วง สด USDA (US169910) |
| 8 | ขนุน สด USDA (US174687) |
| 9 | ทุเรียน สดหรือแช่แข็ง USDA (US168192) |
| 10 | ลำไย สด USDA (US169089) |
| 11 | ลิ้นจี่ สด USDA (US169086) |
| 12 | ส้มแมนดาริน สด (US169105) |
| 13 | แอปเปิ้ล พร้อมเปลือก สด (US171688) |
| 14 | องุ่นแดงหรือเขียว สด (US174683) |
| 15 | ส้มโอ สด USDA (US167754) |
| 16 | ถั่วแดงหลวง ต้ม ไม่ใส่เกลือ (US175194) |

## แผ่นที่ 4 → บันทึกเป็น `sheet-04.png`

```
Create one square image: a clean 4 x 4 grid of 16 separate food items, evenly spaced with wide white gaps, one item per cell, in this exact order left-to-right, top-to-bottom: 1) cooked soybeans; 2) raw peanuts in a small heap; 3) a raw whole chicken egg; 4) a glass of whole milk; 5) a glass of plain soy milk; 6) a glass of calcium-fortified soy milk; 7) cooked clams; 8) cooked blue mussels; 9) cooked peeled shrimp; 10) boiled green cabbage leaves; 11) boiled cauliflower florets; 12) boiled peeled potato chunks; 13) a raw sweet potato; 14) a cooked milkfish fillet; 15) a cooked tilapia fish; 16) canned sardines in oil. Style: 3D illustration, soft clay-like render with realistic food colors and textures, 3/4 top-down view (about 35 degrees), soft studio lighting from the top-left, gentle contact shadow under each item, pure white background (#FFFFFF), no plate, no table, no text, no labels, no numbers, no hands. Every item the same visual scale as a single serving.
```

| ช่อง | รายการ |
|---|---|
| 1 | ถั่วเหลือง ต้ม ไม่ใส่เกลือ (US174271) |
| 2 | ถั่วลิสง ดิบ (US172430) |
| 3 | ไข่ไก่ ทั้งฟอง ดิบ (US171287) |
| 4 | นมวัวเต็มมันเนย ไม่เสริม A/D (US172217) |
| 5 | นมถั่วเหลืองรสดั้งเดิมหรือวานิลลา ไม่เสริมสารอาหาร USDA (US172446) |
| 6 | นมถั่วเหลืองรสดั้งเดิมหรือวานิลลา เสริม Ca/A/D USDA (US172456) |
| 7 | หอยกาบหลายชนิด สุก USDA (US171975) |
| 8 | หอยแมลงภู่ blue mussel สุก USDA (US174217) |
| 9 | กุ้งหลายชนิด สุก USDA อาจมีสารรักษาความชื้น (US171971) |
| 10 | กะหล่ำปลี ต้ม ไม่ใส่เกลือ (US169976) |
| 11 | กะหล่ำดอก ต้ม ไม่ใส่เกลือ (US170397) |
| 12 | มันฝรั่ง ต้ม เนื้อ ไม่ใส่เกลือ (US170438) |
| 13 | มันเทศ ดิบ (US168482) |
| 14 | ปลานวลจันทร์ทะเล สุก USDA (US171995) |
| 15 | ปลานิล สุก USDA (US175177) |
| 16 | ซาร์ดีนแอตแลนติก กระป๋องน้ำมัน เนื้อและกระดูกสะเด็ดน้ำ (US175139) |

## แผ่นที่ 5 → บันทึกเป็น `sheet-05.png`

```
Create one square image: a clean 4 x 4 grid of 13 separate food items, evenly spaced with wide white gaps, one item per cell, in this exact order left-to-right, top-to-bottom: 1) canned sardines in tomato sauce; 2) boiled chayote slices; 3) a small bottle of rice bran oil; 4) a small bottle of sesame oil; 5) a small bottle of palm oil; 6) a small jar of coconut oil; 7) a small bottle of Thai fish sauce; 8) a small dish of soy sauce; 9) a small heap of white sugar; 10) boiled chicken liver pieces; 11) boiled edamame pods; 12) raw pumpkin wedge; 13) boiled pumpkin chunks; leave the remaining 3 cells empty. Style: 3D illustration, soft clay-like render with realistic food colors and textures, 3/4 top-down view (about 35 degrees), soft studio lighting from the top-left, gentle contact shadow under each item, pure white background (#FFFFFF), no plate, no table, no text, no labels, no numbers, no hands. Every item the same visual scale as a single serving.
```

| ช่อง | รายการ |
|---|---|
| 1 | ซาร์ดีนแปซิฟิก กระป๋องซอสมะเขือเทศ เนื้อและกระดูกสะเด็ดน้ำ (US175140) |
| 2 | ฟักแม้ว ต้ม ไม่ใส่เกลือ (US170403) |
| 3 | น้ำมันรำข้าว USDA (US171013) |
| 4 | น้ำมันงา USDA (US171016) |
| 5 | น้ำมันปาล์ม USDA (US171015) |
| 6 | น้ำมันมะพร้าว USDA (US171412) |
| 7 | น้ำปลา USDA (US174531) |
| 8 | ซีอิ๊ว shoyu USDA (US174277) |
| 9 | น้ำตาลทราย (US169655) |
| 10 | ตับไก่ ต้ม USDA (US171061) |
| 11 | ถั่วแระญี่ปุ่น ต้ม ไม่ใส่เกลือ (US169283) |
| 12 | ฟักทอง เนื้อ ดิบ (USDA) (US168448) |
| 13 | ฟักทอง เนื้อ ต้ม สะเด็ดน้ำ ไม่ใส่เกลือ (USDA) (US168449) |
