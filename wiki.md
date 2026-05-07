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
- #market: public trading-style market page

Route behavior:
- App defaults to admin view unless hash is #market.

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
- Main page shows a table with 4 columns:
  - **Nombre**: Cocktail name
  - **Precio Actual**: Current price with inline sparkline chart
  - **Cambio (15min)**: Percentage change + absolute Bs change from 15-minute reference
  - **Vol 15m**: Total volume and operation count in last 15 minutes
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
The app always includes 3 default cocktails pre-seeded into localStorage on first load or when catalog is empty/invalid:

1. **Tequila Shot** (ID: auto-generated)
   - Description: El clasico con sal y limon. Simple pero infalible.
   - precioMinimo: 10
   - precioPromedio: 30

2. **Jagerbomb** (ID: auto-generated)
   - Description: Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.
   - precioMinimo: 20
   - precioPromedio: 30

3. **B-52** (ID: auto-generated)
   - Description: Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.
   - precioMinimo: 25
   - precioPromedio: 40

Behavior:
- Existing saved catalog is not overwritten.
- Seed applies on missing, empty, or invalid catalog payload.
- Each app run checks localStorage; if empty, defaults are restored.

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
- **precioActualBs**: Current market price
- **precioHace15Min**: Reference price from 15 minutes ago (for % change calculation)
- **historialPrecios**: Array of price history points with timestamp (max 16 points for sparkline)
- **actividad15Min**: Array of activity history points (volume + operation count per minute, max 15 points)
- **volumen15Min**: Total volume traded in last 15 minutes
- **operaciones15Min**: Total operation count in last 15 minutes
- **ultimaActualizacion**: ISO timestamp of last price tick
- **ultimaActualizacion15Min**: ISO timestamp of last 15-minute reference update
- **volumenComprado**: Total lifetime volume purchased
- **ultimaCompra**: Last purchase transaction details (cantidad, precioUnitario, total, fecha)

## 7. Trading Rules (Source of Truth)
### 7.1 Initial State
- If cocktail has no trading state, precioActualBs starts at precioPromedio.
- precioHace15Min also starts at precioPromedio.
- Price history is initialized with 2 synthetic points.

### 7.2 Volatility Tick (Every 60 seconds)
Price uses a volatility model with mean reversion:
- **Mean reversion**: 3% drift toward precioPromedio
- **Noise**: Random variance up to ±max(2% of promedio, 0.4)
- **Sell pressure**: -0.15 Bs natural decay
- **Bounds**: Price stays between precioMinimo and (precioPromedio * 2)
- **Activity**: 65% chance per minute of 0-2 simulated operations

### 7.3 Buy Impact
- Buying quantity q increases current price by q Bs immediately.
- Transaction is recorded in actividad15Min.

### 7.4 15-Minute Reference Update
- Every 15 minutes, precioHace15Min updates to current price.
- Display shows both % change and absolute Bs value.
- Activity summary recalculated from 15-minute window.

### 7.5 Offline Behavior
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
- **src/pages/UserMarketPage.jsx**
  - Loads catalog and trading state
  - Runs 60s tick interval with volatility pricing
  - Simulates market activity (65% chance of trades per minute)
  - Runs 15min timer for reference price update
  - Handles row selection and buy flow
  - Updates lastTick timestamp on each minute

- **src/components/MarketListView.jsx**
  - Renders market table with 4 columns: Nombre | Precio Actual (sparkline) | Cambio (15min % + Bs) | Vol 15m
  - Generates SVG sparkline from 16-point rolling price history
  - Applies color semantics for price trend and change direction
  - Displays normalized change as "—" when near-zero (< 0.5%)

- **src/components/MarketBuyModal.jsx**
  - Quantity input, estimated total, and buy action
  - Success feedback message with auto-dismiss
  - Error validation for empty, zero, negative, or decimal quantities

- **src/components/MarketCocktailCard.jsx**
  - Market-specific card component (alternative card-based view)

## 9. Utility Modules

### src/lib/storage.js
- Catalog retrieval, save, create, update, delete
- Default seed behavior with DEFAULT_ITEMS
- Validation of JSON payload integrity

