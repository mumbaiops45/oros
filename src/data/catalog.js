/**
 * Static demo catalogue for the OROS home page.
 * Swap this file for a real API/CMS call later — every component reads from
 * these exports only, nothing is hard-coded inside the UI.
 */

const IMG = {
  serum: "/products/serum-dropper.svg",
  pump: "/products/pump-bottle.svg",
  jar: "/products/cream-jar.svg",
  tube: "/products/tube.svg",
  oil: "/products/oil-bottle.svg",
  soap: "/products/soap-bar.svg",
  tin: "/products/tin.svg",
  pouch: "/products/pouch.svg",
};

export const categories = [
  {
    name: "Skin Care",
    slug: "skin-care",
    blurb: "Cold-pressed serums, cleansers & masks",
    image: IMG.serum,
    tone: "bg-rose-50",
    accent: "text-rose-600",
    subcategories: [
      {
        name: "Face Serums",
        slug: "face-serums",
        products: [
          { name: "Vitamin C Glow Serum", price: 1290, image: IMG.serum },
          { name: "Bakuchiol Night Serum", price: 1450, image: IMG.oil },
          { name: "Hyaluronic Dew Drops", price: 1190, image: IMG.serum },
          { name: "Rosehip Repair Elixir", price: 1560, image: IMG.oil },
        ],
      },
      {
        name: "Cleansers",
        slug: "cleansers",
        products: [
          { name: "Neem & Tulsi Face Wash", price: 540, image: IMG.tube },
          { name: "Oat Milk Cream Cleanser", price: 690, image: IMG.pump },
          { name: "Charcoal Detox Gel", price: 620, image: IMG.tube },
          { name: "Rice Water Foam", price: 580, image: IMG.pump },
        ],
      },
      {
        name: "Moisturisers",
        slug: "moisturisers",
        products: [
          { name: "Shea Day Cream SPF 30", price: 980, image: IMG.jar },
          { name: "Aloe Water Gel", price: 720, image: IMG.jar },
          { name: "Ceramide Night Balm", price: 1150, image: IMG.tin },
          { name: "Squalane Light Lotion", price: 860, image: IMG.pump },
        ],
      },
      {
        name: "Face Masks",
        slug: "face-masks",
        products: [
          { name: "Multani Clay Mask", price: 640, image: IMG.jar },
          { name: "Turmeric Bright Mask", price: 690, image: IMG.pouch },
          { name: "Overnight Honey Mask", price: 820, image: IMG.tin },
          { name: "Sea Kelp Sheet Mask", price: 240, image: IMG.pouch },
        ],
      },
    ],
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    blurb: "Sulphate-free wash, oils & scalp care",
    image: IMG.pump,
    tone: "bg-amber-50",
    accent: "text-amber-700",
    subcategories: [
      {
        name: "Shampoo",
        slug: "shampoo",
        products: [
          { name: "Amla Root Shampoo", price: 740, image: IMG.pump },
          { name: "Rosemary Volume Wash", price: 780, image: IMG.pump },
          { name: "Anti-Dandruff Neem Wash", price: 690, image: IMG.pump },
          { name: "Baby-Soft Rice Shampoo", price: 620, image: IMG.pump },
        ],
      },
      {
        name: "Conditioner",
        slug: "conditioner",
        products: [
          { name: "Hibiscus Silk Conditioner", price: 790, image: IMG.tube },
          { name: "Shea Deep Repair", price: 850, image: IMG.tube },
          { name: "Leave-In Curl Cream", price: 910, image: IMG.tube },
          { name: "Rice Protein Rinse", price: 760, image: IMG.pump },
        ],
      },
      {
        name: "Hair Oils",
        slug: "hair-oils",
        products: [
          { name: "Bhringraj Growth Oil", price: 890, image: IMG.oil },
          { name: "Cold-Pressed Coconut Oil", price: 480, image: IMG.oil },
          { name: "Onion & Black Seed Oil", price: 760, image: IMG.oil },
          { name: "Argan Shine Serum Oil", price: 1120, image: IMG.serum },
        ],
      },
      {
        name: "Scalp Care",
        slug: "scalp-care",
        products: [
          { name: "Salt Scalp Scrub", price: 820, image: IMG.jar },
          { name: "Tea Tree Scalp Tonic", price: 940, image: IMG.serum },
          { name: "Clay Detox Hair Mask", price: 880, image: IMG.jar },
          { name: "Herbal Henna Powder", price: 390, image: IMG.pouch },
        ],
      },
    ],
  },
  {
    name: "Body Care",
    slug: "body-care",
    blurb: "Butters, scrubs & handmade soaps",
    image: IMG.soap,
    tone: "bg-emerald-50",
    accent: "text-emerald-700",
    subcategories: [
      {
        name: "Body Wash",
        slug: "body-wash",
        products: [
          { name: "Lemongrass Body Wash", price: 690, image: IMG.pump },
          { name: "Oat & Honey Shower Milk", price: 740, image: IMG.pump },
          { name: "Mint Cooling Wash", price: 660, image: IMG.pump },
          { name: "Sandalwood Shower Gel", price: 720, image: IMG.pump },
        ],
      },
      {
        name: "Body Butter",
        slug: "body-butter",
        products: [
          { name: "Whipped Shea Butter", price: 980, image: IMG.jar },
          { name: "Cocoa Stretch Balm", price: 1080, image: IMG.tin },
          { name: "Kokum Repair Butter", price: 1020, image: IMG.jar },
          { name: "Almond Body Lotion", price: 780, image: IMG.pump },
        ],
      },
      {
        name: "Scrubs",
        slug: "scrubs",
        products: [
          { name: "Coffee Body Scrub", price: 690, image: IMG.jar },
          { name: "Himalayan Salt Polish", price: 780, image: IMG.jar },
          { name: "Walnut Ubtan Scrub", price: 540, image: IMG.pouch },
          { name: "Sugar Lip Scrub", price: 320, image: IMG.tin },
        ],
      },
      {
        name: "Handmade Soaps",
        slug: "handmade-soaps",
        products: [
          { name: "Goat Milk Soap Bar", price: 260, image: IMG.soap },
          { name: "Activated Charcoal Bar", price: 280, image: IMG.soap },
          { name: "Rose Geranium Bar", price: 290, image: IMG.soap },
          { name: "Neem Tulsi Bar", price: 240, image: IMG.soap },
        ],
      },
    ],
  },
  {
    name: "Wellness",
    slug: "wellness",
    blurb: "Teas, ayurveda & essential oils",
    image: IMG.pouch,
    tone: "bg-lime-50",
    accent: "text-lime-700",
    subcategories: [
      {
        name: "Herbal Teas",
        slug: "herbal-teas",
        products: [
          { name: "Tulsi Ginger Tea", price: 420, image: IMG.pouch },
          { name: "Blue Pea Calm Tea", price: 480, image: IMG.pouch },
          { name: "Chamomile Sleep Tea", price: 520, image: IMG.pouch },
          { name: "Detox Green Blend", price: 460, image: IMG.pouch },
        ],
      },
      {
        name: "Ayurvedic Blends",
        slug: "ayurvedic-blends",
        products: [
          { name: "Ashwagandha Powder", price: 640, image: IMG.pouch },
          { name: "Triphala Churna", price: 380, image: IMG.pouch },
          { name: "Moringa Superfood", price: 560, image: IMG.pouch },
          { name: "Turmeric Latte Mix", price: 490, image: IMG.tin },
        ],
      },
      {
        name: "Essential Oils",
        slug: "essential-oils",
        products: [
          { name: "Lavender Essential Oil", price: 890, image: IMG.serum },
          { name: "Eucalyptus Steam Oil", price: 640, image: IMG.serum },
          { name: "Sweet Orange Oil", price: 590, image: IMG.serum },
          { name: "Peppermint Relief Oil", price: 680, image: IMG.serum },
        ],
      },
      {
        name: "Immunity",
        slug: "immunity",
        products: [
          { name: "Amla Vitamin C Shots", price: 720, image: IMG.oil },
          { name: "Giloy Immunity Drops", price: 540, image: IMG.serum },
          { name: "Honey & Ginger Elixir", price: 610, image: IMG.oil },
          { name: "Chyawanprash Classic", price: 460, image: IMG.jar },
        ],
      },
    ],
  },
  {
    name: "Baby Care",
    slug: "baby-care",
    blurb: "Gentle, dermat-tested, tear-free",
    image: IMG.tube,
    tone: "bg-sky-50",
    accent: "text-sky-700",
    subcategories: [
      {
        name: "Baby Bath",
        slug: "baby-bath",
        products: [
          { name: "Tear-Free Baby Wash", price: 590, image: IMG.pump },
          { name: "Baby Milk Soap", price: 220, image: IMG.soap },
          { name: "Calendula Bubble Bath", price: 640, image: IMG.pump },
          { name: "Baby Hair Cleanser", price: 570, image: IMG.pump },
        ],
      },
      {
        name: "Baby Massage",
        slug: "baby-massage",
        products: [
          { name: "Almond Massage Oil", price: 680, image: IMG.oil },
          { name: "Ayurvedic Baby Oil", price: 740, image: IMG.oil },
          { name: "Winter Warmth Oil", price: 690, image: IMG.oil },
          { name: "Sleep Well Lavender Oil", price: 720, image: IMG.serum },
        ],
      },
      {
        name: "Baby Lotion",
        slug: "baby-lotion",
        products: [
          { name: "Daily Baby Lotion", price: 560, image: IMG.pump },
          { name: "Shea Baby Cream", price: 620, image: IMG.jar },
          { name: "Nappy Rash Balm", price: 480, image: IMG.tin },
          { name: "Baby Lip & Cheek Balm", price: 290, image: IMG.tin },
        ],
      },
      {
        name: "Mother Care",
        slug: "mother-care",
        products: [
          { name: "Stretch Mark Butter", price: 1080, image: IMG.jar },
          { name: "Nipple Care Balm", price: 640, image: IMG.tin },
          { name: "Post-Partum Bath Salt", price: 720, image: IMG.pouch },
          { name: "Lactation Herbal Tea", price: 520, image: IMG.pouch },
        ],
      },
    ],
  },
  {
    name: "Gifting",
    slug: "gifting",
    blurb: "Hampers & festive ritual boxes",
    image: IMG.tin,
    tone: "bg-violet-50",
    accent: "text-violet-700",
    subcategories: [
      {
        name: "Gift Hampers",
        slug: "gift-hampers",
        products: [
          { name: "The Glow Ritual Box", price: 2490, image: IMG.tin },
          { name: "Calm Evening Hamper", price: 2890, image: IMG.pouch },
          { name: "Hair Revival Kit", price: 1990, image: IMG.oil },
          { name: "New Mom Care Box", price: 3190, image: IMG.jar },
        ],
      },
      {
        name: "Festive Boxes",
        slug: "festive-boxes",
        products: [
          { name: "Diwali Glow Edit", price: 3490, image: IMG.tin },
          { name: "Wedding Favour Set", price: 1690, image: IMG.soap },
          { name: "Rakhi Wellness Box", price: 1890, image: IMG.pouch },
          { name: "Corporate Gift Trio", price: 2290, image: IMG.pouch },
        ],
      },
      {
        name: "Combo Kits",
        slug: "combo-kits",
        products: [
          { name: "Cleanse + Glow Duo", price: 1590, image: IMG.serum },
          { name: "Hair Oil & Wash Combo", price: 1390, image: IMG.oil },
          { name: "Body Ritual Trio", price: 1790, image: IMG.jar },
          { name: "Travel Minis Pack", price: 990, image: IMG.tube },
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
  }));
})();

