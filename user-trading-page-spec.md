# Especificacion Funcional y Tecnica - Pagina Publica de Trading

## 1. Objetivo

Construir una pagina publica para usuarios (sin login) que muestre los cockteles creados por admin en una experiencia tipo trading Binance.

La pagina tendrá dos vistas:

1. **Vista principal (tabla)**: lista de todos los cockteles con nombre, precio actual en Bs y % de cambio en los últimos 15 minutos.
2. **Vista de compra (modal)**: al hacer click en un cocktail, se abre un modal para comprar ese cocktail específico.

El precio actual es dinámico:

- Baja 1 Bs por minuto mientras la página de market está abierta.
- Nunca baja del precio mínimo del cocktail.
- Sube 1 Bs por cada unidad comprada.
- Se actualiza inmediatamente al confirmar una compra.

Todo funciona solo frontend, con persistencia en localStorage y sin backend.

## 2. Alcance del MVP

El MVP incluye:

**Vista principal:**

- Tabla/lista horizontal de todos los cockteles.
- Columnas: Nombre, Precio Actual (Bs), % Cambio (15 min).
- Filas clickeables para abrir modal de compra.
- Indicador visual de % cambio (verde si subió, rojo si bajó).
- Estado vacío si no hay cockteles.

**Vista de compra (modal):**

- Overlay semitransparente al fondo.
- Tarjeta central mostrando solo:
  - Nombre del cocktail
  - Precio actual en Bs
  - Input de cantidad
  - Total estimado
  - Botón "Comprar"
  - Botón "Cerrar" para volver a tabla sin comprar
- Validaciones de cantidad con mensajes de error en español.
- Feedback visual tras compra exitosa.

**Mecánica de precio:**

- Decremento automático de 1 Bs cada 60 segundos.
- Incremento inmediato por compra.
- Persistencia del precio dinámico en localStorage.
- Cálculo de % cambio basado en snapshot de hace 15 minutos.

**UI:**

- Interfaz completamente en español.
- Estilo oscuro tipo trading (reutiliza colores existentes).
- Responsive para escritorio y mobile.
- Atributos data-testid obligatorios.

El MVP no incluye:

- Backend, API o sincronización servidor.
- Login de usuarios.
- Pagos reales o billetera.
- Órdenes limitadas, market depth, o matching engine real.
- Historial completo de transacciones.


## 3. Regla principal de precio dinamico

Por cada cocktail se define:

- `precioMinimo`: viene de admin, piso minimo.
- `precioPromedio`: viene de admin, valor inicial.
- `precioActualBs`: precio vivo para trading.
- `precioHace15Min`: snapshot de hace 15 minutos para calcular %.

**Inicializacion:**

- Si no existe estado de trading previo, iniciar:
  - `precioActualBs = precioPromedio`
  - `precioHace15Min = precioPromedio`

**Regla temporal (tick cada 60s):**

- `precioActualBs = max(precioMinimo, precioActualBs - 1)`
- El tick ocurre solo mientras la pagina de market este abierta.

**Regla de compra:**

- Al comprar cantidad `q`:
  - `precioActualBs = precioActualBs + q`

**Regla de % cambio (cada 15 minutos):**

- Calcular porcentaje: `((precioActualBs - precioHace15Min) / precioHace15Min) * 100`
- Cada 15 minutos, actualizar: `precioHace15Min = precioActualBs`

**Reglas adicionales:**

- Se puede comprar incluso si el precio esta en el minimo.
- No existe techo maximo del precio.
- No hay catch-up retroactivo de decrementos si la pagina estuvo cerrada.

## 4. Persistencia y comportamiento temporal

Persistencia requerida:

- Los cockteles base se leen desde `cocktail-app-items`.
- El estado de trading se guarda en una clave separada recomendada:
  - `cocktail-user-trading-state`

**Estructura del estado de trading:**

```json
{
  "<cocktailId>": {
    "precioActualBs": 25,
    "precioHace15Min": 28,
    "ultimaActualizacion": "2026-05-05T12:00:00.000Z",
    "ultimaActualizacion15Min": "2026-05-05T11:45:00.000Z",
    "volumenComprado": 14,
    "ultimaCompra": {
      "cantidad": 2,
      "precioUnitario": 23,
      "total": 46,
      "fecha": "2026-05-05T12:03:00.000Z"
    }
  }
}
```

**Timers:**

- Tick de precio cada 60 segundos (setInterval 60000ms, limpieza en unmount).
- Actualizacion de `precioHace15Min` cada 15 minutos (setInterval 900000ms, limpieza en unmount).
- Sincronizacion entre pestanias con evento `storage`.

## 5. Flujo funcional de usuario

