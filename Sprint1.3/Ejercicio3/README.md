# Party Finder - Creación de Parties mediante API

Este apartado demuestra la creación de parties mediante la API de **Party Finder**.

## Requerimientos Funcionales

### Formulario de Creación de Party

El formulario debe permitir la creación de parties con los siguientes campos:

- **Party Size (enum)**: Tamaño de la party. Valores permitidos: `3`, `5`, `8`.
- **Creator ID (string)**: ID del miembro creador de la party. Debe existir en la tabla `guildmembers`.
- **Level Cap (integer)**: Nivel mínimo permitido en la party.
- **Item Level Cap (ilvl_cap) (integer)**: Nivel de ítem mínimo permitido en la party.
- **Party Role (enum)**: Rol del creador en la party. Valores: `TANK`, `HEALER`, `DAMAGE`, `SUPPORT`.
- **Planned Start (string)**: Fecha y hora planeadas para el inicio de la party en formato `DD/MM/YYYY_HH:mm`.

#### Validaciones del Formulario

- Todos los campos obligatorios deben estar completos.
- El campo **Planned Start** debe tener formato `DD/MM/YYYY_HH:mm` y ser una fecha futura.
- Los campos **Level Cap** y **Item Level Cap** deben ser enteros positivos.
- El **Creator ID** debe ser un identificador válido existente en `guildmembers`.

## Interacciones con la API

- Al enviar el formulario, se realizará una solicitud a la API indicada en el YML para crear la party.
- Si la solicitud es exitosa, la party se mostrará en la lista de parties de la interfaz de usuario.

## Pruebas a Realizar

### Prueba 1: Crear una Party Correctamente

- Llena todos los campos con datos válidos, incluyendo un **Planned Start** con fecha futura.
- Asegúrate que el **Creator ID** exista en la tabla `guildmembers`.
- Envía el formulario.
- **Resultado esperado**: La party se crea correctamente y aparece en la lista de parties.

### Prueba 2: Validación de Campos Vacíos

- Intenta enviar el formulario dejando campos obligatorios vacíos.
- **Resultado esperado**: El sistema bloquea la creación y muestra un mensaje de error indicando que los campos son obligatorios.

### Prueba 3: Validación de Fecha Inválida

- Ingresa una fecha en el pasado en **Planned Start**.
- **Resultado esperado**: El sistema bloquea la creación y muestra un mensaje de error indicando que la fecha y hora deben ser futuras.

### Prueba 4: Validación de Números Negativos en Caps

- Ingresa números negativos o cero en **Level Cap** o **Item Level Cap**.
- **Resultado esperado**: El sistema bloquea la creación y muestra un mensaje de error indicando que los valores deben ser positivos.

### Prueba 5: Comportamiento del Formulario

- Abre el formulario, ingresa datos parciales y ciérralo sin enviar.
- Reabre el formulario.
- **Resultado esperado**: Los campos deben estar vacíos al reabrir el formulario.
