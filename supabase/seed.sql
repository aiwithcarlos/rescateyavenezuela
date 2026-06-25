-- =============================================
-- DATOS DE EJEMPLO — Caracas, Venezuela
-- ~10 incidentes para demo post-terremoto
-- =============================================

INSERT INTO incidents (device_id, incident_type, description, latitude, longitude, status, volunteer_count) VALUES
('seed', 'personas_atrapadas', 'Familia atrapada en edificio derrumbado. 4 personas, 2 niños. Se escuchan voces. Calle Los Mangos con Av. Principal, Los Palos Grandes.', 10.4980, -66.8435, 'reportado', 3),
('seed', 'necesitan_herramientas', 'Edificio inclinado, vecinos tratan de sacar escombros. Necesitan palas y picos urgentemente. Urb. Altamira, Av. San Juan Bosco.', 10.5015, -66.8480, 'reportado', 5),
('seed', 'necesitan_maquinaria', 'Viga de concreto colapsada sobre vehículo. Posible persona atrapada debajo. Se necesita retroexcavadora. Chacao, Av. Venezuela.', 10.4940, -66.8530, 'ayuda_en_camino', 2),
('seed', 'movilidad_reducida', 'Señora de 78 años en 5to piso, edificio dañado. No puede bajar escaleras. Edificio Don Diego, Los Palos Grandes.', 10.4965, -66.8410, 'reportado', 1),
('seed', 'personas_atrapadas', 'Dos personas atrapadas en sótano de edificio colapsado. Se necesita equipo de corte. Sabana Grande, Av. Casanova.', 10.5050, -66.8620, 'escalado', 4),
('seed', 'necesitan_herramientas', 'Grupo de 15 voluntarios removiendo escombros. Faltan herramientas: palas, carretillas, guantes. El Bosque, Calle Villaflor.', 10.5100, -66.8650, 'reportado', 0),
('seed', 'necesitan_maquinaria', 'Losa de entrepiso colapsada. Posibles personas atrapadas entre losa y segundo nivel. Se necesita grúa. Colinas de Bello Monte.', 10.4870, -66.8590, 'ayuda_en_camino', 1),
('seed', 'movilidad_reducida', 'Hombre en silla de ruedas, 4to piso, sin ascensor, escaleras inestables. Edificio Parque Cristal, Los Palos Grandes.', 10.4995, -66.8455, 'reportado', 2),
('seed', 'personas_atrapadas', 'Posible persona atrapada en estructura colapsada. Se necesita perro de búsqueda o equipo de sonido. La Castellana, Av. Principal.', 10.5030, -66.8510, 'reportado', 0),
('seed', 'necesitan_herramientas', 'Derrumbe parcial de casa familiar. Familia de 5 necesita ayuda para sacar pertenencias y revisar estructura. San Bernardino, Av. Páez.', 10.5180, -66.8710, 'reportado', 3);
