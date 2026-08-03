# Contexto del Proyecto - Sistema de Inventarios

## Informacion General

| Campo | Valor |
|-------|-------|
| **Nombre** | inventarios |
| **Version** | 0.1.0 |
| **Framework** | Next.js 16.2.10 |
| **React** | 19.2.4 |
| **TypeScript** | ^5 |
| **ORM** | Prisma 7.8.0 |
| **Base de Datos** | PostgreSQL (Neon) |
| **Estilos** | Tailwind CSS 4 |

---

## Dependencias Instaladas

### Production
```json
{
  "@prisma/client": "^7.8.0",
  "next": "16.2.10",
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

### Development
```json
{
  "@prisma/nextjs-monorepo-workaround-plugin": "^7.8.0",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "dotenv": "^17.4.2",
  "eslint": "^9",
  "eslint-config-next": "16.2.10",
  "prisma": "^7.8.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## Base de Datos

### Conexion
- **Proveedor**: Neon PostgreSQL
- **Host**: `ep-weathered-silence-ac3w22zf-pooler.sa-east-1.aws.neon.tech`
- **Base de datos**: `neondb`
- **SSL**: Requerido

### Schema Actual (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model productos {
  id            Int          @id @default(autoincrement())
  nombre        String       @db.VarChar(255)
  precio        Float
  stock         Int
  categoria_id  Int
  proveedor_id  Int
  categoria     categorias   @relation(fields: [categoria_id], references: [id])
  proveedor     proveedores  @relation(fields: [proveedor_id], references: [id])
}

model categorias {
  id        Int         @id @default(autoincrement())
  nombre    String      @db.VarChar(255)
  productos productos[]
}

model proveedores {
  id        Int         @id @default(autoincrement())
  nombre    String      @db.VarChar(255)
  ruc       String      @db.VarChar(11)
  email     String      @db.VarChar(255)
  productos productos[]
}
```

### Relaciones

```
categorias (1) ----< (many) productos
proveedores (1) ----< (many) productos
```

### Migraciones Aplicadas

| Fecha | Nombre | Descripcion |
|-------|--------|-------------|
| 2026-07-16 | `init` | Migracion inicial (tablas eliminadas) |
| 2026-07-16 | `create_productos_table` | Tabla productos simple |
| 2026-07-16 | `create_categorias_proveedores` | Tablas categorias, proveedores + relaciones |

---

## Archivos de Configuracion

### `prisma.config.ts`
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### `next.config.ts`
```typescript
import type { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...(config.plugins || []), new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
```

---

## Comandos Utiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Prisma
npx prisma studio        # GUI para ver/editar datos
npx prisma migrate dev   # Aplicar cambios de schema
npx prisma generate      # Regenerar cliente Prisma
npx prisma db push       # Sincronizar sin crear migracion
npx prisma db seed       # Ejecutar seed data

# Produccion
npm run build            # Construir para produccion
npm start                # Iniciar servidor produccion
```

---

## Estructura de Directorios

```
inventarios/
├── app/
│   ├── generated/
│   │   └── prisma/        # Cliente Prisma generado
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── prisma/
│   ├── migrations/        # Historial de migraciones
│   └── schema.prisma      # Schema de base de datos
├── public/
├── .env                   # Variables de entorno
├── next.config.ts         # Configuracion Next.js
├── package.json
├── prisma.config.ts       # Configuracion Prisma v7
└── tsconfig.json
```

---

## Notas Importantes

### Prisma v7 (Novedades)
- Usa `prisma.config.ts` en lugar de URL en `schema.prisma`
- Generator provider es `"prisma-client"` (no `"prisma-client-js"`)
- Requiere `dotenv` para variables de entorno

### Proximo Paso
- Crear APIs REST para CRUD de productos, categorias y proveedores
- Usar Route Handlers en `app/api/`
