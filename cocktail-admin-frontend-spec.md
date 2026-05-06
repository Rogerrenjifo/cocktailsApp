# Especificacion Funcional y Tecnica

## 1. Objetivo

Construir una aplicacion frontend local para administrar cockteles. La aplicacion debe permitir autenticacion simple con credenciales hardcodeadas y, una vez iniciada la sesion, debe permitir crear, editar, listar y eliminar registros de cockteles persistidos en el navegador.

Esta especificacion esta redactada para que una IA pueda implementar la aplicacion sin asumir backend, servicios externos ni base de datos real.

## 2. Alcance del MVP

El MVP incluye:

- Pantalla de login.
- Autenticacion frontend con credenciales hardcodeadas.
- Persistencia de sesion en el navegador.
- Pantalla principal protegida.
- Formulario para crear y editar cockteles.
- Listado historico de cockteles guardados.
- Eliminacion con confirmacion previa.
- Persistencia de los cockteles en el navegador.
- Interfaz en espaniol.
- Estilo visual basico inspirado en dashboards de trading como Binance, pero simple.

El MVP no incluye:

- Backend.
- API remota.
- Base de datos real.
- Registro de usuarios.
- Recuperacion de contrasenia.
- Multiples roles.
- Filtros o buscador.
- Distincion entre cocktail y shot mediante un campo separado.
- Despliegue productivo.

## 3. Stack recomendado

La implementacion recomendada es:

- React.
- Vite.
- JavaScript o TypeScript. TypeScript es preferible si la IA lo considera viable sin agregar complejidad innecesaria.
- CSS plano o CSS Modules. No es necesario usar librerias pesadas de UI.
- localStorage para persistencia.

La prioridad es simplicidad, rapidez de desarrollo y legibilidad.

## 4. Usuario y autenticacion

Debe existir un unico usuario administrador hardcodeado:

- Usuario: `roger`
- Contrasenia: `12345`

Reglas:

- Si las credenciales coinciden exactamente, el login es exitoso.
- Si no coinciden, se debe mostrar un mensaje de error en espaniol.
- La sesion debe persistir en el navegador usando localStorage o mecanismo equivalente del frontend.
- Si hay una sesion valida guardada, la app debe abrir directamente la pantalla principal.
- Debe existir accion para cerrar sesion.
- Al cerrar sesion, debe limpiarse el estado de autenticacion, pero no deben borrarse los cockteles guardados.

## 5. Estructura general de pantallas

La app puede resolverse en una sola pagina con renderizado condicional, sin necesidad de routing complejo.

Pantallas o estados principales:

1. Estado no autenticado:
   mostrar formulario de login.
2. Estado autenticado:
   mostrar dashboard principal con encabezado, formulario y listado historico.

## 6. Datos del dominio

Cada cocktail debe tener esta estructura minima:

- `id`: identificador unico.
- `nombre`: string.
- `descripcion`: string.
- `precioMinimo`: number.
- `precioPromedio`: number.
- `fechaCreacion`: string o timestamp.
- `fechaActualizacion`: string o timestamp.

Consideraciones:

- `id` debe ser unico y estable.
- `descripcion` puede ser vacia si la implementacion decide permitirlo.
- `fechaActualizacion` debe modificarse al editar.

## 7. Reglas funcionales del formulario

El formulario debe soportar dos modos:

- Crear cocktail.
- Editar cocktail existente.

Campos visibles:

- Nombre.
- Descripcion.
- Precio minimo.
- Precio promedio.

Comportamiento:

- En modo crear, el formulario debe iniciar vacio.
- En modo editar, el formulario debe cargarse con los datos del registro seleccionado.
- Debe existir una accion clara para guardar cambios en edicion.
- Debe existir una accion clara para cancelar la edicion y volver al modo crear.

## 8. Validaciones obligatorias

Las siguientes validaciones son obligatorias:

1. El nombre es obligatorio.
2. El nombre no puede duplicarse respecto a otros registros existentes.
3. El precio minimo debe ser un numero positivo.
4. El precio promedio debe ser un numero positivo.
5. El precio minimo debe ser menor o igual al precio promedio.

Reglas adicionales recomendadas:

