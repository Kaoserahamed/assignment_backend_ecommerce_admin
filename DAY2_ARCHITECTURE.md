# Day 2 Architecture: Service Boundaries, Database Schema, API Contracts

## Repository
`assignment_backend_ecommerce_admin` — E-Commerce Admin Dashboard (NestJS + React + PostgreSQL + Prisma)

## Proposed Concept
Full-featured e-commerce admin platform with inventory forecasting, multi-warehouse management, order routing, vendor marketplace, and analytics dashboard.

## Service Boundaries
| Service | Responsibility | Technology |
|---------|---------------|------------|
| Product Service | Product CRUD, variants, attributes, categories, brands | NestJS, Prisma, PostgreSQL |
| Order Service | Order lifecycle, payment status, fulfillment, returns | NestJS, Prisma, PostgreSQL |
| Inventory Service | Stock levels, reservations, locations, reorder points, transfers | NestJS, Prisma, PostgreSQL |
| Vendor Service | Vendor profiles, onboarding, commissions, marketplace | NestJS, Prisma, PostgreSQL |
| Analytics Service | Sales reports, inventory forecasting, demand planning | NestJS, PostgreSQL, read models |
| Auth Service | RBAC, JWT, permissions (44), roles, users | NestJS, Prisma, PostgreSQL |

## Database Schema (PostgreSQL)
- `users` — id, email, password_hash, role_id, is_active, created_at
- `roles` — id, name, permissions (44: dashboard/permission/role/user/media/category/brand/attribute/product watch/create/read/update/delete)
- `permissions` — id, name, group, action
- `products` — id, sku, name, description, price, cost, category_id, brand_id, status, created_at
- `product_variants` — id, product_id, attribute_values, sku, sale_price, stock, is_thumbnail
- `product_attributes` — id, name, type (5 types), values
- `categories` — id, name, slug, parent_id (tree, cycle prevention), seo_slug
- `brands` — id, name, logo_id, created_at
- `media` — id, filename, url, mime_type, size, metadata, uploaded_at
- `warehouses` — id, name, location, zones, bin_locations, created_at
- `inventory_items` — id, product_id, warehouse_id, quantity, reserved, reorder_point, location
- `stock_movements` — id, inventory_item_id, type (receipt/sale/adjustment/transfer), quantity, reference_id, created_at
- `stock_transfers` — id, from_warehouse, to_warehouse, status, items, created_at, completed_at
- `purchase_orders` — id, vendor_id, status, items, total, created_at, received_at
- `orders` — id, customer_id, status, payment_status, fulfillment_status, total, created_at
- `order_items` — id, order_id, product_variant_id, quantity, price
- `vendors` — id, name, contact_info, commission_rate, performance_rating, created_at
- `vendor_products` — id, vendor_id, product_id, listed_at
- `reorder_suggestions` — id, product_id, warehouse_id, suggested_quantity, reason, created_at
- `demand_forecasts` — id, product_id, warehouse_id, period, predicted_demand, confidence, created_at

## API Contracts
### Authentication
- `POST /auth/login` → {accessToken, refreshToken}
- `POST /auth/refresh` → {accessToken}
- `POST /auth/logout` → 204
- `GET /auth/session` → {user, permissions}

### Permissions (10 endpoints)
- `GET/POST/PUT/DELETE /permissions` — CRUD
- `GET/POST/PUT/DELETE /permissions/groups` — groups

### Roles (7 endpoints)
- `GET/POST/PUT/DELETE /roles` — CRUD
- `POST /roles/{id}/permissions` — assign
- `GET /roles/{id}/permissions` — list

### Users (5 endpoints)
- `GET/POST/GET/PUT/DELETE /users` — CRUD

### Media (5 endpoints)
- `GET /media` → list
- `POST /media/upload` → {media}
- `GET/PUT/DELETE /media/{id}`

### Categories (6 endpoints)
- `GET /categories` → list
- `GET /categories/tree` → nested tree
- `POST/GET/PUT/DELETE /categories` — CRUD

### Brands (5 endpoints)
- `GET/POST/GET/PUT/DELETE /brands` — CRUD

### Attributes (10 endpoints)
- `GET/POST/GET/PUT/DELETE /attributes` — CRUD
- `POST/GET/PUT/DELETE /attributes/{id}/values` — values

### Products (10 endpoints)
- `GET /products` → paginated, searchable, filterable
- `POST /products` → {product} (atomic transaction)
- `GET/PUT/DELETE /products/{id}`
- `POST/GET/PUT/DELETE /products/{id}/variants`

### Inventory (new)
- `GET /inventory` → list by warehouse
- `POST /inventory/transfers` → {transfer}
- `GET /inventory/reorder-suggestions` → list
- `POST /inventory/purchase-orders` → {po}

### Analytics (new)
- `GET /analytics/sales` → daily/weekly/monthly
- `GET /analytics/inventory-forecast` → predictions
- `GET /analytics/demand-planning` → projections

## Technical Notes
- 44 permissions across 9 modules; role-based access control
- Prisma transactions for atomic product creation
- Cascade deletes via Prisma schema
- Hard delete for users (design decision)
- No multi-warehouse, order routing, forecasting, or vendor marketplace yet

## Day 2 Outcome
Architecture design documented. No code changes. 0 PRs. Ready for Day 3 (CI/CD pipeline).