1. Usuario abre pagina publica (#market).
2. Se renderiza tabla con lista de cockteles: Nombre | Precio Actual | % Cambio (15min).
3. Usuario hace click en un row de la tabla.
4. Se abre modal con:
   - Nombre del cocktail
   - Precio actual (solo este, no promedio ni minimo)
   - Input de cantidad
   - Total estimado
   - Boton "Comprar" y "Cerrar"
5. Usuario ingresa cantidad y hace click en "Comprar".
6. Sistema valida cantidad, ejecuta compra, persiste cambios, muestra feedback.
7. Usuario puede cerrar modal y volver a tabla.
8. Tabla se actualiza con nuevo precio y % cambio.
9. Reloj sigue bajando 1 Bs/min mientras el modal este abierto.

## 6. Validaciones obligatorias

**Compra en modal:**

1. Cantidad obligatoria (no puede estar vacia).
2. Cantidad debe ser numero entero.
3. Cantidad debe ser mayor que 0.
4. Si invalida, mostrar error en espanol en el modal sin ejecutar compra.

**Datos fuente:**

5. Si no hay cockteles, mostrar estado vacio en tabla.
6. Si un cocktail trae precios invalidos, no romper UI, mostrar fallback.

## 7. UX/UI esperada

Direccion visual:

- Inspiracion trading basica (sobria, clara, sin complejidad excesiva).
- Reutilizar el look and feel oscuro ya existente en la app.

Elementos UX clave:

- Tabla principal con columnas: Nombre, Precio Actual, Cambio (15min).
- Precio actual con color por tendencia frente al precio inicial:
  - Verde cuando el precio actual esta por encima del precio promedio inicial.
  - Rojo cuando el precio actual esta por debajo del precio promedio inicial.
  - Neutro cuando esta igual.
- % cambio en 15 minutos con color:
  - Verde si > 0.
  - Rojo si < 0.
  - Neutro con simbolo "—" cuando el cambio es practicamente 0.
- Filas clickeables para abrir modal de compra.
- Modal de compra centrado con overlay oscuro y acciones Comprar/Cerrar.
- Feedback corto al comprar (ej. "Compra ejecutada").
- Estado vacio amigable cuando no hay cockteles.
- Responsive basico para escritorio y mobile angosto.

Etiquetas sugeridas:

- "Mercado de Cockteles"
- "Precio Actual"
- "Cambio (15min)"
- "Cantidad"
- "Total"
- "Comprar"
- "Cerrar"
- "Compra ejecutada"

## 8. Arquitectura sugerida

**Estructura:**

```text
src/
  pages/
    UserMarketPage.jsx       — orquesta vistas y state
  components/
    MarketListView.jsx       — tabla principal
    MarketBuyModal.jsx       — modal de compra
  lib/
    userTradingStorage.js    — lectura/escritura de state
    userTradingEngine.js     — reglas puras de precio
```

**Responsabilidades:**

- `UserMarketPage`: carga cockteles, inicializa trading state, administra timers (60s y 15min), controla que vista mostrar (lista o modal), maneja click en rows.
- `MarketListView`: renderiza tabla con todos los cockteles, precio actual, % cambio 15min.
- `MarketBuyModal`: renderiza modal para un cocktail, input cantidad, validacion, botones comprar/cerrar.
- `userTradingStorage.js`: `getTradingState()`, `saveTradingState()`, `ensureTradingStateForItems()`.
- `userTradingEngine.js`: `applyMinuteTick()`, `applyBuy()`, `parseQuantity()`, `calculateChangePercent()`, `formatBs()`.

## 9. Atributos data-testid obligatorios

**Contenedores principales:**

- `data-testid="market-page"` — pagina principal.
- `data-testid="market-title"` — titulo "Mercado".
- `data-testid="market-list"` — tabla/lista contenedor.
- `data-testid="market-empty-state"` — estado vacio.

**Tabla (MarketListView):**

- `data-testid="market-row-{id}"` — fila clickeable por cocktail.
- `data-testid="market-row-nombre-{id}"` — nombre en fila.
- `data-testid="market-row-precio-{id}"` — precio actual en fila.
- `data-testid="market-row-cambio-{id}"` — % cambio en fila.

**Modal (MarketBuyModal):**

- `data-testid="market-modal"` — contenedor modal.
- `data-testid="market-modal-nombre"` — nombre del cocktail en modal.
- `data-testid="market-modal-precio"` — precio actual en modal.
- `data-testid="market-modal-cantidad"` — input de cantidad.
- `data-testid="market-modal-total"` — total estimado.
- `data-testid="market-modal-btn-comprar"` — boton comprar.
- `data-testid="market-modal-btn-cerrar"` — boton cerrar.
- `data-testid="market-modal-error"` — mensaje error validacion.
- `data-testid="market-modal-success"` — mensaje exito compra.

**Timer:**

- `data-testid="market-last-tick"` — timestamp del ultimo tick (opcional, para debugging).

## 10. Criterios de aceptacion

La implementacion se considera correcta si cumple:

1. La pagina user es publica y no pide login.
2. Muestra todos los cockteles existentes del admin en tabla.
3. Si no hay cockteles, muestra estado vacio.
4. La tabla muestra Nombre, Precio Actual y Cambio (15min).
5. Al iniciar, precio actual se inicializa con precio promedio cuando no existe estado previo.
6. Cada 60 segundos, el precio actual baja 1 Bs.
7. El precio nunca baja de precio minimo.
8. Comprar 1 unidad sube el precio en 1 Bs inmediatamente.
9. Comprar `q` unidades sube el precio en `q` Bs inmediatamente.
10. La compra se ejecuta desde modal al hacer click en una fila.
11. Cantidad invalida no compra y muestra error.
12. Total estimado se calcula correctamente antes de comprar.
13. Precio dinamico persiste tras recargar.
14. Al cerrar y reabrir despues, no se aplican decrementos retroactivos por tiempo fuera de pagina.
15. Se calcula y muestra % de cambio a 15 minutos.
16. Si el % es practicamente 0, se muestra "—" en lugar de "+0.00%".
17. Precio actual se pinta verde/rojo/neutral segun tendencia vs precio inicial.
18. Todos los `data-testid` definidos en esta spec existen.
19. La experiencia sigue usable en mobile angosto.

## 11. Restricciones para implementadora

- No introducir backend.
- No romper funcionalidad admin existente.
- Mantener reglas numericas exactas: -1 Bs/min, +1 Bs/unidad comprada.
- Sin decrementos retroactivos al reabrir.
- Interfaz 100% espanol.
- Todos los data-testid sin excepcion.

## 12. Entregables

- Pagina market con tabla principal y modal de compra.
- Motor de precio con tick cada 60s y % cambio cada 15min.
- Validaciones y persistencia completas.
- Responsive design.
- Data-testid cobertura total.
