import { Brand, Solution } from '@/types';

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'BRD-001',
    name: 'Aura Skincare',
    shopifyDomain: 'aura-skincare-global.myshopify.com',
    liveUrl: 'https://auraskincare.com',
    theme: 'Dawn (v14.0)',
    leadDeveloper: 'Rohit Sharma',
    accountManager: 'Ananya Verma',
    notes: 'High-volume international DTC store with multi-currency markets',
    status: 'Active',
  },
  {
    id: 'BRD-002',
    name: 'Verve Activewear',
    shopifyDomain: 'verve-athletic.myshopify.com',
    liveUrl: 'https://verveactive.co',
    theme: 'Prestige (v8.2)',
    leadDeveloper: 'Vikram Patel',
    accountManager: 'David Miller',
    notes: 'Heavy customization on PDP bundle selectors and pre-order logic',
    status: 'Active',
  },
  {
    id: 'BRD-003',
    name: 'Zenith Watches',
    shopifyDomain: 'zenith-timepieces-eu.myshopify.com',
    liveUrl: 'https://zenithwatches.eu',
    theme: 'Custom Headless (Hydrogen + Oxygen)',
    leadDeveloper: 'Neha Gupta',
    accountManager: 'Sophie Turner',
    notes: 'Shopify Plus B2B + D2C catalog with custom warranty registration',
    status: 'Active',
  },
  {
    id: 'BRD-004',
    name: 'Botanical Brews',
    shopifyDomain: 'botanical-tea-co.myshopify.com',
    liveUrl: 'https://botanicalbrews.com',
    theme: 'Impulse (v7.4)',
    leadDeveloper: 'Arjun Nair',
    accountManager: 'Ananya Verma',
    notes: 'Subscription heavy with Recharge integration and custom frequency picker',
    status: 'Active',
  },
  {
    id: 'BRD-005',
    name: 'Nordic Living Co',
    shopifyDomain: 'nordic-living-furnishings.myshopify.com',
    liveUrl: 'https://nordicliving.store',
    theme: 'Sense (v12.0)',
    leadDeveloper: 'Sneha Rao',
    accountManager: 'David Miller',
    notes: 'Custom freight shipping calculator and bulky item threshold warnings',
    status: 'Maintenance',
  },
  {
    id: 'BRD-006',
    name: 'Solace Footwear',
    shopifyDomain: 'solace-shoes.myshopify.com',
    liveUrl: 'https://solaceshoes.com',
    theme: 'Dawn (v13.0)',
    leadDeveloper: 'Rohit Sharma',
    accountManager: 'Sophie Turner',
    notes: 'Shoe size recommender modal synced with Shopify Metafields',
    status: 'Active',
  },
];

