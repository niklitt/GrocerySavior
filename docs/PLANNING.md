# GrocerySavior - Planning Document

## Project Vision

Help users find grocery deals and have an easy shopping experience by:
1. Finding grocery stores in their area with distances
2. Showing product prices and deals
3. Managing shopping lists

---

## Feasibility Research (January 2025)

### Grocery Price Data APIs

| Source | Cost | Coverage | Feasibility | Notes |
|--------|------|----------|-------------|-------|
| **Kroger API** | FREE (10K/day) | Kroger family stores | **HIGH** | Best free option |
| Walmart API | FREE (limited) | Walmart only | MEDIUM | Affiliate-focused, limited product data |
| Target API | NOT PUBLIC | Target only | LOW | No public API |
| Instacart API | NOT PUBLIC | Multi-store | LOW | Partner-only |
| Open Food Facts | FREE | Product info only | MEDIUM | No prices, useful for UPC data |
| Web Scraping | "Free" | Any store | RISKY | ToS violations, legally gray |

**Conclusion**: Full price comparison across ALL stores is not feasible for free. Kroger API is the best option, covering ~2,800 stores in 35 states.

### Kroger API Details
- **URL**: https://developer.kroger.com/
- **Free tier**: 10,000 calls/day
- **Covers**: Kroger, Ralphs, Fred Meyer, King Soopers, Fry's, Smith's, QFC, Dillons, etc.
- **Provides**: Product search, pricing, store locations, promotions
- **Auth**: OAuth 2.0 client credentials

### Location/Distance APIs

| Service | Free Tier | Recommendation |
|---------|-----------|----------------|
| Browser Geolocation API | FREE | Use for user location |
| Haversine Formula | FREE (math) | Use for distance calculation |
| Kroger Location API | FREE | Use for finding Kroger stores |
| Google Places | $200/month | Backup option |

---

## Strategy: Kroger-First MVP

### What We Can Build for Free
- Find nearby Kroger family stores with distances
- Search products and see real Kroger prices
- View current sales/promotions at Kroger
- Manage shopping lists (local storage)

### What Requires Investment
- Price comparison across ALL grocery stores
- Non-Kroger store prices (Target, Walmart in-store, Costco, etc.)
- Real-time inventory/stock levels
- User accounts and cloud sync

---

## Architecture

```
src/
├── components/
│   ├── common/           # Button, Input, Card, Loading
│   ├── stores/           # StoreList, StoreCard
│   ├── products/         # ProductSearch, ProductCard, ProductList
│   ├── shopping-list/    # ShoppingList, ShoppingListItem, AddItemForm
│   └── deals/            # DealsList, DealCard
├── hooks/
│   ├── useGeolocation.ts
│   ├── useStores.ts
│   ├── useProducts.ts
│   └── useShoppingList.ts
├── services/
│   ├── kroger/           # auth.ts, stores.ts, products.ts, types.ts
│   └── location/         # geolocation.ts, distance.ts
├── utils/
│   ├── storage.ts        # Local storage helpers
│   ├── formatters.ts     # Price/distance formatting
│   └── constants.ts
├── types/
│   ├── store.ts
│   ├── product.ts
│   └── shopping-list.ts
├── context/
│   ├── AuthContext.tsx
│   └── ShoppingListContext.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── StoresPage.tsx
│   ├── SearchPage.tsx
│   └── ShoppingListPage.tsx
└── App.tsx
```

---

## Implementation Phases

### Phase 1: Foundation & Location
- [ ] Create folder structure
- [ ] TypeScript type definitions (Store, Product, ShoppingList)
- [ ] Geolocation service (browser API wrapper)
- [ ] Distance calculation (Haversine formula)
- [ ] useGeolocation hook
- [ ] Tests for location services

### Phase 2: Kroger API Integration
- [ ] Environment configuration (.env setup)
- [ ] Kroger OAuth authentication service
- [ ] Kroger type definitions (API responses)
- [ ] Store search service
- [ ] Product search service
- [ ] useStores and useProducts hooks
- [ ] Tests for Kroger services

### Phase 3: Core UI Components
- [ ] Common components (Button, Input, Card, Loading)
- [ ] Store components (StoreCard, StoreList)
- [ ] Product components (ProductCard, ProductList, ProductSearch)
- [ ] Component tests

### Phase 4: Shopping List Feature
- [ ] Local storage service
- [ ] ShoppingListContext
- [ ] Shopping list components
- [ ] useShoppingList hook
- [ ] Tests

### Phase 5: Page Assembly & Routing
- [ ] Install react-router-dom
- [ ] Create page components
- [ ] Configure App router
- [ ] Navigation component

### Phase 6: Polish & Error Handling
- [ ] Error boundary
- [ ] Loading states/skeletons
- [ ] Empty states
- [ ] CSS styling
- [ ] Responsive design

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **CORS issues** | Medium | High | Use Vite proxy (dev) or serverless function |
| Kroger API changes | Medium | High | Abstract behind service layer |
| API rate limiting | Low | Medium | Implement caching, debounce searches |
| Geolocation denied | Medium | Medium | Allow manual zip code entry |
| No Kroger in user's area | Medium | High | Be transparent about coverage |

---

## Future Expansion (Post-MVP)

- Price history tracking
- Price drop alerts
- Barcode scanner (camera)
- Multiple shopping lists
- Share/export lists
- Additional store APIs (if available)
- User accounts and cloud sync
- Mobile app (React Native)

---

## Environment Setup

### Kroger API Credentials

1. Register at https://developer.kroger.com/
2. Create an application to get Client ID and Client Secret
3. Create a `.env` file in the project root (already in `.gitignore`):

```
VITE_KROGER_CLIENT_ID=your_client_id_here
VITE_KROGER_CLIENT_SECRET=your_client_secret_here
```

**Important**:
- The `VITE_` prefix is required for Vite to expose variables to the app
- Never commit `.env` to git (it's already in `.gitignore`)
- Access in code via `import.meta.env.VITE_KROGER_CLIENT_ID`

---

## Success Criteria

- [ ] User can see nearby Kroger stores with distances
- [ ] User can search products and see prices
- [ ] User can see items on sale
- [ ] User can manage a shopping list
- [ ] Works without paid subscriptions
- [ ] Tests pass
- [ ] Works on mobile browsers
