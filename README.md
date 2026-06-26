# Gastos Familiares

Proyecto web creado como parte de mi proceso de aprendizaje en desarrollo Frontend y Full Stack.

## Avance del dia 1

En el primer dia se inicio el proyecto desde cero, creando la primera estructura HTML y configurando el control de versiones con Git.

Durante este dia se realizo:

- Creacion del archivo `index.html`.
- Escritura de la primera linea HTML: `<!DOCTYPE html>`.
- Creacion de la etiqueta raiz `<html lang="es">`.
- Agregado de la seccion `<head>`.
- Agregado del titulo del documento con `<title>`.
- Agregado de la seccion visible `<body>`.
- Agregado del primer titulo visible con `<h1>`.
- Inicializacion del repositorio con Git.
- Primeros commits locales para registrar cada avance.
- Conexion del proyecto local con GitHub.
- Primera publicacion del repositorio remoto.

## Avance del dia 2

Durante el segundo dia se mejoro la estructura base del documento HTML y se agrego documentacion inicial del proyecto.

Durante este dia se realizo:

- Normalizacion de etiquetas HTML.
- Agregado de etiquetas semanticas como `header`, `main`, `section` y `footer`.
- Configuracion de caracteres con `UTF-8`.
- Configuracion inicial para dispositivos moviles con `viewport`.
- Creacion del archivo `README.md`.
- Publicacion de los avances en GitHub.

## Avance del dia 3

Durante el tercer dia se comenzo a orientar la estructura HTML hacia las funcionalidades reales del proyecto.

Durante este dia se realizo:

- Creacion de una seccion para ingresos familiares.
- Creacion de una seccion para gastos mensuales.
- Creacion de una seccion para deudas pendientes.
- Separacion inicial del proyecto por areas funcionales.

## Avance del dia 4

Durante el cuarto dia se agregaron datos iniciales a las secciones principales del proyecto.

Durante este dia se realizo:

- Agregado de una lista inicial de ingresos familiares.
- Agregado de una lista inicial de gastos mensuales.
- Agregado de una lista inicial de deudas pendientes.
- Practica de etiquetas `ul` y `li` para representar datos agrupados.
- Revision de etiquetas anidadas correctamente.

## Avance del dia 5

Durante el quinto dia se comenzo a preparar el proyecto para trabajar con herramientas modernas de Frontend.

Durante este dia se realizo:

- Creacion de la carpeta `css`.
- Creacion del archivo `css/styles.css`.
- Conexion de una hoja de estilos externa desde `index.html`.
- Creacion de la carpeta `js`.
- Creacion del archivo `js/app.js`.
- Conexion de JavaScript desde `index.html`.
- Primera prueba de JavaScript usando `console.log`.
- Primeros estilos visuales para que la pagina deje de verse como HTML plano.

## Avance del dia 6

Durante el sexto dia se mejoro la estructura visual del proyecto usando CSS moderno.

Durante este dia se realizo:

- Agregado de clases HTML para preparar estilos reutilizables.
- Creacion de un layout de tarjetas para las secciones principales.
- Uso inicial de CSS Grid.
- Creacion de una grilla responsive con `auto-fit` y `minmax`.
- Mejora visual de las listas usando `::marker`.
- Separacion mas clara entre estructura HTML y presentacion visual con CSS.

## Avance del dia 7

Durante el septimo dia se paso de tener datos estaticos en HTML a generarlos dinamicamente desde JavaScript.

Durante este dia se realizo:

- Creacion de arrays con objetos para representar ingresos y gastos.
- Uso de `document.getElementById()` para seleccionar elementos del DOM.
- Creacion de elementos `<li>` con `document.createElement()`.
- Insercion de elementos en el DOM con `appendChild()`.
- Renderizado dinamico de listas de ingresos y gastos desde JavaScript.
- Mostrar el total de gastos calculado desde el array.
- Primer contacto con la separacion entre datos (JS) y presentacion (HTML).

## Avance del dia 8

Durante el octavo dia se agrego el calculo y la visualizacion del balance financiero.

Durante este dia se realizo:

- Calculo del total de ingresos usando un bucle `for...of`.
- Calculo del balance como la diferencia entre ingresos y gastos.
- Visualizacion del balance en el DOM con formato de moneda chilena (`toLocaleString("es-CL")`).
- Estilos condicionales segun el valor del balance: positivo (verde), negativo (rojo) o cero (gris).
- Uso de `className` para cambiar la clase CSS desde JavaScript.

## Avance del dia 9

Durante el noveno dia se completo la representacion de datos transformando las deudas a objetos y mostrando sus totales.

Durante este dia se realizo:

- Conversion de la lista de deudas a un array de objetos con propiedades `nombre`, `monto` y `estado`.
- Calculo del total de deudas usando un bucle `for...of`.
- Renderizado de las deudas en el DOM incluyendo el estado de cada una (Al dia, Pagando, Atrasado).
- Visualizacion del total de deudas debajo de la lista.

## Avance del dia 10

Durante el decimo dia se agrego interactividad a las listas con botones para eliminar elementos y se refactorizo el codigo para hacerlo reutilizable.

Durante este dia se realizo:

- Creacion de la funcion `renderAll()` que centraliza todo el calculo y renderizado del proyecto.
- Uso de `innerHTML = ""` para limpiar las listas antes de volver a pintarlas.
- Cambio de `for...of` a `for` con indice (`for let i = 0; i < array.length; i++`) para conocer la posicion de cada elemento.
- Creacion de botones "Eliminar" desde JavaScript con `createElement()` y `textContent`.
- Uso de `addEventListener("click", function() {...})` para detectar clics en los botones.
- Eliminacion de elementos del array con `splice(i, 1)` al hacer clic en "Eliminar".
- Llamada a `renderAll()` dentro del evento para refrescar la pantalla automaticamente.
- Estilos visuales para el boton Eliminar (color rojo, esquinas redondeadas, efecto hover).

## Objetivo

Construir una aplicacion para organizar ingresos, gastos y deudas familiares, aprendiendo paso a paso HTML, CSS, JavaScript, Git, GitHub y tecnologias Full Stack.

## Estado actual

Dia 10 de aprendizaje.

Actualmente el proyecto tiene:

- estructura HTML semantica,
- configuracion basica para caracteres,
- configuracion responsive inicial,
- secciones para ingresos, gastos y deudas,
- datos financieros representados como arrays de objetos en JavaScript,
- hoja de estilos externa,
- archivo JavaScript con logica completa conectado,
- layout visual con tarjetas,
- grilla responsive con CSS Grid,
- renderizado dinamico de listas desde JavaScript,
- calculo automatico de totales y balance financiero,
- colores de balance segun estado (positivo, negativo, cero),
- botones "Eliminar" en cada elemento de las listas,
- funcion centralizada `renderAll()` que refresca todo automaticamente.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Git
- GitHub

## Proximos pasos

- Agregar formularios para añadir nuevos ingresos, gastos y deudas desde la interfaz.
- Guardar los datos en localStorage para que persistan al recargar la pagina.
- Agregar confirmacion antes de eliminar elementos.
- Mejorar la apariencia general de la aplicacion con mas estilos visuales.
- Agregar una seccion de historial o registro de cambios.