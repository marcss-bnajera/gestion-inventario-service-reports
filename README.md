# Service B - Alertas y Reportes

API REST para la generacion de alertas e indicadores del inventario. Consume el Servicio A via HTTP para procesar datos y generar reportes.

## Tecnologias

- Node.js + Express 5
- MongoDB (Mongoose)
- JWT (autenticacion)
- Axios (comunicacion inter-servicios)

## Requisitos

- Node.js 18+
- MongoDB corriendo en puerto 27018
- Servicio A corriendo en puerto 3001
- Servicio de Auth corriendo para generar tokens JWT

## Instalacion

```bash
cd gestion-inventario-service-reports
npm install
```

## Configuracion

Copiar el archivo `.env.example` a `.env` y configurar las variables:

```bash
cp .env.example .env
```

Variables de entorno requeridas:

| Variable | Descripcion | Puerto |
|----------|-------------|--------|
| PORT | Puerto del servicio | 3005 |
| URI_MONGODB | URI de conexion a MongoDB | mongodb://localhost:27018/gestionInventario |
| INVENTORY_SERVICE_URL | URL base del Servicio A | http://localhost:3001/gestionInventario/v1 |
| JWT_SECRET | Secreto JWT (debe coincidir con Auth) | - |

## Ejecucion

```bash
# Produccion
npm start

# Desarrollo
npm run dev
```

## Endpoints

Base URL: `http://localhost:3005/gestionInventario/v1`

Todos los endpoints requieren header `Authorization: Bearer <token>`.

### Health Check

```
GET /health
```

### Alertas

```
GET /alerts/low-stock          # Productos con stock bajo (<= minStock o threshold)
GET /alerts/out-of-stock       # Productos agotados (stock = 0)
```

Query params:
- `threshold` (opcional): Umbral personalizado para stock bajo (default: 5)

### Reportes

```
GET /reports/top-products      # Productos mas vendidos
GET /reports/categories        # Resumen por categoria
GET /reports/summary           # Resumen general del inventario
```

Query params:
- `limit` (opcional): Limite de resultados en top-products (default: 10, max: 10000)

## Ejemplo de respuesta

```json
{
    "success": true,
    "data": {
        "totalProducts": 45,
        "totalCategories": 8,
        "totalStock": 320,
        "totalValue": 125000,
        "outOfStock": 3,
        "lowStock": 7,
        "averageStockPerProduct": 7
    },
    "message": "Resumen general del inventario",
    "reportType": "summary"
}
```
