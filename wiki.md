# Cocktail Admin Wiki

## 1. Overview
Cocktail Admin is a frontend-only app built with React 18 and Vite.

Main scope:
- Admin CRUD for cocktails
- Public market page with trading-style behavior

Language:
- UI texts are in Spanish

Backend:
- None. Data is persisted in browser localStorage.

## 2. Tech Stack
- React 18
- Vite
- Plain JavaScript
- CSS (global styles)

Entry points:
- src/main.jsx
- src/App.jsx

## 3. Routing Model
Hash routing is used.

Routes:
- #admin: admin login and cocktail management
- #market: public trading-style market page (default)

Route behavior:
- App defaults to market view unless hash is #admin.
- Base URL without hash opens the public market.

## 4. Product Flows
### 4.1 Admin Flow
- Login is required for admin actions.
- Hardcoded credentials:
  - username: roger
  - password: 12345
- Admin capabilities:
  - Create cocktail
  - Edit cocktail
  - Delete cocktail

Validation rules in admin form:
- Name is required.
- Name must be unique (case-insensitive).
- precioMinimo must be positive.
- precioPromedio must be positive.
- precioMinimo cannot be greater than precioPromedio.

### 4.2 Public Market Flow
- No login required.
- Main page shows a table with:
  - Nombre
  - Precio Actual (con sparkline)
  - Cambio (15min) en porcentaje y Bs
  - Vol 15m (volumen y operaciones)
- Clicking a row opens buy modal for selected cocktail.

Buy modal includes:
- Cocktail name
- Current price
- Quantity input
- Estimated total
- Comprar action
- Cerrar action

Quantity validation:
- Must be an integer greater than 0.

## 5. Default Catalog Seed
When there is no valid cocktail catalog in localStorage, the app auto-seeds 3 default cocktails:

1. Tequila Shot
- Description: El clasico con sal y limon. Simple pero infalible.
- precioMinimo: 10
- precioPromedio: 30

2. Jagerbomb
- Description: Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.
- precioMinimo: 20
- precioPromedio: 30

3. B-52
- Description: Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.
- precioMinimo: 25
- precioPromedio: 40

Important behavior:
- Existing saved catalog is not overwritten.
- Seed only applies on missing or invalid catalog payload.

## 6. Local Storage Contract
### 6.1 Cocktail Catalog
- Key: cocktail-app-items
- Managed in: src/lib/storage.js

Cocktail shape:
- id
- nombre
- descripcion
- precioMinimo
- precioPromedio
- fechaCreacion
- fechaActualizacion

### 6.2 Admin Session
- Key: cocktail-app-session
- Managed in: src/lib/auth.js

Session shape:
- username

### 6.3 User Trading State
- Key: cocktail-user-trading-state
- Managed in: src/lib/userTradingStorage.js

Per cocktail state shape:
- precioActualBs
- precioHace15Min
- precioReferenciaInicialBs
- historialPrecios
- actividad15Min
- volumen15Min
- operaciones15Min
- ultimaActualizacion
- ultimaActualizacion15Min
- volumenComprado
- ultimaCompra

## 7. Trading Rules (Source of Truth)
Initial state:
- If cocktail has no trading state, precioActualBs starts at precioPromedio.
- precioHace15Min starts from a synthetic reference close to precioPromedio.

Minute tick:
- Every 60 seconds, price is updated with mean reversion + bounded random noise + sell pressure.
- Price is clamped between precioMinimo and a max bound based on precioPromedio.
- Each tick appends a point to historialPrecios.
- Each tick can add simulated market activity used for volumen/ops.

Buy impact:
- Buying quantity q increases current price by q Bs immediately.
- Buy also updates historialPrecios and actividad15Min.

15-minute reference update:
- Change is calculated against the reference price from the stored history window.
- UI shows both percentage and absolute Bs change.

Offline behavior:
- No retroactive catch-up if page was closed.

## 8. Main Components and Responsibilities
### 8.1 App Shell
- src/App.jsx
  - Handles hash-based view selection
  - Handles admin session state
  - Handles CRUD interactions for cocktails

### 8.2 Admin Components
- src/components/LoginForm.jsx
  - Auth form and credential validation feedback
- src/components/CocktailForm.jsx
  - Create/edit cocktail with validation
- src/components/CocktailList.jsx
  - Render list of registered cocktails
- src/components/CocktailCard.jsx
  - Visual card with edit/delete actions

### 8.3 Market Components
- src/pages/UserMarketPage.jsx
  - Loads catalog and trading state
  - Runs 60s market tick loop
  - Simulates market activity (volumen/operaciones)
  - Handles row selection and buy flow
- src/components/MarketListView.jsx
  - Renders market table and row click behavior
  - Applies color semantics for trend and change
  - Displays sparkline and Vol 15m column
- src/components/MarketBuyModal.jsx
  - Quantity input, estimated total, and buy action
- src/components/MarketCocktailCard.jsx
  - Market-specific card component (present in repository)

## 9. Utility Modules
- src/lib/storage.js
  - Catalog retrieval, save, create, update, delete
  - Default seed behavior
- src/lib/auth.js
  - Login, logout, session retrieval
- src/lib/validation.js
  - Cocktail form business validations
- src/lib/userTradingStorage.js
  - Trading state persistence, bootstrap and backward-compatible enrichment
- src/lib/userTradingEngine.js
  - clampToMin
  - applyMinuteTick
  - appendPricePoint
  - appendActivityPoint
  - getActivitySummary
  - applyBuy
  - parseQuantity
  - formatBs
  - calculateChangePercent
  - calculateChangeAbsolute

## 10. Market UI Semantics
Price trend in list (relative to initial average):
- Above initial: green
- Below initial: red
- Equal: neutral

15-minute change formatting:
- Positive: green with plus sign
- Negative: red
- Near zero: displays 0.00% and 0.00 Bs

Price column extras:
- Sparkline visual for recent history

Volume column:
- Shows volume and operation count with suffix "ops"

## 11. Test ID Contract
### Top-level market IDs
- market-page
- market-title
- market-list
- market-empty-state
- market-last-tick

### Market row IDs
- market-row-{id}
- market-row-nombre-{id}
- market-row-precio-{id}
- market-row-cambio-{id}

### Modal IDs
- market-modal
- market-modal-nombre
- market-modal-precio
- market-modal-cantidad
- market-modal-total
- market-modal-btn-comprar
- market-modal-btn-cerrar
- market-modal-error
- market-modal-success

## 12. Styling Notes
- Global styles are in src/styles/global.css.
- Theme follows dark trading style with CSS variables.
- Important behavior:
  - table row hover
  - red/green market semantics
  - centered modal overlay
  - responsive behavior under 560px

## 13. Development Commands
Install dependencies:
- npm install

Run dev server:
- npm run dev

Build production bundle:
- npm run build

## 14. Product and Maintenance Agreements
- Keep admin behavior backward compatible.
- Do not add backend unless explicitly requested.
- Preserve localStorage key names unless migration is explicitly required.
- Keep market data-testid values stable.
- Keep UI labels in Spanish unless requested otherwise.
- Prefer minimal and targeted edits over broad refactors.

## 15. Acceptance References
Specification and scenario files:
- cocktail-admin-frontend-spec.md
- cocktails.feature
- user-trading-page-spec.md
- user-trading-market.feature
