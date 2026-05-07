Feature: Mercado publico de cockteles con precio dinamico en Bs
  Como usuario publico
  Quiero ver y comprar cockteles en una experiencia tipo trading basico
  Para operar con una tabla de mercado realista con volatilidad y volumen

  Background:
    Given la aplicacion corre solo en frontend
    And existe la data base de cockteles en localStorage bajo "cocktail-app-items"
    And el estado de trading se guarda en "cocktail-user-trading-state"
    And tres cockteles por defecto estan disponibles: Tequila Shot, Jagerbomb, B-52

  Scenario: Mostrar pagina publica sin login
    Given no existe sesion admin activa
    When ingreso a la pagina publica de mercado
    Then debo ver la pantalla de mercado sin pedir autenticacion
    And debo ver el titulo "Mercado de Cockteles"

  Scenario: Mostrar tabla principal de mercado con columnas completas
    Given existen cockteles cargados por admin
    When ingreso a la pagina publica de mercado
    Then debo ver todos los cockteles en la tabla de mercado
    And cada fila debe mostrar nombre, precio actual (con sparkline), cambio en 15 minutos (% y Bs) y volumen 15min

  Scenario: Estado vacio cuando no hay cockteles
    Given no existen cockteles en "cocktail-app-items"
    When ingreso a la pagina publica de mercado
    Then debo ver un estado vacio informando que no hay cockteles disponibles

  Scenario: Inicializar precio actual con precio promedio
    Given existe un cocktail "Mojito" con precioPromedio 20 y precioMinimo 12
    And no existe estado previo para ese cocktail en "cocktail-user-trading-state"
    When ingreso a la pagina publica de mercado
    Then el precio actual de "Mojito" debe iniciar en 20 Bs

  Scenario: Abrir modal de compra al hacer click en una fila
    Given existen cockteles cargados por admin
    And estoy en la tabla de mercado
    When hago click en la fila de "Mojito"
    Then debo ver el modal de compra
    And el modal debe mostrar nombre, precio actual, input cantidad y total estimado

  Scenario: Cerrar modal y volver a tabla
    Given tengo abierto el modal de compra de "Mojito"
    When hago click en "Cerrar"
    Then debo volver a ver solo la tabla de mercado

  Scenario: Volatilidad de precio cada minuto con media reversion
    Given existe un cocktail "Negroni" con precioActualBs 30, precioPromedio 30 y precioMinimo 20
    And estoy en la pagina publica de mercado abierta
    When transcurre 1 minuto en la pagina
    Then el precio actual de "Negroni" debe cambiar con volatilidad y media reversion
    And el precio debe permanecer entre precioMinimo y precioMaximo (promedio * 2)

  Scenario: No bajar del precio minimo
    Given existe un cocktail "Martini" con precioActualBs 10 y precioMinimo 10
    And estoy en la pagina publica de mercado abierta
    When transcurren 10 minutos en la pagina
    Then el precio actual de "Martini" nunca debe bajar de 10 Bs

  Scenario: Comprar una unidad sube 1 Bs inmediatamente
    Given existe un cocktail "Daiquiri" con precioActualBs 18 y precioMinimo 10
    And estoy en el modal de compra de "Daiquiri"
    When ingreso cantidad 1
    And hago click en "Comprar"
    Then el precio actual de "Daiquiri" debe subir a 19 Bs inmediatamente
    And debo ver el mensaje "Compra ejecutada"

  Scenario: Comprar multiples unidades sube segun cantidad
    Given existe un cocktail "Old Fashioned" con precioActualBs 22 y precioMinimo 14
    And estoy en el modal de compra de "Old Fashioned"
    When ingreso cantidad 3
    And hago click en "Comprar"
    Then el precio actual de "Old Fashioned" debe subir a 25 Bs inmediatamente

  Scenario: Permitir compra en precio minimo
    Given existe un cocktail "Caipirinha" con precioActualBs 9 y precioMinimo 9
    And estoy en el modal de compra de "Caipirinha"
    When ingreso cantidad 2
    And hago click en "Comprar"
    Then la compra debe ejecutarse correctamente
    And el precio actual de "Caipirinha" debe subir a 11 Bs

  Scenario: Calcular total estimado antes de comprar
    Given existe un cocktail "Aperol Spritz" con precioActualBs 15 y precioMinimo 8
    And estoy en el modal de compra de "Aperol Spritz"
    When ingreso cantidad 4
    Then debo ver total estimado de 60 Bs

  Scenario: Persistir precio actual tras recargar
    Given existe un cocktail "Cosmopolitan" con precioActualBs 17 y precioMinimo 11
    And realizo una compra de cantidad 2 de "Cosmopolitan"
    When recargo la pagina
    Then el precio actual de "Cosmopolitan" debe mantenerse persistido

  Scenario: No aplicar decremento retroactivo al reabrir pagina
    Given existe un cocktail "Boulevardier" con precioActualBs 30 y precioMinimo 20
    And cierro la pagina por 5 minutos
    When vuelvo a abrir la pagina publica de mercado
    Then el precio actual de "Boulevardier" debe conservar el ultimo valor persistido
    And no debe descontarse tiempo cerrado retroactivamente

  Scenario: Rechazar compra con cantidad vacia
    Given existe un cocktail "Penicillin" con precioActualBs 21 y precioMinimo 12
    And estoy en el modal de compra de "Penicillin"
    When dejo cantidad vacia
    And hago click en "Comprar"
    Then debo ver un error de validacion de cantidad
    And no debe ejecutarse la compra

  Scenario: Rechazar compra con cantidad cero
    Given existe un cocktail "Margarita" con precioActualBs 19 y precioMinimo 10
    And estoy en el modal de compra de "Margarita"
    When ingreso cantidad 0
    And hago click en "Comprar"
    Then debo ver un error indicando que la cantidad debe ser mayor que cero
    And no debe ejecutarse la compra

  Scenario: Rechazar compra con cantidad negativa
    Given existe un cocktail "Manhattan" con precioActualBs 24 y precioMinimo 13
    And estoy en el modal de compra de "Manhattan"
    When ingreso cantidad -2
    And hago click en "Comprar"
    Then debo ver un error de cantidad invalida
    And no debe ejecutarse la compra

  Scenario: Rechazar compra con cantidad decimal si se exige entero
    Given existe un cocktail "Sidecar" con precioActualBs 16 y precioMinimo 9
    And estoy en el modal de compra de "Sidecar"
    When ingreso cantidad 1.5
    And hago click en "Comprar"
    Then debo ver un error indicando que la cantidad debe ser entera
    And no debe ejecutarse la compra

  Scenario: Color de precio en rojo cuando baja frente al inicial
    Given existe un cocktail "Gimlet" con precioPromedio 14 y precioActualBs 13
    When ingreso a la pagina publica de mercado
    Then el precio de "Gimlet" debe verse en rojo

  Scenario: Color de precio en verde cuando sube frente al inicial
    Given existe un cocktail "Whisky Sour" con precioPromedio 12 y precioActualBs 15
    When ingreso a la pagina publica de mercado
    Then el precio de "Whisky Sour" debe verse en verde

  Scenario: Cambio neutro se muestra con guion
    Given existe un cocktail "Mojito" con precioActualBs 25 y precioHace15Min 25
    When ingreso a la pagina publica de mercado
    Then el cambio de "Mojito" debe mostrarse como "—"

  Scenario: Cambio en 15 minutos muestra porcentaje y valor absoluto
    Given existe un cocktail "Negroni" con precioHace15Min 30 y precioActualBs 33
    When ingreso a la pagina publica de mercado
    Then debo ver el cambio de "Negroni" como "10%" y "+3 Bs"

  Scenario: Cambio porcentual se actualiza cada 15 minutos
    Given existe un cocktail "Negroni" con precioHace15Min 30 y precioActualBs 33
    And estoy en la pagina publica de mercado abierta
    When transcurren 15 minutos
    Then el valor de referencia "precioHace15Min" de "Negroni" debe actualizarse a 33

  Scenario: Mostrar sparkline en columna de precio
    Given existen cockteles cargados por admin
    When ingreso a la pagina publica de mercado
    Then cada fila debe mostrar un pequeno grafico sparkline en la columna de precio actual
    And el sparkline debe mostrar el historico de precios de los ultimos cambios

  Scenario: Simular volumen y operaciones cada minuto
    Given existe un cocktail "Tequila Shot" con precioActualBs 20
    And estoy en la pagina publica de mercado abierta
    When transcurren 5 minutos con actividad simulada
    Then la columna "Vol 15m" debe mostrar volumen acumulado
    And la columna "Vol 15m" debe mostrar contador de operaciones (N ops)

  Scenario: Rastrear historial de precios para sparkline
    Given existe un cocktail "Jagerbomb" con precioActualBs 25
    And estoy en la pagina publica de mercado abierta
    When transcurren 10 minutos con cambios de precio
    Then debo poder ver el historico de precios en el sparkline
    And el sparkline debe reflejar la volatilidad y media reversion observada

  Scenario: Actualizar ultimo tick cada minuto
    Given estoy en la pagina publica de mercado
    Then debo ver un texto que muestre "Ultimo tick: HH:MM:SS"
    When espero 1 minuto
    Then el texto de "Ultimo tick" debe actualizarse con la nueva hora