const pick = (names) =>
  names.map((name) => allProducts.find((p) => p.name === name)).filter(Boolean);

/** The 8-card "Shop our favourites" grid (2 rows of 4 on desktop). */
export const featuredProducts = pick([
  "Vitamin C Glow Serum",
  "Bhringraj Growth Oil",
  "Whipped Shea Butter",
  "Tulsi Ginger Tea",
  "Neem & Tulsi Face Wash",
  "Goat Milk Soap Bar",
  "Lavender Essential Oil",
  "The Glow Ritual Box",
]);

/** The vibrant best-seller rail. */
export const bestSellers = pick([
  "Rosehip Repair Elixir",
  "Amla Root Shampoo",
  "Coffee Body Scrub",
  "Ashwagandha Powder",
  "Ceramide Night Balm",
]);

export const benefits = [
  {
    icon: "leaf",
    title: "100% Certified Organic",
    text: "India Organic & USDA certified farms, traceable to every batch.",
  },
  {
    icon: "flask",
    title: "No Nasties, Ever",
    text: "Free from parabens, sulphates, silicones and mineral oil.",
  },
  {
    icon: "rabbit",
    title: "Cruelty Free",
    text: "PETA certified vegan formulas, never tested on animals.",
  },
  {
    icon: "recycle",
    title: "Plastic Neutral",
    text: "Every order recovers an equal weight of ocean-bound plastic.",
  },
  {
    icon: "truck",
    title: "Free Shipping ₹499+",
    text: "Carbon-neutral delivery to 19,000+ pin codes across India.",
  },
];