### src/lib/auth.js
- Login with hardcoded credentials (roger / 12345)
- Logout and session retrieval

### src/lib/validation.js
- Cocktail form business validations
- Unique name check (case-insensitive)
- Price relationship validation (min <= average)
- Positive price enforcement

### src/lib/userTradingStorage.js
- Trading state persistence and bootstrap
- ensureTradingStateForItems(): Initialize missing states with synthetic history
- Backward-compatible migrations

### src/lib/userTradingEngine.js
- **clampToMin(price, min)**: Ensure price >= min
- **applyMinuteTick(actual, min, promedio)**: Volatility model (drift/noise/decay)
- **appendPricePoint(history, price, timestamp)**: Rolling 16-point price window
- **appendActivityPoint(history, volume, operations, timestamp)**: Rolling 15-point activity window
- **getActivitySummary(activity)**: Aggregate volume and operation count
- **applyBuy(price, quantity)**: Increase price by quantity amount
- **parseQuantity(input)**: Validate positive integer quantity
- **formatBs(price)**: Format as "XX.XX Bs" string
- **calculateChangePercent(trading)**: % change from precioHace15Min
- **calculateChangeAbsolute(trading)**: Absolute Bs change from precioHace15Min

## 10. Market UI Semantics
### Price Trend Color
- Above precioPromedio: green
- Below precioPromedio: red
- Equal: neutral

### Change Display (15-minute % + Bs)
- Shows dual metric: percentage and absolute value
- Positive: green ("+ X%" and "+ X Bs")
- Negative: red ("- X%" and "- X Bs")
- Near-zero (< 0.5%): neutral dash ("—")

### Sparkline Chart
- SVG inline visualization of 16-point price history
- Color matches price trend (green/red/neutral)

### Volume Display
- Shows 15-minute total volume and operation count
- Example: "45 units, 3 ops"

## 11. Test ID Contract
**DEPRECATED**: All data-testid attributes have been removed from the application for QA testing hardening. QA must rely on CSS selectors, element hierarchy, or visual inspection.

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
- **All data-testid attributes intentionally removed** for QA testing hardening.
- Keep UI labels in Spanish unless requested otherwise.
- Prefer minimal and targeted edits over broad refactors.
- Volatility pricing (mean reversion + noise + decay) is the core market model.
- Default cocktails always available; reset if catalog corrupted.

## 15. Acceptance References
Specification and scenario files (updated to reflect current state):
- **cocktail-admin-frontend-spec.md**: Admin CRUD specification
- **cocktails.feature**: Admin scenarios (with default cocktails)
- **user-trading-page-spec.md**: Market specification
- **user-trading-market.feature**: Market scenarios (with volatility, sparkline, volume)

## 16. Recent Implementation History

### Phase 1: Data & Documentation
- Added DEFAULT_ITEMS seeding (Tequila Shot, Jagerbomb, B-52)
- Created comprehensive wiki.md
- Initialized Git repository with clean .gitignore

### Phase 2: Test Isolation
- Removed all 52 data-testid attributes from components
- Ensures QA must use alternative selection strategies

### Phase 3: Market Enhancements (4 Major Features)
1. **Volatility-Aware Pricing**: Replaced linear decrement with mean-reversion + noise + decay model
2. **Improved 15min Change**: Display both percentage and absolute Bs value
3. **Sparkline Visualization**: Added SVG sparklines to price column showing 16-point history
4. **Simulated Activity**: Track volume and operation count per 15-minute window

### Key Files Modified
- src/lib/storage.js: Added DEFAULT_ITEMS
- src/lib/userTradingEngine.js: Enhanced volatility tick + history/activity functions
- src/lib/userTradingStorage.js: Extended schema with historialPrecios, actividad15Min, volumen15Min, operaciones15Min
- src/pages/UserMarketPage.jsx: Implemented tick loop + simulated activity + buy flow
- src/components/MarketListView.jsx: Added sparkline generation + dual-metric change display + volume column
- src/styles/global.css: Added sparkline and change stack styling
- All components: Removed data-testid attributes
