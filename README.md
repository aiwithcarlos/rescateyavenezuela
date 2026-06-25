# RescateYA Venezuela 🆘

**Mapa de incidentes activos para coordinar rescates tras el terremoto del 24 de junio de 2026 en Venezuela.**

Aplicación web que conecta personas que necesitan ayuda con voluntarios que pueden llegar físicamente en minutos. Convierte el grito de auxilio en una señal geolocalizada que cualquiera puede ver. Dominio: [rescateyavenezuela.com](https://rescateyavenezuela.com).

---

## 🚀 ¿Cómo funciona?

### Para reportar un incidente
1. Abre la app → Toca **"Reportar"**
2. Selecciona el tipo de ayuda necesaria
3. Describe la situación y añade una foto
4. El pin aparece en el mapa en segundos

### Para ayudar como voluntario
1. Ve el mapa con los pins activos cerca de ti
2. Filtra por lo que puedes ofrecer (palas, vehículo, maquinaria, brazos)
3. Toca un pin → ve detalles y cuántas personas van
4. Marca **"Voy para allá"** y actualiza tu estado al llegar

### Ciclo de vida de un incidente
```
Reportado → Ayuda en camino → Resuelto / Derivado a Protección Civil
```

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS 3 |
| Mapas | Leaflet + OpenStreetMap |
| Base de datos | Supabase (PostgreSQL + Realtime + Storage) |
| Hosting | Vercel |

---

## 📋 Requisitos previos

- Node.js 20+
- Cuenta gratuita en [Supabase](https://supabase.com)
- Cuenta gratuita en [GitHub](https://github.com)
- Cuenta gratuita en [Vercel](https://vercel.com)

---

## ⚡ Configuración rápida

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/rescateyavenezuela.git
cd rescateyavenezuela
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta `supabase/schema.sql`
3. Ejecuta `supabase/seed.sql` para datos de ejemplo de Caracas
4. Ve a **Database > Replication** y habilita las tablas `incidents` y `volunteers`
5. Ve a **Storage** y crea un bucket público llamado `incident-photos`
6. Copia la URL y la anon key desde **Settings > API**

### 3. Configurar variables de entorno

Edita `.env.local` con tus credenciales:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Deploy a Vercel

1. Sube el repo a GitHub
2. Importa el repo en [vercel.com](https://vercel.com)
3. Agrega las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. ¡Deploy automático!

---

## 📁 Estructura del proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (serverless)
│   │   ├── incidents/      # CRUD de incidentes
│   │   ├── volunteers/     # CRUD de voluntarios
│   │   └── upload/         # Subida de fotos
│   ├── report/             # Página de reporte
│   ├── incident/[id]/      # Página de detalle
│   ├── layout.tsx          # Layout raíz + providers
│   └── page.tsx            # Home (mapa + lista)
├── components/
│   ├── map/                # IncidentMap, markers
│   ├── incident/           # Cards, formulario, escalar
│   ├── volunteer/          # Botones, contador, lista
│   ├── ui/                 # FAB, BottomSheet, Modal, etc.
│   ├── filters/            # Filtro de tipo, distancia
│   └── layout/             # Header
├── hooks/                  # useGeolocation, useIncidents, etc.
├── lib/                    # supabase client, constants, utils
├── types/                  # TypeScript interfaces
└── providers/              # AppProvider (Context global)
```

---

## 🎯 Características del MVP

- ✅ Mapa de incidentes en tiempo real con Leaflet/OSM
- ✅ Reporte de incidentes con GPS, tipo, descripción y foto
- ✅ Flujo de voluntarios: "Voy para allá" → "Llegué al lugar"
- ✅ Contador de voluntarios para evitar sobre-concentración
- ✅ Escalamiento a Protección Civil con un botón
- ✅ Diseño mobile-first optimizado para emergencias
- ✅ Sin registro: uso anónimo con device ID
- ✅ Tiempo real vía Supabase Realtime
- ✅ Caché y polling fallback para redes inestables
- ✅ Totalmente en español

---

## 🔒 Seguridad

- Row-Level Security en Supabase (políticas abiertas para MVP)
- Sin datos personales (solo device_id anónimo)
- HTTPS forzado por Vercel
- Rate limiting por IP en Supabase

---

## 📄 Licencia

MIT — Usa este código libremente para ayudar a Venezuela.

---

🤖 Desarrollado con [Claude Code](https://claude.ai/code)
