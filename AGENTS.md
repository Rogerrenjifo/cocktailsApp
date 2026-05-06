# AGENTS.md

## Project Snapshot
- Name: cocktail-admin
- Stack: React 18 + Vite + plain JavaScript
- Scope: Admin CRUD + public market page (trading-style)
- Language: Spanish UI text
- Backend: none (frontend only)

## Main Product Flows
1. Admin flow (#admin)
- Login required for admin actions.
- Credentials are hardcoded: roger / 12345.
- Admin can create, edit, delete cocktails.
- Validation: required unique name (case-insensitive), positive prices, min <= average.

2. Public market flow (#market)
- No login required.
- Main view is a table with:
  - Nombre
  - Precio Actual
  - Cambio (15min)
- Clicking a row opens a buy modal for that cocktail.
- Modal shows only: name, current price, quantity, estimated total, buy and close actions.

## Routing and Entry
- Hash routing is used.
- Main routes:
  - #admin
  - #market
- Entry files:
  - src/main.jsx
  - src/App.jsx

## Local Storage Contract
1. Cocktail catalog (shared admin + market)
- Key: cocktail-app-items
- Managed in: src/lib/storage.js

2. Session state
- Key: cocktail-app-session
- Managed in: src/lib/auth.js

3. User trading state (market only)
- Key: cocktail-user-trading-state
- Managed in: src/lib/userTradingStorage.js
- Per-cocktail state includes:
  - precioActualBs
  - precioHace15Min
  - ultimaActualizacion
  - ultimaActualizacion15Min
  - volumenComprado
  - ultimaCompra

## Trading Rules (Source of Truth)
- Initial market price: precioActualBs = precioPromedio (if missing state).
- Minute tick: every 60s, current price decreases by 1 Bs until min price.
- Buy impact: buying q units increases current price by q Bs immediately.
- 15-minute reference:
  - Percentage is based on precioHace15Min.
  - Every 15 min, precioHace15Min is updated to current price.
- No retroactive catch-up when page is closed.

## Core Market Components
- src/pages/UserMarketPage.jsx
  - Loads items and trading state.
  - Runs 60s and 15min timers.
  - Handles row selection, modal open/close, buy flow.
- src/components/MarketListView.jsx
  - Renders table and row click behavior.
  - Price color trend vs initial average:
    - green when above initial
    - red when below initial
    - neutral when equal
  - % change color:
    - green positive
    - red negative
    - displays "—" when change is near zero
- src/components/MarketBuyModal.jsx
  - Quantity validation and total display.
  - Buy action and success/error feedback.

## Utilities
- src/lib/userTradingEngine.js
  - clampToMin
  - applyMinuteTick
  - applyBuy
  - parseQuantity
  - formatBs
  - calculateChangePercent

## Data-testid Contract (Market)
Top-level:
- market-page
- market-title
- market-list
- market-empty-state
- market-last-tick

Table rows:
- market-row-{id}
- market-row-nombre-{id}
- market-row-precio-{id}
- market-row-cambio-{id}

Modal:
- market-modal
- market-modal-nombre
- market-modal-precio
- market-modal-cantidad
- market-modal-total
- market-modal-btn-comprar
- market-modal-btn-cerrar
- market-modal-error
- market-modal-success

## Specs and Features
- Admin spec: cocktail-admin-frontend-spec.md
- Admin scenarios: cocktails.feature
- Market spec: user-trading-page-spec.md
- Market scenarios: user-trading-market.feature

## Styling Notes
- Global styles are in src/styles/global.css
- Theme is dark trading-style with CSS variables.
- Important visual behavior:
  - table row hover
  - green/red market semantics
  - modal overlay and centered card
  - responsive behavior under 560px

## Commands
- Install: npm install
- Dev server: npm run dev
- Build: npm run build

## Working Agreements for Future Agents
- Keep admin behavior backward compatible.
- Do not introduce backend unless explicitly requested.
- Preserve localStorage key names unless migration is requested.
- Keep all market data-testid values stable.
- Keep UI labels in Spanish unless user asks otherwise.
- Prefer minimal, targeted edits over broad refactors.

## Quick Start Checklist for New Agent
1. Read user-trading-page-spec.md and user-trading-market.feature.
2. Verify market flow in src/pages/UserMarketPage.jsx.
3. Verify table/modal contracts in MarketListView and MarketBuyModal.
4. Run npm run build before finalizing changes.