export const reviews = [
  {
    name: "Ananya Sharma",
    handle: "@ananyaglows",
    city: "Mumbai",
    title: "8 weeks of the Glow Serum",
    quote:
      "My pigmentation faded so much faster than I expected. This is the first serum I have actually repurchased three times.",
    rating: 5,
    product: "Vitamin C Glow Serum",
    tone: "from-rose-400 to-orange-300",
    views: "182K",
  },
  {
    name: "Rhea Kapoor",
    handle: "@rheaunfiltered",
    city: "Bengaluru",
    title: "Hair fall diary, day 60",
    quote:
      "I was losing clumps every wash. Two months on the Bhringraj oil and my ponytail is visibly thicker.",
    rating: 5,
    product: "Bhringraj Growth Oil",
    tone: "from-primary to-emerald-300",
    views: "246K",
  },
  {
    name: "Meera Iyer",
    handle: "@meerasritual",
    city: "Chennai",
    title: "My 5-minute night ritual",
    quote:
      "The night balm melts in instead of sitting on top. I wake up with skin that actually feels cushioned.",
    rating: 4,
    product: "Ceramide Night Balm",
    tone: "from-violet-400 to-primary",
    views: "97K",
  },
  {
    name: "Kabir Menon",
    handle: "@kabirbrews",
    city: "Pune",
    title: "Swapped coffee for Tulsi",
    quote:
      "Genuinely calmer afternoons and no 4pm crash. The blend smells like my grandmother's kitchen.",
    rating: 5,
    product: "Tulsi Ginger Tea",
    tone: "from-amber-400 to-lime-300",
    views: "63K",
  },
  {
    name: "Sara Fernandes",
    handle: "@sarasoaps",
    city: "Goa",
    title: "Unboxing the Glow Ritual Box",
    quote:
      "Zero plastic, everything in cloth and paper, and it arrived in two days. Gifted three already.",
    rating: 5,
    product: "The Glow Ritual Box",
    tone: "from-sky-400 to-primary",
    views: "141K",
  },
];