export const INITIAL_SOLUTIONS: Solution[] = [
  {
    id: 'SOL-001',
    brandName: 'Aura Skincare',
    title: 'Tiered Cart Drawer Progress Bar with Auto-Add Free Gift',
    category: 'Theme / Liquid',
    themeUsed: 'Dawn (v14.0)',
    problem:
      'Client wanted to boost Average Order Value (AOV) by offering Tier 1 (Free Shipping at $50), Tier 2 (Free Lip Balm at $80), and Tier 3 (Free Deluxe Serum at $120). Shopify native cart does not auto-add reward items or dynamically recalculate shipping thresholds across multi-currency markets.',
    implementation:
      '1. Created snippet `cart-tier-progress.liquid` connected to Cart AJAX API.\n2. Injected a dynamic SVG progress bar inside the Dawn `cart-drawer.liquid`.\n3. Listened to `cart:updated` event to dispatch `/cart/add.js` with `_free_gift: true` line item property when the subtotal reaches the threshold.\n4. Handled gift auto-removal if items are removed below the threshold.',
    codeSnippet: `// Cart Drawer Auto-Gift Listener
const FREE_GIFT_VARIANT_ID = 45291039829102;
const GIFT_THRESHOLD_CENTS = 8000;

document.addEventListener('cart:updated', async (event) => {
  const cart = event.detail.cart;
  const hasGift = cart.items.some(item => item.variant_id === FREE_GIFT_VARIANT_ID);
  
  if (cart.total_price >= GIFT_THRESHOLD_CENTS && !hasGift) {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          id: FREE_GIFT_VARIANT_ID,
          quantity: 1,
          properties: { '_is_free_gift': 'true' }
        }]
      })
    });
    window.location.reload(); // or update drawer DOM
  }
});`,
    repoLink: 'https://github.com/shopify-custom-solutions/cart-tiered-gift-dawn',
    documentationLink: 'https://loom.com/share/demo-tiered-cart-drawer',
    tags: ['cart-drawer', 'aov-booster', 'free-gift', 'ajax-cart', 'dawn-theme'],
    authorName: 'Rohit Sharma',
    authorEmail: 'rohit@team.com',
    difficulty: 'Medium (1-2 days)',
    createdAt: '2026-10-18',
  },
  {
    id: 'SOL-002',
    brandName: 'Zenith Watches',
    title: 'B2B VAT & Tax ID Real-Time Validation Checkout UI Extension',
    category: 'Checkout UI Extension',
    themeUsed: 'Custom Headless (Hydrogen)',
    problem:
      'European B2B customers on Shopify Plus needed to enter their VIES VAT number at checkout. Orders were previously placed with domestic VAT applied, causing tedious manual tax refund paperwork for accounting.',
    implementation:
      'Built a Shopify Checkout UI Extension using `@shopify/checkout-ui-extensions-react` placed at `purchase.checkout.shipping-option-list.render-after`.\n- Validates EU VAT via VIES API proxy in real-time.\n- Upon valid VAT response, writes to checkout attributes and triggers a Shopify Function to zero out tax lines for cross-border EU transactions.',
    codeSnippet: `import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyAttributeChange,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <VatValidationExtension />
);

function VatValidationExtension() {
  const setAttribute = useApplyAttributeChange();
  
  const handleVatCheck = async (vatNumber) => {
    const res = await fetch(\`https://api.shopifyhub.internal/vies-check?vat=\${vatNumber}\`);
    const data = await res.json();
    if (data.isValid) {
      await setAttribute({
        type: 'updateAttribute',
        key: '_validated_eu_vat',
        value: vatNumber
      });
    }
  };
  
  return (
    <BlockStack>
      <TextField label="EU VAT ID (Optional)" onBlur={handleVatCheck} />
    </BlockStack>
  );
}`,
    repoLink: 'https://github.com/shopify-custom-solutions/checkout-vat-validator',
    documentationLink: 'https://shopify.dev/docs/apps/checkout',
    tags: ['checkout-ui-extension', 'shopify-plus', 'b2b', 'vat-vies', 'taxes'],
    authorName: 'Neha Gupta',
    authorEmail: 'neha@team.com',
    difficulty: 'Complex (1+ week)',
    createdAt: '2026-10-21',
  },
  {
    id: 'SOL-003',
    brandName: 'Verve Activewear',
    title: 'Mix & Match 3-Piece Gym Set Dynamic Bundle Builder',
    category: 'Theme / Liquid',
    themeUsed: 'Prestige (v8.2)',
    problem:
      'Client wanted a custom "Build Your Set" page (Top + Leggings + Sports Bra) offering 25% off when all 3 categories are chosen, without relying on slow third-party bundle apps that slow down store speed.',
    implementation:
      '1. Created custom template `page.bundle-builder.liquid`.\n2. Queried products by Collection handle via Liquid.\n3. Used multi-item `/cart/add.js` API payload to push all selected variants simultaneously with a shared `_bundle_id` bundle key.\n4. Paired with a native Shopify Automatic Discount code.',
    codeSnippet: `// Multi-item payload for single-click cart submission
const bundlePayload = {
  items: [
    { id: topVariantId, quantity: 1, properties: { '_bundle_id': bundleId } },
    { id: leggingVariantId, quantity: 1, properties: { '_bundle_id': bundleId } },
    { id: braVariantId, quantity: 1, properties: { '_bundle_id': bundleId } }
  ]
};

fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bundlePayload)
}).then(res => res.json()).then(() => window.location.href = '/cart');`,
    repoLink: 'https://github.com/shopify-custom-solutions/prestige-bundle-builder',
    tags: ['bundle-builder', 'prestige-theme', 'cro', 'pdp', 'liquid'],
    authorName: 'Vikram Patel',
    authorEmail: 'vikram@team.com',
    difficulty: 'Medium (1-2 days)',
    createdAt: '2026-10-12',
  },
  {
    id: 'SOL-004',
    brandName: 'Botanical Brews',
    title: 'Custom Delivery Date & Time Slot Picker with Blackout Holidays',
    category: 'Shopify Functions',
    themeUsed: 'Impulse (v7.4)',
    problem:
      'Fresh artisanal tea sets cannot be delivered on weekends or national holidays. Needed a date/time picker on the cart drawer with courier cutoff times, storing the choice cleanly on the order for the logistics warehouse.',
    implementation:
      'Built a lightweight Vanilla JS calendar component (no heavy external date library) restricting selection based on warehouse holidays stored in a Shopify Shop Metafield JSON.\n- Written to cart attributes `delivery_date` and `delivery_time_slot`.\n- Integrated with Shopify Delivery Customization Function to hide expedited shipping if cutoff is passed.',
    codeSnippet: `// Cart Attribute injection
async function saveDeliveryPreferences(selectedDate, selectedSlot) {
  await fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attributes: {
        'Delivery Date': selectedDate,
        'Delivery Slot': selectedSlot,
        'Courier Cutoff Passed': isAfterCutoffTime() ? 'true' : 'false'
      }
    })
  });
}`,
    repoLink: 'https://github.com/shopify-custom-solutions/delivery-date-picker',
    tags: ['delivery-date', 'cart-drawer', 'metafields', 'logistics', 'impulse'],
    authorName: 'Arjun Nair',
    authorEmail: 'arjun@team.com',
    difficulty: 'Quick (< 2 hrs)',
    createdAt: '2026-10-09',
  },
  {
    id: 'SOL-005',
    brandName: 'Solace Footwear',
    title: 'Shoe Size Recommender & Metafield Variant Swatch Matrix',
    category: 'Metafields & Custom Data',
    themeUsed: 'Dawn (v13.0)',
    problem:
      'Footwear returns were high due to inconsistent sizing between US, UK, and EU standards. Also, color swatches needed to show actual leather texture previews instead of flat hex colors.',
    implementation:
      '1. Defined Product & Variant Metafields: `custom.leather_texture` (file reference) and `custom.size_conversion` (json).\n2. Added Liquid snippet `variant-swatch-matrix.liquid` in Dawn product form.\n3. Built an interactive slide-over size calculator modal converting foot length in cm to the recommended brand size.',
    codeSnippet: `{% comment %} Leather Texture Swatch {% endcomment %}
{% for variant in product.variants %}
  {% assign texture = variant.metafields.custom.leather_texture.value %}
  <label class="swatch-item" style="background-image: url('{{ texture | image_url: width: 64 }}');">
    <input type="radio" name="id" value="{{ variant.id }}" {% if forloop.first %}checked{% endif %}>
    <span class="sr-only">{{ variant.title }}</span>
  </label>
{% endfor %}`,
    repoLink: 'https://github.com/shopify-custom-solutions/footwear-swatch-matrix',
    tags: ['metafields', 'swatches', 'sizing-calculator', 'dawn-theme', 'cro'],
    authorName: 'Rohit Sharma',
    authorEmail: 'rohit@team.com',
    difficulty: 'Quick (< 2 hrs)',
    createdAt: '2026-10-05',
  },
];
