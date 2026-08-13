/**
 * Static demo catalogue for the OROS 3D home page.
 * Swap this file for a real API/CMS call later — every component reads from
 * these exports only, nothing is hard-coded inside the UI.
 *
 * Every product carries a `moq` (minimum order quantity). Ready-to-ship prints
 * are `moq: 1`; anything `custom` is made to order and carries a batch minimum.
 */

/**
 * IMAGES — paste your real image src here.
 * Every product, category and partner below has its own `image:` line, so you
 * can replace them one by one. Values can be:
 *   - a file in /public          →  "/products/vase.jpg"
 *   - a remote URL               →  "https://cdn.example.com/vase.jpg"
 *     (remote hosts must be added to `images.remotePatterns` in next.config)
 */

export const categories = [
  {
    name: "Home & Decor",
    slug: "home-decor",
    blurb: "Vases, planters, lamps & wall panels",
    image: "/homeDecor.jpg", // ← category image
    tone: "bg-sky-50",
    accent: "text-sky-700",
    subcategories: [
      {
        name: "Vases & Planters",
        slug: "vases-planters",
        products: [
          { name: "Spiral Twist Vase", price: 1290, moq: 1, image: "/products/vase.svg" },
          { name: "Hex Geometric Planter", price: 890, moq: 1, image: "/products/planter.svg" },
          { name: "Wave Bud Vase — Set of 3", price: 1650, moq: 1, image: "/products/vase.svg" },
          { name: "Self-Watering Herb Pot", price: 1150, moq: 1, image: "/products/planter.svg" },
        ],
      },
      {
        name: "Lamps & Lighting",
        slug: "lamps-lighting",
        products: [
          { name: "Lithophane Moon Lamp", price: 2490, moq: 1, image: "/products/lamp.svg" },
          { name: "Voronoi Table Lamp", price: 2890, moq: 1, image: "/products/lamp.svg" },
          { name: "Photo Lithophane Nightlight", price: 1690, moq: 1, custom: true, image: "/products/lamp.svg" },
          { name: "Honeycomb Pendant Shade", price: 2190, moq: 1, image: "/products/lamp.svg" },
        ],
      },
      {
        name: "Wall Art",
        slug: "wall-art",
        products: [
          { name: "Topographic Map Panel", price: 1990, moq: 1, custom: true, image: "/products/wall-art.svg" },
          { name: "City Skyline Wall Tile", price: 1490, moq: 1, image: "/products/wall-art.svg" },
          { name: "Parametric Wave Panel", price: 2290, moq: 1, image: "/products/wall-art.svg" },
          { name: "Layered Mandala Art", price: 1790, moq: 1, image: "/products/wall-art.svg" },
        ],
      },
      {
        name: "Kitchen & Dining",
        slug: "kitchen-dining",
        products: [
          { name: "Hex Coaster Set of 6", price: 690, moq: 1, image: "/products/wall-art.svg" },
          { name: "Cutlery Caddy", price: 990, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Spice Rack Organiser", price: 1290, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Stackable Herb Pot Trio", price: 1390, moq: 1, image: "/products/planter.svg" },
        ],
      },
    ],
  },
  {
    name: "Desk & Gadgets",
    slug: "desk-gadgets",
    blurb: "Stands, organisers & cable tidies",
    image: "/deskGadget.png", // ← category image
    tone: "bg-emerald-50",
    accent: "text-emerald-700",
    subcategories: [
      {
        name: "Phone & Tablet Stands",
        slug: "phone-tablet-stands",
        products: [
          { name: "Adjustable Phone Dock", price: 749, moq: 1, image: "/products/phone-stand.svg" },
          { name: "Foldable Travel Stand", price: 590, moq: 1, image: "/products/phone-stand.svg" },
          { name: "Tablet Riser Pro", price: 1190, moq: 1, image: "/products/phone-stand.svg" },
          { name: "Bedside Charging Cradle", price: 890, moq: 1, image: "/products/phone-stand.svg" },
        ],
      },
      {
        name: "Desk Organisers",
        slug: "desk-organisers",
        products: [
          { name: "Modular Pen & Tool Caddy", price: 1090, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Stackable Drawer Trays", price: 1290, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Monitor Shelf Riser", price: 1890, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Business Card Holder", price: 449, moq: 1, custom: true, image: "/products/desk-organizer.svg" },
        ],
      },
      {
        name: "Headphone Stands",
        slug: "headphone-stands",
        products: [
          { name: "Arc Headphone Stand", price: 1390, moq: 1, image: "/products/headphone-stand.svg" },
          { name: "Under-Desk Hook Mount", price: 549, moq: 1, image: "/products/headphone-stand.svg" },
          { name: "Weighted Studio Stand", price: 1790, moq: 1, image: "/products/headphone-stand.svg" },
          { name: "Dual Headset Tower", price: 2090, moq: 1, image: "/products/headphone-stand.svg" },
        ],
      },
      {
        name: "Cable & Charging",
        slug: "cable-charging",
        products: [
          { name: "Magnetic Cable Clips — 8 pc", price: 390, moq: 1, image: "/products/enclosure.svg" },
          { name: "Under-Desk Cable Tray", price: 1190, moq: 1, image: "/products/enclosure.svg" },
          { name: "Charging Station Dock", price: 1590, moq: 1, image: "/products/enclosure.svg" },
          { name: "Router & Modem Shelf", price: 1290, moq: 1, image: "/products/enclosure.svg" },
        ],
      },
    ],
  },
  {
    name: "Toys & Figurines",
    slug: "toys-figurines",
    blurb: "Articulated prints, minis & puzzles",
    image: "/ToyFigurines.jpg", // ← category image
    tone: "bg-rose-50",
    accent: "text-rose-600",
    subcategories: [
      {
        name: "Articulated Toys",
        slug: "articulated-toys",
        products: [
          { name: "Articulated Crystal Dragon", price: 1490, moq: 1, image: "/products/dragon.svg" },
          { name: "Flexi Baby Octopus", price: 690, moq: 1, image: "/products/dragon.svg" },
          { name: "Print-in-Place Slug", price: 590, moq: 1, image: "/products/dragon.svg" },
          { name: "Snap-Together Robot", price: 990, moq: 1, image: "/products/figurine.svg" },
        ],
      },
      {
        name: "Tabletop Miniatures",
        slug: "tabletop-miniatures",
        products: [
          { name: "Knight Commander Mini", price: 890, moq: 1, image: "/products/figurine.svg" },
          { name: "Dungeon Terrain Pack", price: 2490, moq: 1, image: "/products/figurine.svg" },
          { name: "Custom Character Mini", price: 1890, moq: 1, custom: true, image: "/products/figurine.svg" },
          { name: "Resin Bust — 75 mm", price: 2290, moq: 1, image: "/products/figurine.svg" },
        ],
      },
      {
        name: "Puzzles & Fidgets",
        slug: "puzzles-fidgets",
        products: [
          { name: "Gear Fidget Spinner", price: 490, moq: 1, image: "/products/gear-part.svg" },
          { name: "Impossible Cube Puzzle", price: 740, moq: 1, image: "/products/chess-set.svg" },
          { name: "Infinity Flip Cube", price: 640, moq: 1, image: "/products/enclosure.svg" },
          { name: "Marble Run Starter Kit", price: 1990, moq: 1, image: "/products/gear-part.svg" },
        ],
      },
      {
        name: "Chess & Board Games",
        slug: "chess-board-games",
        products: [
          { name: "Low-Poly Chess Set", price: 2890, moq: 1, image: "/products/chess-set.svg" },
          { name: "Dice Tower & Tray", price: 1290, moq: 1, image: "/products/chess-set.svg" },
          { name: "Card Deck Holder — 4 pc", price: 890, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Custom Logo Chess Set", price: 4490, moq: 5, custom: true, image: "/products/chess-set.svg" },
        ],
      },
    ],
  },
  {
    name: "Cosplay & Props",
    slug: "cosplay-props",
    blurb: "Helmets, armour & display props",
    image: "/CosplayProps.jpg", // ← category image
    tone: "bg-violet-50",
    accent: "text-violet-700",
    subcategories: [
      {
        name: "Helmets & Masks",
        slug: "helmets-masks",
        products: [
          { name: "Sci-Fi Ranger Helmet", price: 6490, moq: 1, image: "/products/cosplay-helmet.svg" },
          { name: "Samurai Kabuto Mask", price: 5290, moq: 1, image: "/products/cosplay-helmet.svg" },
          { name: "Made-to-Measure Helmet", price: 8990, moq: 1, custom: true, image: "/products/cosplay-helmet.svg" },
          { name: "Half-Face Cyber Mask", price: 2890, moq: 1, image: "/products/cosplay-helmet.svg" },
        ],
      },
      {
        name: "Prop Weapons",
        slug: "prop-weapons",
        products: [
          { name: "Foam-Core Prop Sword", price: 3490, moq: 1, image: "/products/figurine.svg" },
          { name: "Modular Blaster Kit", price: 4290, moq: 1, image: "/products/enclosure.svg" },
          { name: "Glowing Staff Topper", price: 2690, moq: 1, image: "/products/lamp.svg" },
          { name: "Shield Boss & Rim Set", price: 3190, moq: 1, image: "/products/wall-art.svg" },
        ],
      },
      {
        name: "Wearable Armour",
        slug: "wearable-armour",
        products: [
          { name: "Pauldron Pair — Raw", price: 3890, moq: 1, image: "/products/cosplay-helmet.svg" },
          { name: "Flexible TPU Gauntlets", price: 4490, moq: 1, image: "/products/figurine.svg" },
          { name: "Chest Plate — Scan Fit", price: 7990, moq: 1, custom: true, image: "/products/cosplay-helmet.svg" },
          { name: "Greaves & Knee Guards", price: 3590, moq: 1, image: "/products/figurine.svg" },
        ],
      },
      {
        name: "Display Stands",
        slug: "display-stands",
        products: [
          { name: "Helmet Display Plinth", price: 1890, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "Rotating Turntable Base", price: 2290, moq: 1, image: "/products/gear-part.svg" },
          { name: "Engraved Name Plinth", price: 1190, moq: 1, custom: true, image: "/products/keychain.svg" },
          { name: "Acrylic-Look Prop Mount", price: 1590, moq: 1, image: "/products/wall-art.svg" },
        ],
      },
    ],
  },
  {
    name: "Functional Parts",
    slug: "functional-parts",
    blurb: "Brackets, gears, jigs & enclosures",
    image: "/FunctionalParts.jpg", // ← category image
    tone: "bg-amber-50",
    accent: "text-amber-700",
    subcategories: [
      {
        name: "Brackets & Mounts",
        slug: "brackets-mounts",
        products: [
          { name: "Heavy-Duty L Bracket", price: 340, moq: 4, image: "/products/gear-part.svg" },
          { name: "VESA Monitor Adapter", price: 890, moq: 1, image: "/products/enclosure.svg" },
          { name: "Camera Rail Mount", price: 1190, moq: 1, image: "/products/gear-part.svg" },
          { name: "Custom Machine Bracket", price: 1490, moq: 10, custom: true, image: "/products/gear-part.svg" },
        ],
      },
      {
        name: "Gears & Mechanisms",
        slug: "gears-mechanisms",
        products: [
          { name: "Nylon Spur Gear Set", price: 1290, moq: 2, image: "/products/gear-part.svg" },
          { name: "Planetary Gearbox Kit", price: 2790, moq: 1, image: "/products/gear-part.svg" },
          { name: "Replacement Drive Pulley", price: 590, moq: 4, image: "/products/gear-part.svg" },
          { name: "Cam & Follower Assembly", price: 1890, moq: 1, image: "/products/gear-part.svg" },
        ],
      },
      {
        name: "Enclosures & Cases",
        slug: "enclosures-cases",
        products: [
          { name: "Pi 5 Vented Enclosure", price: 990, moq: 1, image: "/products/enclosure.svg" },
          { name: "IP54 Sensor Housing", price: 1690, moq: 5, image: "/products/enclosure.svg" },
          { name: "DIN Rail Terminal Box", price: 1290, moq: 5, image: "/products/enclosure.svg" },
          { name: "Custom PCB Enclosure", price: 2190, moq: 25, custom: true, image: "/products/enclosure.svg" },
        ],
      },
      {
        name: "Jigs & Fixtures",
        slug: "jigs-fixtures",
        products: [
          { name: "Drill Guide Jig", price: 890, moq: 1, image: "/products/gear-part.svg" },
          { name: "Assembly Line Fixture", price: 2490, moq: 10, custom: true, image: "/products/enclosure.svg" },
          { name: "Soldering Board Holder", price: 1190, moq: 1, image: "/products/desk-organizer.svg" },
          { name: "QC Go / No-Go Gauge", price: 1390, moq: 5, custom: true, image: "/products/gear-part.svg" },
        ],
      },
    ],
  },
  {
    name: "Custom & Bulk",
    slug: "custom-bulk",
    blurb: "Personalised prints & batch orders",
    image: "/CustomBulk.jpg", // ← category image
    tone: "bg-lime-50",
    accent: "text-lime-700",
    subcategories: [
      {
        name: "Personalised Gifts",
        slug: "personalised-gifts",
        products: [
          { name: "Name Keychain — Your Text", price: 249, moq: 10, custom: true, image: "/products/keychain.svg" },
          { name: "Photo Lithophane Frame", price: 1290, moq: 1, custom: true, image: "/products/wall-art.svg" },
          { name: "Wedding Favour Charms", price: 179, moq: 50, custom: true, image: "/products/keychain.svg" },
          { name: "Anniversary Sound Wave Art", price: 1590, moq: 1, custom: true, image: "/products/wall-art.svg" },
        ],
      },
      {
        name: "Corporate Gifting",
        slug: "corporate-gifting",
        products: [
          { name: "Logo Desk Trophy", price: 890, moq: 25, custom: true, image: "/products/figurine.svg" },
          { name: "Branded Phone Stand", price: 449, moq: 50, custom: true, image: "/products/phone-stand.svg" },
          { name: "Employee Welcome Kit", price: 1290, moq: 25, custom: true, image: "/products/desk-organizer.svg" },
          { name: "Conference Badge Holders", price: 129, moq: 100, custom: true, image: "/products/keychain.svg" },
        ],
      },
      {
        name: "Name Plates & Signage",
        slug: "name-plates-signage",
        products: [
          { name: "Illuminated Door Sign", price: 1890, moq: 1, custom: true, image: "/products/lamp.svg" },
          { name: "Desk Name Plate", price: 690, moq: 10, custom: true, image: "/products/keychain.svg" },
          { name: "3D Shop Front Letters", price: 390, moq: 10, custom: true, image: "/products/wall-art.svg" },
          { name: "Braille Wayfinding Tiles", price: 540, moq: 25, custom: true, image: "/products/wall-art.svg" },
        ],
      },
      {
        name: "Rapid Prototyping",
        slug: "rapid-prototyping",
        products: [
          { name: "Concept Model — From STL", price: 1990, moq: 1, custom: true, image: "/products/spool.svg" },
          { name: "Functional Test Batch", price: 1490, moq: 10, custom: true, image: "/products/gear-part.svg" },
          { name: "Short-Run Production", price: 890, moq: 50, custom: true, image: "/products/enclosure.svg" },
          { name: "Design + Print Package", price: 4990, moq: 1, custom: true, image: "/products/spool.svg" },
        ],
      },
    ],
  },
];

const badgeFor = (i) => {
  if (i % 7 === 0) return "Bestseller";
  if (i % 5 === 0) return "New";
  if (i % 4 === 0) return "-20%";
  return null;
};

const MATERIAL_ROTATION = ["PLA+", "PETG", "ABS", "Resin", "TPU"];

/** Flat list of every product, deduped by name, with derived display fields. */
export const allProducts = (() => {
  const seen = new Set();
  const list = [];
  categories.forEach((category) => {
    category.subcategories.forEach((sub) => {
      sub.products.forEach((product) => {
        if (seen.has(product.name)) return;
        seen.add(product.name);
        list.push({
          moq: 1,
          custom: false,
          ...product,
          category: category.name,
          categorySlug: category.slug,
          subcategory: sub.name,
          slug: product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        });
      });
    });
  });
  return list.map((product, i) => ({
    ...product,
    rating: (4.3 + ((i * 7) % 7) / 10).toFixed(1),
    reviews: 48 + ((i * 37) % 420),
    mrp: Math.round((product.price * 1.28) / 10) * 10,
    badge: badgeFor(i),
    material: MATERIAL_ROTATION[i % MATERIAL_ROTATION.length],
  }));
})();

/**
 * Pull products out of the catalogue by name.
 * Pass a plain string to reuse the product's own image, or an object with an
 * `image` to override it just for this rail:
 *   { name: "Spiral Twist Vase", image: "/featured/vase.jpg" }
 */
const pick = (entries) =>
  entries
    .map((entry) => {
      const { name, image } = typeof entry === "string" ? { name: entry } : entry;
      const product = allProducts.find((p) => p.name === name);
      if (!product) return null;
      return image ? { ...product, image } : product;
    })
    .filter(Boolean);

/**
 * The 8-card "Shop our favourites" grid (2 rows of 4 on desktop).
 * Paste the featured image src on each `image:` line below.
 */
export const featuredProducts = pick([
  { name: "Spiral Twist Vase", image: "/Spiral Twist Vase.jpg" },
  { name: "Articulated Crystal Dragon", image: "/Articulated Crystal Dragon.jpg" },
  { name: "Arc Headphone Stand", image: "/Arc Headphone Stand.jpg" },
  { name: "Lithophane Moon Lamp", image: "/Lithophane Moon Lamp.jpg" },
  { name: "Adjustable Phone Dock", image: "/Adjustable Phone Dock.jpg" },
  { name: "Low-Poly Chess Set", image: "/Low-Poly Chess Set.jpg" },
  { name: "Name Keychain — Your Text", image: "/Name KeychaiYour Text.jpg" },
  { name: "Sci-Fi Ranger Helmet", image: "/Sci-Fi Ranger Helmet.jpg" },
]);

/** The vibrant best-seller rail. */
export const bestSellers = pick([
  { name: "Hex Geometric Planter", image: "/Hex Geometric Planter.jpg" },
  { name: "Modular Pen & Tool Caddy", image: "/Modular Pen Tool Caddy.jpg" },
  { name: "Knight Commander Mini", image: "/Knight Commander Mini.jpg" },
  { name: "Pi 5 Vented Enclosure", image: "/Pi 5 Vented Enclosure.jpg" },
  { name: "Topographic Map Panel", image: "/Topographic Map Panel.jpg" },
]);

export const benefits = [
  {
    icon: "printer",
    title: "48 Printers, One Roof",
    text: "42 FDM and 6 resin machines running two shifts a day in Mumbai.",
  },
  {
    icon: "layers",
    title: "0.08 mm Layer Precision",
    text: "Fine-detail nozzles and calibrated flow on every single job.",
  },
  {
    icon: "palette",
    title: "40+ Colours & Materials",
    text: "PLA+, PETG, ABS, TPU, carbon-fibre nylon and 8K resin in stock.",
  },
  {
    icon: "ruler",
    title: "Free Design Assistance",
    text: "Send a sketch or an STL — our team fixes the model before printing.",
  },
  {
    icon: "truck",
    title: "Dispatch in 48 Hours",
    text: "In-stock prints ship the next working day to 19,000+ pin codes.",
  },
];

/** Materials rail — used by the custom-order section. */
export const materials = [
  { name: "PLA+", blurb: "Everyday decor & display prints", tone: "bg-sky-50", accent: "text-sky-700" },
  { name: "PETG", blurb: "Tough, food-safe, outdoor-friendly", tone: "bg-emerald-50", accent: "text-emerald-700" },
  { name: "ABS", blurb: "Heat resistant functional parts", tone: "bg-amber-50", accent: "text-amber-700" },
  { name: "TPU", blurb: "Flexible grips, gaskets & wearables", tone: "bg-rose-50", accent: "text-rose-600" },
  { name: "8K Resin", blurb: "Ultra-fine miniatures & jewellery", tone: "bg-violet-50", accent: "text-violet-700" },
];

/**
 * Minimum order quantity ladder for made-to-order work.
 * `min` is inclusive; the last tier has no upper bound.
 */
export const bulkTiers = [
  {
    label: "Sample",
    range: "1 – 9 units",
    min: 1,
    discount: "List price",
    lead: "3 – 5 days",
    note: "Perfect for testing fit and finish before you commit to a batch.",
  },
  {
    label: "Small Batch",
    range: "10 – 49 units",
    min: 10,
    discount: "12% off",
    lead: "5 – 7 days",
    note: "Our most popular tier for gifting, events and market stalls.",
    popular: true,
  },
  {
    label: "Bulk",
    range: "50 – 249 units",
    min: 50,
    discount: "22% off",
    lead: "7 – 12 days",
    note: "Free colour matching and a printed sample before the full run.",
  },
  {
    label: "Production",
    range: "250+ units",
    min: 250,
    discount: "Up to 35% off",
    lead: "2 – 4 weeks",
    note: "Dedicated printer capacity, QC report and staggered delivery.",
  },
];

/** The four-step made-to-order flow shown in the custom section. */
export const customSteps = [
  {
    icon: "upload",
    step: "01",
    title: "Send your idea",
    text: "Upload an STL, STEP or OBJ file — or just a photo, sketch or rough description.",
  },
  {
    icon: "ruler",
    step: "02",
    title: "We model & quote",
    text: "Our designers fix or build the model, then quote by material, size and quantity.",
  },
  {
    icon: "cube",
    step: "03",
    title: "Approve a sample",
    text: "For every batch above 25 units we print one sample first and post you photos.",
  },
  {
    icon: "boxes",
    step: "04",
    title: "Batch print & ship",
    text: "Your run goes on the floor and ships with a QC sheet for every unit.",
  },
];

export const reviews = [
  {
    name: "Ananya Sharma",
    handle: "@ananyamakes",
    city: "Mumbai",
    title: "500 branded keychains in 6 days",
    quote:
      "We needed conference giveaways fast. They hit the MOQ pricing, sent a sample on day two and delivered the full run early.",
    rating: 5,
    product: "Name Keychain — Your Text",
    tone: "from-rose-400 to-orange-300",
    views: "182K",
  },
  {
    name: "Rhea Kapoor",
    handle: "@rheabuilds",
    city: "Bengaluru",
    title: "My whole desk setup, printed",
    quote:
      "Layer lines are almost invisible on the headphone stand. It is heavier and better finished than the ₹3,000 one I returned.",
    rating: 5,
    product: "Arc Headphone Stand",
    tone: "from-primary to-emerald-300",
    views: "246K",
  },
  {
    name: "Meera Iyer",
    handle: "@meeratabletop",
    city: "Chennai",
    title: "Custom minis of our D&D party",
    quote:
      "I sent six character descriptions and they modelled every one. The 8K resin detail on the faces is genuinely absurd.",
    rating: 5,
    product: "Custom Character Mini",
    tone: "from-violet-400 to-primary",
    views: "97K",
  },
  {
    name: "Kabir Menon",
    handle: "@kabirprototypes",
    city: "Pune",
    title: "Short-run enclosures for our sensor",
    quote:
      "Fifty PETG housings, tolerance held to 0.15 mm across the batch. They flagged a wall thickness issue before printing.",
    rating: 4,
    product: "Custom PCB Enclosure",
    tone: "from-amber-400 to-lime-300",
    views: "63K",
  },
  {
    name: "Sara Fernandes",
    handle: "@saracosplays",
    city: "Goa",
    title: "Ranger helmet, straight off the plate",
    quote:
      "Printed in eight pieces with alignment keys, so assembly took an evening. Smoothed and painted it looks screen accurate.",
    rating: 5,
    product: "Sci-Fi Ranger Helmet",
    tone: "from-sky-400 to-primary",
    views: "141K",
  },
];

export const partners = [
  { name: "Filaworks Filament Co.", logo: "/partners/filaworks.svg" },
  { name: "Voxel Labs", logo: "/partners/voxel-labs.svg" },
  { name: "Novajet Resin Systems", logo: "/partners/novajet.svg" },
  { name: "Meshlab CAD Studio", logo: "/partners/meshlab.svg" },
  { name: "Titan Forge Engineering", logo: "/partners/titan-forge.svg" },
];

export const importantLinks = [
  { label: "About Us", href: "#story" },
  { label: "Custom Order & MOQ", href: "#custom" },
  { label: "Materials Guide", href: "#custom" },
  { label: "Shipping Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Return & Refund", href: "#" },
  { label: "Track Your Order", href: "#" },
  { label: "Design Blog", href: "#" },
];

export const contact = {
  phone: "+91 98200 41276",
  phoneHref: "tel:+919820041276",
  email: "print@oros3d.in",
  emailHref: "mailto:print@oros3d.in",
  address: "OROS 3D Studio Pvt. Ltd., Unit 14, MIDC Andheri East, Mumbai 400093",
  hours: "Mon – Sat, 10:00 – 19:00 IST",
};

export const announcements = [
  "Free shipping on every order above ₹999",
  "Bulk orders from just 10 units — up to 35% off",
  "Upload your STL and get a custom quote in 6 working hours",
];

export const formatPrice = (value) => `₹${value.toLocaleString("en-IN")}`;

/** "1 pc" / "25 pcs" — used wherever a minimum order quantity is shown. */
export const formatMoq = (value) => `${value} ${value === 1 ? "pc" : "pcs"}`;
