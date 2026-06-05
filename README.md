# Tienda WhatsApp Pro

Plantilla premium de e-commerce en Next.js, TypeScript y Tailwind CSS 3.4, pensada para vender por WhatsApp con una experiencia moderna, rápida y 100% responsive.

## Qué incluye

- Home premium con hero, categorías, productos destacados y oferta especial.
- Catálogo con búsqueda, filtros por categoría y control por precio.
- Carrito lateral y página de carrito dedicada.
- Checkout sin pasarela: genera un mensaje de WhatsApp con el pedido completo.
- Login seguro por roles con sesión HttpOnly.
- Panel de personalización en `/admin` para editar tienda, productos, categorías, logo, número de WhatsApp y plantilla del mensaje.
- Persistencia local con SQLite vía Prisma, con exportación e importación de backup JSON.
- API de health y productos en `/api/health` y `/api/products`.

## Roles

- `user`: solo puede ver la tienda y comprar.
- `ceo`: puede gestionar productos, categorías, variantes y ofertas.
- `admin`: puede modificar toda la tienda, incluyendo configuración global.

## Credenciales demo

- `user@demo.com` / `User123!`
- `ceo@demo.com` / `Ceo123!`
- `admin@demo.com` / `Admin123!`

## Personalización rápida

1. Abre `/login` e inicia sesión con el rol que quieras usar.
2. Abre `/admin`.
3. Cambia nombre de la tienda, logo, número de WhatsApp y mensaje base si eres admin.
4. Edita productos, ofertas, badges, categorías y variantes.
5. Exporta el backup JSON si quieres mover la configuración a otro navegador o guardar una copia.

## Variables del mensaje de WhatsApp

En la plantilla del mensaje puedes usar:

- `{name}`
- `{phone}`
- `{address}`
- `{items}`
- `{total}`
- `{storeName}`

## Desarrollo local

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Luego abre http://localhost:3000.

La base local usa `file:./prisma/dev.db`. Cuando publiques, puedes cambiar `DATABASE_URL` y el `provider` de Prisma a una BD de nube.

## Producción

```bash
npm run build
npm start
```

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Importa el repo en Vercel.
3. Deja el preset de Next.js por defecto.
4. Usa `npm run build` como build command.
5. Publica.

## Estructura editable

- `data/config.json` contiene nombre, logo, WhatsApp, colores, usuarios demo y plantilla del mensaje.
- `data/products.json` contiene el catálogo base.
- `/admin` permite editar la tienda desde una vista visual.