- Normalizar espacios al inicio y al final del nombre antes de validar.
- La validacion de duplicado debe ser case-insensitive si se quiere una UX mas robusta.
- En modo editar, el registro actual no debe contar como duplicado de si mismo.
- Los errores deben mostrarse en espaniol y junto al formulario.
- Si hay errores, no debe guardarse el registro.

## 9. Persistencia

Persistencia requerida:

- La sesion autenticada debe persistir en el navegador.
- Los cockteles deben persistir historicamente en el navegador.

Fuente de verdad:

- Usar localStorage.

Claves sugeridas:

- `cocktail-app-session`
- `cocktail-app-items`

Comportamiento esperado:

- Al cargar la app, leer la sesion primero.
- Si hay sesion valida, cargar la vista principal.
- Al cargar la vista principal, leer todos los cockteles guardados.
- Al crear, editar o eliminar, persistir inmediatamente los cambios.
- Al recargar la pagina, los datos deben seguir presentes.

## 10. Listado historico

La misma pantalla principal debe incluir un listado con todos los cockteles guardados historicamente.

Cada item del listado debe mostrar como minimo:

- Nombre.
- Descripcion.
- Precio minimo.
- Precio promedio.
- Fecha de creacion o actualizacion, si la IA considera que mejora la claridad.
- Accion de editar.
- Accion de eliminar.

Estados del listado:

- Si no hay registros, mostrar un estado vacio en espaniol.
- Si hay registros, mostrarlos de forma clara y legible.

## 11. Eliminacion

La eliminacion debe requerir confirmacion previa.

Reglas:

- El usuario pulsa eliminar.
- Se muestra confirmacion.
- Si confirma, se elimina el registro y se persiste el cambio.
- Si cancela, no ocurre ningun cambio.

Para el MVP se acepta usar confirmacion nativa del navegador.

## 12. Requisitos de interfaz

La interfaz debe estar completamente en espaniol.

Direccion visual deseada:

- Estetica inspirada en un dashboard de trading.
- Apariencia sobria, moderna y basica.
- No recargar con demasiados componentes.
- Priorizar claridad y contraste.

Requisitos visuales minimos:

- Layout centrado o tipo panel.
- Tarjetas o paneles para separar login, formulario y listado.
- Colores oscuros o neutros con acentos para acciones principales.
- Responsive basico para escritorio y pantallas angostas.

No hace falta replicar Binance ni construir un UI complejo.

## 13. Comportamiento esperado de UX

- El usuario debe entender rapidamente si esta en login o dentro de la app.
- Debe ser evidente cuando esta creando versus editando.
- Los mensajes de error deben ser concretos.
- Los botones deben tener etiquetas claras en espaniol.
- Debe existir una accion visible para cerrar sesion.

Etiquetas sugeridas:

- `Iniciar sesion`
- `Usuario`
- `Contrasenia`
- `Nombre del cocktail`
- `Descripcion`
- `Precio minimo`
- `Precio promedio`
- `Guardar`
- `Actualizar`
- `Cancelar edicion`
- `Editar`
- `Eliminar`
- `Cerrar sesion`

## 14. Arquitectura sugerida

Una posible estructura de archivos es:

```text
src/
  App.jsx
  main.jsx
  styles/
    global.css
  components/
    LoginForm.jsx
    CocktailForm.jsx
    CocktailList.jsx
    CocktailCard.jsx
  lib/
    auth.js
    storage.js
    validation.js
```

Responsabilidades:

- `App`: decide si mostrar login o dashboard segun sesion.
- `LoginForm`: maneja inputs y submit de autenticacion.
- `CocktailForm`: alta y edicion.
- `CocktailList`: renderiza listado y estados vacios.
- `CocktailCard`: item individual si se quiere separar.
- `auth.js`: login, logout, lectura de sesion.
- `storage.js`: CRUD sobre localStorage.
- `validation.js`: reglas reutilizables del formulario.

## 15. Criterios de aceptacion

La implementacion se considera correcta si cumple todos estos puntos:

