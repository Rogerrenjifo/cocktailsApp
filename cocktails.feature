Feature: Administracion local de cockteles
  Como administrador
  Quiero iniciar sesion y administrar cockteles en una sola pantalla
  Para mantener un registro historico guardado en el navegador

  Background:
    Given la aplicacion se ejecuta localmente en el navegador
    And existe un unico usuario admin con usuario "roger" y contrasenia "12345"

  Scenario: Login exitoso con credenciales validas
    Given no existe una sesion activa
    When ingreso el usuario "roger"
    And ingreso la contrasenia "12345"
    And hago clic en "Iniciar sesion"
    Then debo ver la pantalla principal de administracion
    And debo ver la opcion "Cerrar sesion"

  Scenario: Persistencia de sesion despues de recargar
    Given he iniciado sesion correctamente como admin
    When recargo la pagina
    Then debo seguir autenticado
    And debo ver la pantalla principal de administracion

  Scenario: Crear un cocktail valido
    Given he iniciado sesion correctamente como admin
    And no existe un cocktail llamado "Mojito Clasico"
    When completo el formulario con:
      | nombre         | Mojito Clasico |
      | descripcion    | Ron, hierbabuena y limon |
      | precioMinimo   | 8              |
      | precioPromedio | 12             |
    And hago clic en "Guardar"
    Then debo ver el cocktail "Mojito Clasico" en el listado
    And el cocktail debe quedar guardado historicamente en el navegador

  Scenario: Listar cockteles historicos al abrir la app
    Given existe un cocktail guardado historicamente con nombre "Negroni"
    And he iniciado sesion correctamente como admin
    When ingreso a la pantalla principal
    Then debo ver el cocktail "Negroni" en el listado

  Scenario: Editar un cocktail existente
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Old Fashioned"
    When hago clic en "Editar" para el cocktail "Old Fashioned"
    And cambio la descripcion por "Whisky, azucar y bitters"
    And cambio el precioPromedio a "15"
    And hago clic en "Actualizar"
    Then debo ver el cocktail "Old Fashioned" actualizado en el listado
    And los cambios deben persistir al recargar la pagina

  Scenario: Cancelar una edicion en curso
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Daiquiri"
    When hago clic en "Editar" para el cocktail "Daiquiri"
    And modifico el campo descripcion a "Cambio temporal"
    And hago clic en "Cancelar edicion"
    Then el formulario debe volver al modo crear
    And el cocktail "Daiquiri" debe mantener su informacion original

  Scenario: Eliminar un cocktail confirmando la accion
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Margarita"
    When hago clic en "Eliminar" para el cocktail "Margarita"
    And confirmo la eliminacion
    Then el cocktail "Margarita" no debe aparecer en el listado
    And el cambio debe persistir al recargar la pagina

  Scenario: Cerrar sesion sin perder los cockteles guardados
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Martini"
    When hago clic en "Cerrar sesion"
    Then debo ver la pantalla de login
    When inicio sesion nuevamente con usuario "roger" y contrasenia "12345"
    Then debo ver el cocktail "Martini" en el listado

  Scenario: Login fallido por credenciales invalidas
    Given no existe una sesion activa
    When ingreso el usuario "roger"
    And ingreso la contrasenia "00000"
    And hago clic en "Iniciar sesion"
    Then no debo acceder a la pantalla principal
    And debo ver un mensaje de error de credenciales invalidas

  Scenario: No permitir crear un cocktail sin nombre
    Given he iniciado sesion correctamente como admin
    When completo el formulario con:
      | nombre         |                |
      | descripcion    | Prueba sin nombre |
      | precioMinimo   | 5              |
      | precioPromedio | 10             |
    And hago clic en "Guardar"
    Then debo ver un mensaje de validacion para el nombre obligatorio
    And el registro no debe guardarse

  Scenario: No permitir crear un cocktail duplicado
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Caipirinha"
    When completo el formulario con:
      | nombre         | Caipirinha     |
      | descripcion    | Intento duplicado |
      | precioMinimo   | 7              |
      | precioPromedio | 11             |
    And hago clic en "Guardar"
    Then debo ver un mensaje de validacion por nombre duplicado
    And el registro no debe guardarse

  Scenario: No permitir precio minimo mayor que precio promedio
    Given he iniciado sesion correctamente como admin
    When completo el formulario con:
      | nombre         | Aperol Spritz  |
      | descripcion    | Prueba de precios |
      | precioMinimo   | 20             |
      | precioPromedio | 10             |
    And hago clic en "Guardar"
    Then debo ver un mensaje de validacion indicando que el precio minimo debe ser menor o igual al promedio
    And el registro no debe guardarse

  Scenario: No permitir precios negativos
    Given he iniciado sesion correctamente como admin
    When completo el formulario con:
      | nombre         | Boulevardier   |
      | descripcion    | Precio negativo |
      | precioMinimo   | -1             |
      | precioPromedio | 9              |
    And hago clic en "Guardar"
    Then debo ver un mensaje de validacion indicando que los precios deben ser positivos
    And el registro no debe guardarse

  Scenario: No permitir guardar con precio promedio no positivo
    Given he iniciado sesion correctamente como admin
    When completo el formulario con:
      | nombre         | Sidecar        |
      | descripcion    | Promedio invalido |
      | precioMinimo   | 4              |
      | precioPromedio | 0              |
    And hago clic en "Guardar"
    Then debo ver un mensaje de validacion indicando que los precios deben ser positivos
    And el registro no debe guardarse

  Scenario: Cancelar eliminacion desde la confirmacion
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Cosmopolitan"
    When hago clic en "Eliminar" para el cocktail "Cosmopolitan"
    And cancelo la eliminacion
    Then el cocktail "Cosmopolitan" debe seguir apareciendo en el listado

  Scenario: No perder los datos historicos al recargar
    Given he iniciado sesion correctamente como admin
    And existe un cocktail guardado con nombre "Penicillin"
    When recargo la pagina
    Then debo ver el cocktail "Penicillin" en el listado

  Scenario: Mostrar estado vacio cuando no existen cockteles
    Given he iniciado sesion correctamente como admin
    And no existen cockteles guardados historicamente
    When ingreso a la pantalla principal
    Then debo ver un mensaje indicando que aun no hay cockteles registrados
