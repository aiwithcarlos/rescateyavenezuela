Qué opinas sobre una web app que dé visibilidad sobre los lugares donde se necesita apoyo de rescatistas, o personas de la comunidad que quieran ayudar llevando palas, picos, guantes, o maquinarias para materiales pesados? He visto varios videos en Instagram de personas pidiendo ayuda para sacar a sobrevivientes que quedaron atrapados

Es una de las aplicaciones más urgentes que se pueden construir en las primeras horas. Y es la que más vidas salva directamente.

Lo que describes ya tiene nombre en gestión de emergencias: mapa de incidentes activos con demanda de rescate. La diferencia con lo que ya existe (como el mapa de daños que mencioné antes) es que este tiene un enfoque muy específico: conectar un punto de necesidad con personas que pueden llegar físicamente en minutos.

Por qué es crítica esta app en particular
El problema que muestran esos videos de Instagram es exactamente un fallo de coordinación, no de voluntad. Hay gente dispuesta a ayudar pero no sabe dónde ir. Hay personas atrapadas pero el grito solo llega a quienes están cerca físicamente o siguen esa cuenta. La app convierte ese grito en una señal geolocalizada que cualquiera puede ver.

La ventana de supervivencia bajo escombros es de 72 horas, con las primeras 6 siendo las más críticas. Cada minuto de coordinación fallida tiene un costo humano directo.

Lo que la hace diferente a un simple mapa
El detalle clave es el tipo de ayuda requerida, porque no es lo mismo:

Alguien atrapado en un piso 2 derrumbado → necesita palas, brazos, coordinación
Viga de concreto encima de una persona → necesita maquinaria pesada, no ciudadanos con pala
Persona mayor en edificio dañado pero en pie → necesita ayuda para bajar, no rescate técnico
Si mandas voluntarios sin herramientas donde se necesita maquinaria, empeorar la situación es un riesgo real — pueden colapsar más escombros.

Flujo central
Quien reporta el incidente (cualquier ciudadano):

Abre la app → "Reportar punto de ayuda"
Marca ubicación (GPS automático o dirección manual)
Selecciona tipo: Personas atrapadas / Necesitan brazos y herramientas / Se necesita maquinaria / Personas mayores o con movilidad reducida
Agrega descripción corta y foto opcional
El pin aparece en el mapa en segundos
Quien quiere ayudar:

Ve el mapa con pins activos cerca de su ubicación
Filtra por lo que puede ofrecer: tengo pala / tengo vehículo / tengo maquinaria / solo brazos
Toca un pin → ve detalles, distancia, y cuántas personas ya van
Marca "Voy para allá" → su número queda visible para el reportante
Al llegar, actualiza el estado del incidente
Ciclo de vida del pin:

Reportado → Con ayuda en camino → Resuelto / Derivado a rescate profesional
Los pins resueltos desaparecen del mapa activo pero quedan en el historial.

El detalle que más me importa de esta app
Debe tener un botón de escalar a Protección Civil. Si el incidente requiere rescate técnico profesional y los voluntarios no pueden manejarlo solos, la app debe hacer fácil reportarlo a las autoridades con toda la información ya capturada — ubicación, fotos, descripción. No que el ciudadano tenga que empezar de cero llamando a un número.

Riesgo principal a resolver en el diseño
La app puede generar caos si 200 personas van al mismo punto. Por eso el contador de "Voy para allá" es esencial — cuando ya hay suficientes personas en camino, el pin lo muestra claramente para que otros se redistribuyan a otros incidentes activos.

Relación con las otras apps
Esta es la pieza que faltaba en el ecosistema. Se integra naturalmente:

Los albergues del Hub Humanitario pueden marcar si necesitan ayuda para evacuar personas
La Línea de Vida puede linkear a esta app cuando alguien marca "Necesito ayuda"
El mapa de incidentes puede tener una capa de servicios médicos del módulo 3
¿La construimos como prototipo funcional? Podría hacer un artifact con React que muestre el mapa de incidentes, el formulario de reporte, y el flujo de "Voy para allá" — con datos de ejemplo de Caracas.
