export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const previewNames = [
  'Chopper Cocoa',
  'Robin Dark Roast',
  'Franky Fuel',
  'Brook Bone Chill',
  'Sanji Sunrise',
];

const artByName = {
  'Luffy Latte': {
    drinkImage: '/onecafe-assets/generated/drinks/luffy-latte-generated.png',
    drinkAlt: 'Blue latte with Straw Hat foam art',
    accent: 'blue',
    previewBubble: 'Treasure tastes better with extra foam and a big grin.',
    themeLine: 'Captain Blend',
    menuDescription: 'A bright flagship latte with creamy foam art, buttery espresso depth, and captain-level charm in every sip.',
  },
  'Zoro Zen Matcha': {
    characterImage: '/onecafe-assets/characters/zoro-cutout.png',
    characterAlt: 'Zoro enjoying coffee with swords nearby',
    drinkImage: '/onecafe-assets/generated/drinks/zoro-zen-matcha-generated.png',
    drinkAlt: 'Green matcha vessel with sword motifs',
    accent: 'green',
    previewBubble: 'Three swords. One cup. Zero distractions.',
    themeLine: 'Swordmaster Sip',
    menuDescription: 'Ceremonial matcha with a deep grassy finish, velvet foam, and enough focus to cut through any sleepy morning.',
  },
  'Nami Navigator': {
    characterImage: '/onecafe-assets/characters/nami-cutout.png',
    characterAlt: 'Nami holding a bright drink and smiling',
    drinkImage: '/onecafe-assets/generated/drinks/nami-navigator-generated.png',
    drinkAlt: 'Tall citrus drink with orange slices and blue ice',
    accent: 'orange',
    previewBubble: 'Chart the route, then pour the brightest glass on deck.',
    themeLine: 'Navigator Pick',
    menuDescription: 'Sparkling citrus cold brew layered with orange brightness and ocean-blue ice for a crisp, adventurous finish.',
  },
  'Sanji Sunrise': {
    characterImage: '/onecafe-assets/generated/preview/sanji-sunrise-preview.png',
    characterAlt: 'Sanji serving a blue citrus drink on a comic panel',
    drinkImage: '/onecafe-assets/generated/drinks/sanji-sunrise-generated.png',
    drinkAlt: 'Blue citrus drink framed on a cyan menu panel',
    accent: 'cyan',
    previewBubble: 'Smooth finish. Sharp suit.',
    previewBubbleClass: 'preview-card__panel-copy--sanji',
    themeLine: 'Galley Special',
    menuDescription: 'A refined blue-citrus cooler with silky texture, clean sweetness, and a stylish lemon finish worthy of the galley.',
  },
  'Chopper Cocoa': {
    characterImage: '/onecafe-assets/generated/preview/chopper-cocoa-preview.png',
    characterAlt: 'Chopper beside a pink dessert drink on a comic panel',
    drinkImage: '/onecafe-assets/generated/drinks/chopper-cocoa-generated.png',
    drinkAlt: 'Pink dessert drink framed on a sakura menu panel',
    accent: 'pink',
    previewBubble: 'Sweetest pick on deck!',
    previewBubbleClass: 'preview-card__panel-copy--chopper',
    themeLine: 'Medic Favorite',
    menuDescription: 'A creamy sakura dessert drink loaded with whipped sweetness, cherry blossom notes, and cozy candy-shop energy.',
  },
  'Robin Dark Roast': {
    characterImage: '/onecafe-assets/generated/preview/robin-dark-roast-preview.png',
    characterAlt: 'Robin with tea on a purple comic panel',
    drinkImage: '/onecafe-assets/generated/drinks/robin-dark-roast-generated.png',
    drinkAlt: 'Purple floral tea framed on a violet menu panel',
    accent: 'purple',
    previewBubble: 'Elegant. Floral. Quietly bold.',
    previewBubbleClass: 'preview-card__panel-copy--robin',
    themeLine: 'Scholar Selection',
    menuDescription: 'A floral violet tea with layered aroma, delicate petals, and a calm finish that unfolds sip by sip.',
  },
  'Franky Fuel': {
    characterImage: '/onecafe-assets/generated/preview/franky-fuel-preview.png',
    characterAlt: 'Franky roaring beside a cola drink on a red comic panel',
    drinkImage: '/onecafe-assets/generated/drinks/franky-fuel-generated.png',
    drinkAlt: 'Cherry cola drink framed on a red menu panel',
    accent: 'red',
    previewBubble: 'SUPER cola power!',
    previewBubbleClass: 'preview-card__panel-copy--franky',
    themeLine: 'Cyborg Boost',
    menuDescription: 'An over-the-top cola espresso blast with fizzy bite, caramel depth, and pure high-voltage comic energy.',
  },
  'Brook Bone Chill': {
    characterImage: '/onecafe-assets/generated/preview/brook-bone-chill-preview.png',
    characterAlt: 'Brook with iced tea on a yellow comic panel',
    drinkImage: '/onecafe-assets/generated/drinks/brook-bone-chill-generated.png',
    drinkAlt: 'Amber iced tea framed on a yellow menu panel',
    accent: 'yellow',
    previewBubble: 'Yohoho! A chilled encore.',
    previewBubbleClass: 'preview-card__panel-copy--brook',
    themeLine: 'Encore Pour',
    menuDescription: 'Amber iced tea with smooth sweetness, clinking ice, and a cool encore that lingers like the final note of a solo.',
  },
  'Ace Inferno Brew': {
    accent: 'red',
    previewBubble: 'A blazing espresso with enough heat to light the mast.',
    themeLine: 'Flame Route',
    menuDescription: 'Dark espresso lit with spice and chocolate heat for a bold cup that lands fast and burns bright.',
  },
  'Gomu Gomu No... Punch!': {
    drinkImage: '/onecafe-assets/generated/drinks/usopp-sniper-generated.png',
    drinkAlt: 'Steaming adventure coffee cup with bubbling energy',
    accent: 'orange',
    previewBubble: 'TRY OUR NEW SPECIAL: GOMU GOMU NO... PUNCH!',
    themeLine: 'Limited Grand Line Special',
    menuDescription: 'A bubbling, over-caffeinated coffee cup that tastes like a punch of pure energy and keeps the whole crew fired up for the next adventure.',
  },
  'Shanks Redline': {
    accent: 'orange',
    previewBubble: 'Berry-smooth confidence with a captain level finish.',
    themeLine: 'Red Hair Reserve',
    menuDescription: 'A berry-rich mocha with velvet body, subtle cocoa depth, and a confident finish that stays smooth from start to end.',
  },
};

