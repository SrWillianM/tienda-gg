# Despliegue y Migración de Base de Datos

## Opciones recomendadas para poner la web en internet

### 1. Opción más fácil: SQLite + VPS / Coolify / CapRover (recomendado para ti)
- Sube el proyecto completo.
- Monta un volumen persistente en `/app/prisma` y `/app/public/uploads`.
- Usa `DATABASE_URL="file:./prisma/dev.db"`
- Corre `npm run prisma:generate && npm run db:push`
- Imágenes se guardan en disco (volumen).

### 2. Opción moderna serverless: PostgreSQL + Vercel / Railway / Fly.io
1. Crea una DB Postgres (Neon.tech gratis, Supabase, Railway).
2. Copia la connection string → ponla en `DATABASE_URL`.
3. Cambia en `prisma/schema.prisma` el provider a `postgresql` (o déjalo y Prisma lo detecta).
4. `npx prisma generate && npx prisma db push`
5. **IMÁGENES**: El `/api/upload` guarda en disco (no funciona bien en Vercel serverless). 
   - Opción recomendada: integra Uploadthing, Cloudinary o Vercel Blob.
   - O usa un pequeño servicio en Railway separado para uploads.

### 3. Migrar datos actuales
- Usa el botón "Exportar JSON" en el panel admin.
- En nuevo entorno importa el JSON.
- O corre seed: `npm run db:seed`

## Imágenes
- Ahora se guardan en `public/uploads/products/`
- **Nunca** se guardan como base64 en la base de datos (eso rompía todo).
- En producción siempre usa almacenamiento externo si usas serverless.

## Comandos útiles
```bash
npm run dev
npm run build
npm run prisma:studio     # ver datos
npm run db:push           # aplicar schema
```

## Roles
- admin: todo (config + productos)
- ceo: solo productos y categorías
- user: solo ver y comprar

Los cambios entre usuarios con rol se sincronizan cada 22 segundos automáticamente en el panel.
