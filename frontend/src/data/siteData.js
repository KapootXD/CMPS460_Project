export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const menuPreviewCards = [
  {
    title: 'Chopper Sakura Frappe',
    desc: 'Sweet cherry blossom frappe with playful manga energy.',
    price: '550 Berries',
    image: '/onecafe-assets/panels/menu-chopper-panel.png',
  },
  {
    title: 'Robin Flower Tea',
    desc: 'Elegant floral tea scene with captain-choice styling.',
    price: '600 Berries',
    image: '/onecafe-assets/panels/menu-robin-panel.png',
  },
  {
    title: "Franky's Cola Cannon",
    desc: 'Explosive cola power with bold red burst framing.',
    price: '550 Berries',
    image: '/onecafe-assets/panels/menu-franky-panel.png',
  },
  {
    title: "Usopp's Sniper Espresso",
    desc: 'Marksman-style comic panel with sharp green impact lines.',
    price: '600 Berries',
    image: '/onecafe-assets/panels/menu-usopp-panel.png',
  },
  {
    title: "Sanji's All Blue Smoothie",
    desc: 'Stylish cyan panel with a premium all-blue vibe.',
    price: '450 Berries',
    image: '/onecafe-assets/panels/menu-sanji-panel.png',
  },
];

export const menuFeaturePanels = [
  {
    image: '/onecafe-assets/panels/menu-chopper-panel.png',
    name: "CHOPPER'S SAKURA FRAPPE",
    text: 'A refreshing cherry blossom frappe with whipped cream and sweet red bean paste.',
    price: '550 Berries',
  },
  {
    image: '/onecafe-assets/panels/menu-robin-panel.png',
    name: "CAPTAIN'S CHOICE!",
    text: 'An ancient, fragrant tea brewed with exotic flowers. Elegant and mysterious.',
    price: '600 Berries',
  },
];

export const menuMiniPanels = [
  {
    image: '/onecafe-assets/panels/menu-franky-panel.png',
    name: "Franky's Cola Cannon",
    price: '550 Berries',
  },
  {
    image: '/onecafe-assets/panels/menu-usopp-panel.png',
    name: "Usopp's Sniper Espresso",
    price: '600 Berries',
  },
  {
    image: '/onecafe-assets/panels/menu-brook-panel.png',
    name: "Brook's Soul King Iced Tea",
    price: '450 Berries',
  },
  {
    image: '/onecafe-assets/panels/menu-sanji-panel.png',
    name: "Sanji's All Blue Smoothie",
    price: '450 Berries',
  },
];

export const cartItems = [
  {
    qty: 1,
    name: "Franky's Cola Cannon",
    desc: 'High-impact cola cannon brew with foamy finish.',
    price: '550 Berries',
    image: '/onecafe-assets/panels/menu-franky-panel.png',
  },
  {
    qty: 1,
    name: "Usopp's Sniper Espresso",
    desc: 'Sharp espresso shot with marksman precision.',
    price: '600 Berries',
    image: '/onecafe-assets/panels/menu-usopp-panel.png',
  },
  {
    qty: 1,
    name: "Sanji's All Blue Smoothie",
    desc: 'Citrus-forward blue blend to chart your morning route.',
    price: '450 Berries',
    image: '/onecafe-assets/panels/menu-sanji-panel.png',
  },
];

export const cartUpsells = [
  {
    image: '/onecafe-assets/panels/cart-sanji-panel.png',
    name: "Sanji's Spicy Cookie",
    price: '400 Berries',
  },
  {
    image: '/onecafe-assets/panels/cart-usopp-panel.png',
    name: "Usopp's Pop Green Tea",
    price: '400 Berries',
  },
  {
    image: '/onecafe-assets/panels/cart-franky-panel.png',
    name: "Franky's Super Cola",
    price: '600 Berries',
  },
];