export const cartUpsells = [
  {
    image: '/onecafe-assets/panels/cart-sanji-panel.png',
    name: "Sanji's Spicy Cookie",
    note: 'A comic-book side quest for the sweet tooth on deck.',
    price: '$4.00',
  },
  {
    image: '/onecafe-assets/panels/cart-usopp-panel.png',
    name: "Usopp's Pop Green Tea",
    note: 'A bright herbal boost for long-range snack missions.',
    price: '$4.00',
  },
  {
    image: '/onecafe-assets/panels/cart-franky-panel.png',
    name: "Franky's Super Cola",
    note: 'Maximum fizz for anyone who thinks subtlety is overrated.',
    price: '$6.00',
  },
];

export const homePreviewPanels = [
  {
    id: 'chopper-preview',
    image: '/onecafe-assets/generated/preview/chopper-cocoa-preview.png',
    alt: 'Chopper dessert drink preview panel',
    bubbleText: 'Sweet medicine for rough days!',
    bubbleClass: 'preview-card__panel-copy--chopper',
  },
  {
    id: 'robin-preview',
    image: '/onecafe-assets/generated/preview/robin-dark-roast-preview.png',
    alt: 'Robin tea preview panel',
    bubbleText: 'A quiet sip with deadly focus.',
    bubbleClass: 'preview-card__panel-copy--robin',
  },
  {
    id: 'franky-preview',
    image: '/onecafe-assets/generated/preview/franky-fuel-preview.png',
    alt: 'Franky cola preview panel',
    bubbleText: 'Super fuel for max power!',
    bubbleClass: 'preview-card__panel-copy--franky',
  },
  {
    id: 'usopp-preview',
    image: '/onecafe-assets/generated/preview/usopp-preview.png',
    alt: 'Usopp coffee preview panel',
    bubbleText: 'Sniper focus, no misses today!',
    bubbleClass: 'preview-card__panel-copy--usopp',
  },
  {
    id: 'brook-preview',
    image: '/onecafe-assets/generated/preview/brook-bone-chill-preview.png',
    alt: 'Brook iced tea preview panel',
    bubbleText: 'Yohoho! Chill encore in a glass.',
    bubbleClass: 'preview-card__panel-copy--brook',
  },
  {
    id: 'sanji-preview',
    image: '/onecafe-assets/generated/preview/sanji-sunrise-preview.png',
    alt: 'Sanji blue drink preview panel',
    bubbleText: 'Smooth flavor, sharp style.',
    bubbleClass: 'preview-card__panel-copy--sanji',
  },
];