export const partners = [
  { name: "Verda Botanicals", logo: "/partners/verda.svg" },
  { name: "Bloom & Co", logo: "/partners/bloom-co.svg" },
  { name: "Pure Leaf Certified Organic", logo: "/partners/pure-leaf.svg" },
  { name: "Natura", logo: "/partners/natura.svg" },
  { name: "Greenhouse Farm Partners", logo: "/partners/greenhouse.svg" },
];

export const importantLinks = [
  { label: "About Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Shipment Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Return & Refund", href: "#" },
  { label: "Track Your Order", href: "#" },
  { label: "Store Locator", href: "#" },
  { label: "Blog & Journal", href: "#" },
];

export const contact = {
  phone: "+91 98200 41276",
  phoneHref: "tel:+919820041276",
  email: "care@orosorganics.com",
  emailHref: "mailto:care@orosorganics.com",
  address: "OROS Organics Pvt. Ltd., 14 Linking Road, Bandra West, Mumbai 400050",
  hours: "Mon – Sat, 10:00 – 19:00 IST",
};

export const announcements = [
  "Free carbon-neutral shipping on orders above ₹499",
  "Flat 20% off your first order — code WELCOME20",
  "New: Bakuchiol Night Serum is finally back in stock",
];

export const formatPrice = (value) => `₹${value.toLocaleString("en-IN")}`;
