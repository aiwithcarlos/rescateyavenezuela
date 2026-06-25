-- =============================================
-- ESQUEMA: App de Rescate Post-Terremoto Venezuela
-- Ejecutar en SQL Editor de Supabase
-- =============================================

-- =============================================
-- ENUM TYPES
-- =============================================
CREATE TYPE incident_type AS ENUM (
  'personas_atrapadas',
  'necesitan_herramientas',
  'necesitan_maquinaria',
  'movilidad_reducida'
);

CREATE TYPE incident_status AS ENUM (
  'reportado',
  'ayuda_en_camino',
  'resuelto',
  'escalado'
);

CREATE TYPE volunteer_status AS ENUM (
  'en_camino',
  'llego_al_lugar',
  'cancelado'
);

CREATE TYPE ability_type AS ENUM (
  'brazos',
  'pala_herramientas',
  'vehiculo',
  'maquinaria'
);

-- =============================================
-- TABLA: incidents
-- =============================================
CREATE TABLE incidents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ,
  escalated_at  TIMESTAMPTZ,

  device_id     TEXT NOT NULL,

  reporter_name  TEXT,
  reporter_phone TEXT,

  incident_type incident_type NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  photo_url     TEXT,

  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  address       TEXT,

  status        incident_status NOT NULL DEFAULT 'reportado',

  volunteer_count INTEGER NOT NULL DEFAULT 0,
  max_volunteers  INTEGER NOT NULL DEFAULT 50,

  escalated_notes TEXT
);

CREATE INDEX idx_incidents_location ON incidents (latitude, longitude);
CREATE INDEX idx_incidents_status ON incidents (status);
CREATE INDEX idx_incidents_type ON incidents (incident_type);
CREATE INDEX idx_incidents_created ON incidents (created_at DESC);

-- =============================================
-- TABLA: volunteers
-- =============================================
CREATE TABLE volunteers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  arrived_at    TIMESTAMPTZ,

  incident_id   UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  device_id     TEXT NOT NULL,
  display_name  TEXT,
  abilities     ability_type[] NOT NULL DEFAULT '{}',
  status        volunteer_status NOT NULL DEFAULT 'en_camino',

  UNIQUE(incident_id, device_id)
);

CREATE INDEX idx_volunteers_incident ON volunteers (incident_id);
CREATE INDEX idx_volunteers_device ON volunteers (device_id);

-- =============================================
-- TRIGGER: actualizar volunteer_count
-- =============================================
CREATE OR REPLACE FUNCTION update_volunteer_count()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT: contar voluntarios activos (en_camino o llego_al_lugar)
  IF TG_OP = 'INSERT' AND NEW.status IN ('en_camino', 'llego_al_lugar') THEN
    UPDATE incidents
    SET volunteer_count = volunteer_count + 1,
        updated_at = NOW(),
        status = CASE
          WHEN status = 'reportado' THEN 'ayuda_en_camino'::incident_status
          ELSE status
        END
    WHERE id = NEW.incident_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Solo cancelado deja de contar. en_camino y llego_al_lugar ambos cuentan.
    -- Caso: dejar de contar (→ cancelado)
    IF OLD.status IN ('en_camino', 'llego_al_lugar') AND NEW.status = 'cancelado' THEN
      UPDATE incidents
      SET volunteer_count = GREATEST(volunteer_count - 1, 0),
          updated_at = NOW()
      WHERE id = NEW.incident_id;
    -- Caso: volver a contar (cancelado → activo)
    ELSIF OLD.status = 'cancelado' AND NEW.status IN ('en_camino', 'llego_al_lugar') THEN
      UPDATE incidents
      SET volunteer_count = volunteer_count + 1,
          updated_at = NOW()
      WHERE id = NEW.incident_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_volunteer_count ON volunteers;
CREATE TRIGGER trigger_update_volunteer_count
AFTER INSERT OR UPDATE ON volunteers
FOR EACH ROW
EXECUTE FUNCTION update_volunteer_count();

-- =============================================
-- ROW LEVEL SECURITY (abierto para MVP)
-- =============================================
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read incidents"
  ON incidents FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create incidents"
  ON incidents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update incidents"
  ON incidents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read volunteers"
  ON volunteers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create volunteers"
  ON volunteers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update volunteers"
  ON volunteers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =============================================
-- MIGRACIÓN: nuevos campos (si la tabla ya existe)
-- =============================================
-- ALTER TABLE incidents ADD COLUMN reporter_name TEXT;
-- ALTER TABLE incidents ADD COLUMN reporter_phone TEXT;

-- =============================================
-- HABILITAR REALTIME (ejecutar después)
-- =============================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
-- ALTER PUBLICATION supabase_realtime ADD TABLE volunteers;