export const fallbackCoffees = [
  {
    coffee_id: 1,
    name: 'Luffy Latte',
    theme_tag: 'Straw Hat',
    description: 'Bold espresso with stretchy caramel swirl',
    price: 4.99,
    is_available: true,
  },
  {
    coffee_id: 2,
    name: 'Zoro Zen Matcha',
    theme_tag: 'Straw Hat',
    description: 'Three-sword strength matcha latte',
    price: 5.49,
    is_available: true,
  },
  {
    coffee_id: 3,
    name: 'Nami Navigator',
    theme_tag: 'Straw Hat',
    description: 'Citrus cold brew with orange zest',
    price: 4.49,
    is_available: true,
  },
  {
    coffee_id: 4,
    name: 'Sanji Sunrise',
    theme_tag: 'Straw Hat',
    description: 'Smooth vanilla latte with a kick of cinnamon',
    price: 5.29,
    is_available: true,
  },
  {
    coffee_id: 5,
    name: 'Chopper Cocoa',
    theme_tag: 'Straw Hat',
    description: 'Rich hot chocolate with marshmallow antlers',
    price: 3.99,
    is_available: true,
  },
  {
    coffee_id: 6,
    name: 'Robin Dark Roast',
    theme_tag: 'Straw Hat',
    description: 'Deep, mysterious dark roast coffee',
    price: 4.29,
    is_available: true,
  },
  {
    coffee_id: 7,
    name: 'Franky Fuel',
    theme_tag: 'Straw Hat',
    description: 'Super-charged espresso with cola syrup',
    price: 5.99,
    is_available: true,
  },
  {
    coffee_id: 8,
    name: 'Brook Bone Chill',
    theme_tag: 'Straw Hat',
    description: 'Iced coffee so cold it chills your soul',
    price: 4.79,
    is_available: true,
  },
  {
    coffee_id: 9,
    name: 'Ace Inferno Brew',
    theme_tag: 'Whitebeard',
    description: 'Spicy espresso with chili and dark chocolate',
    price: 5.99,
    is_available: true,
  },
  {
    coffee_id: 10,
    name: 'Shanks Redline',
    theme_tag: 'Red Hair',
    description: 'Red berry mocha with raspberry drizzle',
    price: 5.49,
    is_available: true,
  },
];

function accentToBackground(accent) {
  switch (accent) {
    case 'green':
      return '/onecafe-assets/backgrounds/comic-rays-green.png';
    case 'orange':
      return '/onecafe-assets/backgrounds/comic-rays-orange.png';
    case 'pink':
      return '/onecafe-assets/backgrounds/comic-rays-pink.png';
    case 'purple':
      return '/onecafe-assets/backgrounds/comic-rays-purple.png';
    case 'red':
      return '/onecafe-assets/backgrounds/comic-rays-red.png';
    case 'yellow':
      return '/onecafe-assets/backgrounds/comic-rays-yellow.png';
    case 'cyan':
      return '/onecafe-assets/backgrounds/comic-rays-cyan.png';
    case 'blue':
    default:
      return '/onecafe-assets/backgrounds/comic-burst-blue.png';
  }
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value ?? 0));
}

export function buildCoffeeCatalog(coffees) {
  const rows = Array.isArray(coffees) && coffees.length > 0 ? coffees : fallbackCoffees;

  const catalog = rows
    .filter((coffee) => coffee.is_available !== false)
    .map((coffee, index) => {
      const art = artByName[coffee.name] ?? {};
      const accent = art.accent ?? 'blue';

      return {
        ...coffee,
        coffee_id: Number(coffee.coffee_id ?? index + 1),
        accent,
        backgroundImage: accentToBackground(accent),
        characterImage: art.characterImage ?? null,
        characterAlt: art.characterAlt ?? `${coffee.name} character art`,
        drinkImage: coffee.name === 'Gomu Gomu No... Punch!'
          ? art.drinkImage || coffee.image_url || null
          : coffee.image_url || art.drinkImage || null,
        drinkAlt: art.drinkAlt ?? `${coffee.name} drink art`,
        themeLine: art.themeLine ?? coffee.theme_tag ?? 'Grand Line Roast',
        displayDescription: art.menuDescription ?? coffee.description,
        previewBubble: art.previewBubble ?? 'Fresh off the deck and ready for your next adventure.',
        previewBubbleClass: art.previewBubbleClass ?? '',
        previewEligible: previewNames.includes(coffee.name) && Boolean(art.characterImage),
        priceLabel: formatPrice(coffee.price),
      };
    })
    .sort((left, right) => left.coffee_id - right.coffee_id);

  const hasSpecial = catalog.some((coffee) => coffee.name === 'Gomu Gomu No... Punch!');
  if (!hasSpecial) {
    catalog.unshift({
      coffee_id: 999,
      name: 'Gomu Gomu No... Punch!',
      theme_tag: 'OneCafe Special',
      description: 'A bubbling coffee blast that lands like a finishing move.',
      price: 6.95,
      accent: 'orange',
      backgroundImage: '/onecafe-assets/backgrounds/comic-rays-orange.png',
      characterImage: '/onecafe-assets/characters/luffy-punch-hero.png',
      characterAlt: 'Luffy punch action art',
      drinkImage: '/onecafe-assets/generated/drinks/usopp-sniper-generated.png',
      drinkAlt: 'Steaming adventure coffee cup with bubbling energy',
      themeLine: 'Limited Grand Line Special',
      previewBubble: 'TRY OUR NEW SPECIAL: GOMU GOMU NO... PUNCH!',
      previewBubbleClass: 'preview-card__panel-copy--special',
      previewEligible: false,
      displayDescription: 'A bubbling, over-caffeinated coffee cup that tastes like a punch of pure energy and keeps the whole crew fired up for the next adventure.',
      priceLabel: formatPrice(6.95),
    });
  }

  return catalog;
}