1. La app inicia mostrando login cuando no hay sesion.
2. El login con `roger` y `12345` permite entrar.
3. Credenciales invalidas muestran error y no permiten entrar.
4. La sesion persiste al recargar.
5. Se puede crear un cocktail valido.
6. El nuevo cocktail aparece en el listado inmediatamente.
7. El cocktail creado sigue existiendo tras recargar.
8. No se puede guardar un cocktail sin nombre.
9. No se puede guardar un cocktail con nombre duplicado.
10. No se puede guardar un cocktail con precios negativos o cero si la IA interpreta positivo como mayor que cero.
11. No se puede guardar un cocktail con precio minimo mayor que precio promedio.
12. Se puede editar un cocktail ya creado.
13. La edicion actualiza el listado y la persistencia.
14. Se puede cancelar una edicion sin modificar datos.
15. Al eliminar se solicita confirmacion.
16. Si se confirma, el registro se elimina.
17. Si se cancela, el registro permanece.
18. La app se mantiene usable en una pantalla angosta.

## 16. Atributos data-testid

Todos los elementos interactivos y contenedores clave deben incluir un atributo `data-testid` para facilitar la automatizacion de pruebas con herramientas como Playwright o Cypress.

Lista obligatoria de atributos `data-testid`:

### Pantalla de login

- `data-testid="login-form"` — formulario de login completo.
- `data-testid="input-username"` — campo de usuario.
- `data-testid="input-password"` — campo de contrasenia.
- `data-testid="btn-login"` — boton de iniciar sesion.
- `data-testid="login-error"` — mensaje de error de credenciales invalidas.

### Encabezado de la app

- `data-testid="btn-logout"` — boton de cerrar sesion.

### Formulario de cocktail

- `data-testid="cocktail-form"` — contenedor del formulario.
- `data-testid="input-nombre"` — campo de nombre.
- `data-testid="input-descripcion"` — campo de descripcion.
- `data-testid="input-precio-minimo"` — campo de precio minimo.
- `data-testid="input-precio-promedio"` — campo de precio promedio.
- `data-testid="btn-guardar"` — boton de guardar en modo crear.
- `data-testid="btn-actualizar"` — boton de guardar en modo editar.
- `data-testid="btn-cancelar-edicion"` — boton de cancelar edicion.
- `data-testid="error-nombre"` — mensaje de error para el campo nombre.
- `data-testid="error-precio-minimo"` — mensaje de error para precio minimo.
- `data-testid="error-precio-promedio"` — mensaje de error para precio promedio.
- `data-testid="error-precios"` — mensaje de error de relacion precio minimo mayor al promedio.

### Listado de cockteles

- `data-testid="cocktail-list"` — contenedor del listado completo.
- `data-testid="empty-state"` — mensaje de estado vacio cuando no hay registros.
- `data-testid="cocktail-item"` — cada fila o tarjeta del listado. Puede incluir un sufijo con el id del registro, por ejemplo `data-testid="cocktail-item-{id}"`, si la IA lo considera util para selectores mas especificos.
- `data-testid="btn-editar-{id}"` — boton de editar por registro.
- `data-testid="btn-eliminar-{id}"` — boton de eliminar por registro.

Reglas generales:

- Los `data-testid` no deben cambiar al cambiar el estado de la app, excepto los que incluyen el `id` del registro.
- No usar clases CSS ni texto visible como selectores de prueba, ese es el proposito de los `data-testid`.
- Deben colocarse directamente sobre el elemento HTML interactivo o contenedor relevante, no en un elemento padre generico.

## 17. Restricciones para la IA implementadora

- No introducir backend.
- No introducir autenticacion real contra servidor.
- No agregar librerias innecesarias.
- No salir del alcance definido.
- Mantener el codigo simple y legible.
- Priorizar una solucion funcional antes que una solucion sobrearquitecturada.
- Incluir todos los atributos `data-testid` definidos en la seccion 16 sin excepcion.

## 18. Entregables esperados

La IA que implemente debe producir:

- Proyecto frontend ejecutable localmente.
- Login funcional con persistencia.
- CRUD parcial de cockteles: crear, listar, editar y eliminar.
- Validaciones descritas.
- UI basica en espaniol.
- Codigo organizado y facil de mantener.
- Todos los atributos `data-testid` definidos en la seccion 16 presentes en el codigo fuente.
