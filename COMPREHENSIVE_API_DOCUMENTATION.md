# Shop API - Comprehensive Documentation

## Overview

This is a complete NestJS-based e-commerce API system with comprehensive authentication, user management, product catalog, order processing, inventory management, and returns handling. The system uses TypeScript, Prisma ORM with PostgreSQL, JWT authentication, and includes full Swagger API documentation.

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: class-validator and class-transformer
- **Testing**: Jest

## Architecture Overview

The application follows clean architecture principles with:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Data access layer
- **DTOs**: Data Transfer Objects for validation
- **Models**: Domain models
- **Mappers**: Convert between DTOs and models
- **Guards**: Authentication and authorization
- **Interceptors**: Request/response transformation
- **Filters**: Exception handling

## API Modules

### 1. Authentication Module (`/auth`)

#### Endpoints:

**POST /auth/login**

- **Purpose**: Authenticate user and issue JWT tokens
- **Body**: `{ email: string, password: string }`
- **Response**: `{ accessToken: string, refreshToken: string, user: UserInfo }`
- **Status Codes**: 200 (Success), 401 (Invalid credentials), 400 (Validation error)

**POST /auth/register**

- **Purpose**: Register new user account
- **Body**: `{ email: string, password: string, firstName: string, lastName: string, role?: 'USER'|'ADMIN' }`
- **Response**: `{ accessToken: string, refreshToken: string, user: UserInfo }`
- **Status Codes**: 201 (Created), 409 (Email exists), 400 (Validation error)

**POST /auth/change-password** 🔒

- **Purpose**: Change authenticated user's password
- **Auth**: Required (JWT Bearer token)
- **Body**: `{ currentPassword: string, newPassword: string }`
- **Response**: `{ message: string }`
- **Status Codes**: 200 (Success), 401 (Unauthorized), 400 (Invalid password), 404 (User not found)

**POST /auth/forgot-password**

- **Purpose**: Request password reset (security-first implementation)
- **Body**: `{ email: string }`
- **Response**: `{ message: string }` (same response regardless of email existence)
- **Status Codes**: 200 (Always), 400 (Validation error)

#### Service Functions:

```typescript
class AuthService {
  /**
   * Authenticates user with email/password, returns JWT tokens
   * - Validates credentials using bcrypt
   * - Checks account activation status
   * - Generates access token (15min) and refresh token (7d)
   */
  async login(dto: LoginDto): Promise<AuthResponseDto>;

  /**
   * Registers new user account
   * - Checks email uniqueness
   * - Hashes password with bcrypt (12 rounds)
   * - Creates user with default USER role
   * - Returns immediate JWT tokens
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto>;

  /**
   * Changes user password with current password verification
   * - Validates current password
   * - Ensures new password is different
   * - Updates with new bcrypt hash
   */
  async changePassword(
    dto: ChangePasswordDto,
    userId: string,
  ): Promise<MessageResponseDto>;

  /**
   * Handles password reset requests (secure implementation)
   * - Always returns same response for security
   * - TODO: Implement email sending with reset tokens
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponseDto>;
}
```

### 2. Users Module (`/users`)

#### Endpoints:

**POST /users**

- **Purpose**: Create new user account
- **Body**: `{ email: string, password: string, firstName: string, lastName: string, role: 'USER'|'ADMIN', isActive?: boolean }`
- **Response**: User object with timestamps
- **Status Codes**: 201 (Created), 409 (Email exists), 400 (Validation error)

**GET /users/:id**

- **Purpose**: Get user by ID
- **Parameters**: `id` (string) - User unique identifier
- **Response**: User object
- **Status Codes**: 200 (Found), 404 (Not found)

**PATCH /users/:id**

- **Purpose**: Update user information (partial update)
- **Parameters**: `id` (string) - User unique identifier
- **Body**: `{ email?: string, firstName?: string, lastName?: string, role?: string, isActive?: boolean }`
- **Response**: Updated user object
- **Status Codes**: 200 (Updated), 404 (Not found), 400 (Validation error)

**DELETE /users/:id**

- **Purpose**: Permanently delete user account
- **Parameters**: `id` (string) - User unique identifier
- **Response**: `{ success: boolean }`
- **Status Codes**: 200 (Deleted), 404 (Not found)

#### Service Functions:

```typescript
class UsersService {
  /**
   * Creates new user account
   * - Maps DTO to domain model
   * - Stores user with generated timestamps
   */
  async create(dto: CreateUserDto): Promise<UserModel>;

  /**
   * Retrieves user by unique identifier
   */
  async findOne(id: string): Promise<UserModel | undefined>;

  /**
   * Updates user with partial data
   * - Only updates provided fields
   * - Preserves existing data for omitted fields
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserModel | undefined>;

  /**
   * Permanently removes user (irreversible)
   */
  async remove(id: string): Promise<boolean>;
}
```

### 3. Products Module (`/products`)

#### Endpoints:

**POST /products**

- **Purpose**: Create new product in catalog
- **Body**: `{ name: string, description: string, price: number, category: string, brand: string, images: string[], isActive?: boolean }`
- **Response**: Product object with timestamps
- **Status Codes**: 201 (Created), 400 (Validation error)

**GET /products**

- **Purpose**: List products with filtering and pagination
- **Query Parameters**:
  - `search?: string` - Search in name/description
  - `category?: string` - Filter by category
  - `brand?: string` - Filter by brand
  - `skip?: number` - Pagination offset (default: 0)
  - `take?: number` - Items per page (max: 50, default: 10)
- **Response**: Array of product objects
- **Status Codes**: 200 (Success)

**GET /products/:id**

- **Purpose**: Get product details by ID
- **Parameters**: `id` (string) - Product unique identifier
- **Response**: Product object with full details
- **Status Codes**: 200 (Found), 404 (Not found)

**PATCH /products/:id**

- **Purpose**: Update product information
- **Parameters**: `id` (string) - Product unique identifier
- **Body**: `{ name?: string, description?: string, price?: number, category?: string, brand?: string, images?: string[], isActive?: boolean }`
- **Response**: Updated product object
- **Status Codes**: 200 (Updated), 404 (Not found), 400 (Validation error)

**DELETE /products/:id**

- **Purpose**: Remove product from catalog
- **Parameters**: `id` (string) - Product unique identifier
- **Response**: `{ success: boolean }`
- **Status Codes**: 200 (Deleted), 404 (Not found)

#### Service Functions:

```typescript
class ProductsService {
  /**
   * Creates new product in catalog
   * - Validates product data
   * - Stores with generated timestamps
   */
  async create(dto: CreateProductDto): Promise<ProductModel>;

  /**
   * Retrieves products with optional filtering
   * - Supports search by name/description
   * - Filters by category and brand
   * - Pagination support
   */
  async findAll(query: ProductQueryDto): Promise<ProductModel[]>;

  /**
   * Retrieves single product by ID
   */
  async findOne(id: string): Promise<ProductModel | undefined>;

  /**
   * Updates product with partial data
   * - Only updates provided fields
   */
  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductModel | undefined>;

  /**
   * Permanently removes product (irreversible)
   */
  async remove(id: string): Promise<boolean>;
}
```

### 4. Orders Module (`/orders`)

#### Endpoints:

**POST /orders**

- **Purpose**: Create new order with items
- **Body**: `{ userId: string, items: [{ productId: string, quantity: number, unitPrice: number }], shippingAddress: object }`
- **Response**: Order object with calculated totals
- **Status Codes**: 201 (Created), 400 (Validation error)

**GET /orders**

- **Purpose**: List orders with filtering
- **Query Parameters**:
  - `userId?: string` - Filter by user
  - `status?: string` - Filter by order status
  - `skip?: number` - Pagination offset
  - `take?: number` - Items per page
- **Response**: Array of order objects
- **Status Codes**: 200 (Success)

**GET /orders/:id**

- **Purpose**: Get order details including all items
- **Parameters**: `id` (string) - Order unique identifier
- **Response**: Order object with items array
- **Status Codes**: 200 (Found), 404 (Not found)

**PATCH /orders/:id/status**

- **Purpose**: Update order status
- **Parameters**: `id` (string) - Order unique identifier
- **Body**: `{ status: 'PENDING'|'CONFIRMED'|'SHIPPED'|'DELIVERED'|'CANCELLED' }`
- **Response**: Updated order object
- **Status Codes**: 200 (Updated), 404 (Not found), 400 (Invalid transition)

#### Service Functions:

```typescript
class OrdersService {
  /**
   * Creates new order with multiple items
   * - Calculates total amounts
   * - Initializes with PENDING status
   * - Validates item data
   */
  async create(dto: CreateOrderDto): Promise<OrderModel>;

  /**
   * Retrieves orders with filtering
   * - Filter by user, status
   * - Pagination support
   */
  async findAll(query: OrderQueryDto): Promise<OrderModel[]>;

  /**
   * Retrieves order with all items
   */
  async findOne(id: string): Promise<OrderModel | undefined>;

  /**
   * Updates order status with validation
   * - Ensures valid status transitions
   * - Tracks status change timestamps
   */
  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderModel | undefined>;
}
```

### 5. Inventory Module (`/inventory`)

#### Endpoints:

**GET /inventory**

- **Purpose**: List inventory items with stock levels
- **Query Parameters**:
  - `lowStock?: boolean` - Filter for items below minimum threshold
  - `skip?: number` - Pagination offset
  - `take?: number` - Items per page
- **Response**: Array of inventory objects with stock alerts
- **Status Codes**: 200 (Success)

**GET /inventory/:productId**

- **Purpose**: Get inventory for specific product
- **Parameters**: `productId` (string) - Product unique identifier
- **Response**: Inventory object with stock levels and alerts
- **Status Codes**: 200 (Found), 404 (Not found)

**PATCH /inventory/:productId**

- **Purpose**: Update stock levels
- **Parameters**: `productId` (string) - Product unique identifier
- **Body**: `{ quantity?: number, minThreshold?: number }`
- **Response**: Updated inventory object
- **Status Codes**: 200 (Updated), 404 (Not found), 400 (Validation error)

#### Service Functions:

```typescript
class InventoryService {
  /**
   * Retrieves inventory with optional low stock filtering
   * - Identifies items needing restocking
   * - Supports pagination
   */
  async findAll(query: InventoryQueryDto): Promise<InventoryModel[]>;

  /**
   * Retrieves inventory for specific product
   * - Shows current stock levels
   * - Indicates low stock status
   */
  async findOne(productId: string): Promise<InventoryModel | undefined>;

  /**
   * Updates inventory levels (upsert operation)
   * - Creates record if doesn't exist
   * - Updates timestamp automatically
   */
  async update(
    productId: string,
    dto: UpdateInventoryDto,
  ): Promise<InventoryModel>;
}
```

### 6. Returns Module (`/returns`)

#### Endpoints:

**POST /returns**

- **Purpose**: Create return request for order
- **Body**: `{ orderId: string, userId: string, reason: string, refundAmount: number }`
- **Response**: Return request object
- **Status Codes**: 201 (Created), 400 (Validation error)

**GET /returns**

- **Purpose**: List return requests with filtering
- **Query Parameters**:
  - `userId?: string` - Filter by user
  - `orderId?: string` - Filter by order
  - `status?: string` - Filter by return status
  - `skip?: number` - Pagination offset
  - `take?: number` - Items per page
- **Response**: Array of return objects
- **Status Codes**: 200 (Success)

**GET /returns/:id**

- **Purpose**: Get return request details
- **Parameters**: `id` (string) - Return unique identifier
- **Response**: Return object with full details
- **Status Codes**: 200 (Found), 404 (Not found)

**PATCH /returns/:id/status**

- **Purpose**: Update return status
- **Parameters**: `id` (string) - Return unique identifier
- **Body**: `{ status: 'REQUESTED'|'APPROVED'|'REJECTED'|'COMPLETED' }`
- **Response**: Updated return object
- **Status Codes**: 200 (Updated), 404 (Not found), 400 (Invalid transition)

#### Service Functions:

```typescript
class ReturnsService {
  /**
   * Creates new return request
   * - Initializes with REQUESTED status
   * - Links to original order
   * - Specifies refund amount
   */
  async create(dto: CreateReturnDto): Promise<ReturnModel>;

  /**
   * Retrieves returns with filtering
   * - Filter by user, order, status
   * - Pagination support
   */
  async findAll(query: ReturnQueryDto): Promise<ReturnModel[]>;

  /**
   * Retrieves return request details
   */
  async findOne(id: string): Promise<ReturnModel | undefined>;

  /**
   * Updates return status with workflow validation
   * - Ensures valid status transitions
   * - Tracks processing timeline
   */
  async updateStatus(
    id: string,
    dto: UpdateReturnStatusDto,
  ): Promise<ReturnModel | undefined>;
}
```

### 7. Admin Panel Module (`/admin`) 🔒

**Note**: All admin panel endpoints require JWT authentication and appropriate role permissions.

#### Endpoints:

**GET /admin/dashboard** 🔒

- **Purpose**: Get admin dashboard data
- **Auth**: Admin Panel Access (ADMIN, PRIMARY, SECONDARY)
- **Response**: Dashboard statistics and metrics
- **Status Codes**: 200 (Success), 403 (Frontend users denied), 401 (No token)

**GET /admin/reports** 🔒

- **Purpose**: Generate system reports
- **Auth**: Minimum PRIMARY role required
- **Response**: System reports data
- **Status Codes**: 200 (Success), 403 (SECONDARY/USER denied)

**POST /admin/system/backup** 🔒

- **Purpose**: Create system backup
- **Auth**: ADMIN role only
- **Response**: Backup process details
- **Status Codes**: 202 (Initiated), 403 (All other roles denied)

**DELETE /admin/users/:id** 🔒

- **Purpose**: Delete user account
- **Auth**: Minimum PRIMARY role required
- **Parameters**: `id` (string) - User ID to delete
- **Response**: Deletion confirmation
- **Status Codes**: 200 (Deleted), 403 (SECONDARY/USER denied)

**GET /admin/settings** 🔒

- **Purpose**: Get admin panel settings
- **Auth**: Admin Panel Access (ADMIN, PRIMARY, SECONDARY)
- **Response**: System and user settings
- **Status Codes**: 200 (Success), 403 (Frontend users denied)

**POST /admin/moderate/product/:id** 🔒

- **Purpose**: Moderate product content
- **Auth**: Admin Panel Access (ADMIN, PRIMARY, SECONDARY)
- **Parameters**: `id` (string) - Product ID
- **Body**: `{ action: 'approve'|'reject'|'flag', reason?: string }`
- **Response**: Moderation result
- **Status Codes**: 200 (Moderated), 403 (Frontend users denied)

#### Role-Based Access Control

The admin panel uses three types of authorization decorators:

1. **@AdminPanel()** - Requires any admin panel role (ADMIN, PRIMARY, SECONDARY)
2. **@MinRole(RoleEnum.X)** - Requires minimum role level (hierarchy-based)
3. **@Roles([...])** - Requires specific roles (legacy support)

#### Permission Matrix

| Endpoint           | USER | SECONDARY | PRIMARY | ADMIN |
| ------------------ | ---- | --------- | ------- | ----- |
| Dashboard          | ❌   | ✅        | ✅      | ✅    |
| Reports            | ❌   | ❌        | ✅      | ✅    |
| System Backup      | ❌   | ❌        | ❌      | ✅    |
| Delete Users       | ❌   | ❌        | ✅      | ✅    |
| Settings           | ❌   | ✅        | ✅      | ✅    |
| Content Moderation | ❌   | ✅        | ✅      | ✅    |

- **Purpose**: Create return request for order
- **Body**: `{ orderId: string, userId: string, reason: string, refundAmount: number }`
- **Response**: Return request object
- **Status Codes**: 201 (Created), 400 (Validation error)

**GET /returns**

- **Purpose**: List return requests with filtering
- **Query Parameters**:
  - `userId?: string` - Filter by user
  - `orderId?: string` - Filter by order
  - `status?: string` - Filter by return status
  - `skip?: number` - Pagination offset
  - `take?: number` - Items per page
- **Response**: Array of return objects
- **Status Codes**: 200 (Success)

**GET /returns/:id**

- **Purpose**: Get return request details
- **Parameters**: `id` (string) - Return unique identifier
- **Response**: Return object with full details
- **Status Codes**: 200 (Found), 404 (Not found)

**PATCH /returns/:id/status**

- **Purpose**: Update return status
- **Parameters**: `id` (string) - Return unique identifier
- **Body**: `{ status: 'REQUESTED'|'APPROVED'|'REJECTED'|'COMPLETED' }`
- **Response**: Updated return object
- **Status Codes**: 200 (Updated), 404 (Not found), 400 (Invalid transition)

#### Service Functions:

```typescript
class ReturnsService {
  /**
   * Creates new return request
   * - Initializes with REQUESTED status
   * - Links to original order
   * - Specifies refund amount
   */
  async create(dto: CreateReturnDto): Promise<ReturnModel>;

  /**
   * Retrieves returns with filtering
   * - Filter by user, order, status
   * - Pagination support
   */
  async findAll(query: ReturnQueryDto): Promise<ReturnModel[]>;

  /**
   * Retrieves return request details
   */
  async findOne(id: string): Promise<ReturnModel | undefined>;

  /**
   * Updates return status with workflow validation
   * - Ensures valid status transitions
   * - Tracks processing timeline
   */
  async updateStatus(
    id: string,
    dto: UpdateReturnStatusDto,
  ): Promise<ReturnModel | undefined>;
}
```

## Data Models

### User Model

```typescript
{
  id: string; // Unique identifier (CUID)
  email: string; // Unique email address
  password: string; // Bcrypt hashed password
  firstName: string; // User's first name
  lastName: string; // User's last name
  role: 'ADMIN' | 'PRIMARY' | 'SECONDARY' | 'USER'; // User role with 4-tier system
  isActive: boolean; // Account status
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### Product Model

```typescript
{
  id: string;              // Unique identifier
  name: string;            // Product name
  description: string;     // Product description
  price: number;           // Price in USD
  category: string;        // Product category
  brand: string;           // Product brand
  images: string[];        // Array of image URLs
  isActive: boolean;       // Catalog status
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Order Model

```typescript
{
  id: string;              // Unique identifier
  userId: string;          // Customer ID
  status: OrderStatus;     // Order status enum
  totalAmount: number;     // Total order amount
  shippingAddress: object; // Shipping address JSON
  items: OrderItem[];      // Array of order items
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Inventory Model

```typescript
{
  id: string; // Unique identifier
  productId: string; // Product reference
  quantity: number; // Current stock level
  minThreshold: number; // Minimum stock threshold
  lastUpdated: Date; // Last inventory update
}
```

### Return Model

```typescript
{
  id: string; // Unique identifier
  orderId: string; // Original order reference
  userId: string; // Customer reference
  reason: string; // Return reason
  status: ReturnStatus; // Return status enum
  refundAmount: number; // Refund amount
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

## Enums

### Role Enum

```typescript
enum RoleEnum {
  /** Full system administrator with complete access to admin panel and all features */
  ADMIN = 'ADMIN',

  /** Primary administrator with admin panel access and most administrative features */
  PRIMARY = 'PRIMARY',

  /** Secondary administrator with limited admin panel access */
  SECONDARY = 'SECONDARY',

  /** Regular user with frontend-only access, no admin panel permissions */
  USER = 'USER',
}
```

### Role Hierarchy & Permissions

```typescript
// Role hierarchy levels (higher numbers = higher privileges)
const ROLE_HIERARCHY = {
  USER: 1, // Frontend-only access
  SECONDARY: 2, // Limited admin panel access
  PRIMARY: 3, // Most admin panel features
  ADMIN: 4, // Full system access
};

// Admin panel access roles
const ADMIN_PANEL_ROLES = [ADMIN, PRIMARY, SECONDARY];

// Frontend-only roles
const FRONTEND_ONLY_ROLES = [USER];
```

### Order Status Enum

```typescript
enum OrderStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
```

### Return Status Enum

```typescript
enum ReturnStatusEnum {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}
```

## Authentication & Security

### JWT Token Structure

```typescript
{
  sub: string; // User ID
  email: string; // User email
  role: string; // User role
  iat: number; // Issued at
  exp: number; // Expires at
}
```

### Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

### Password Security

- **Hashing**: bcrypt with 12 salt rounds
- **Minimum Length**: 6 characters
- **Validation**: Current password required for changes

### Protected Endpoints

- **POST /auth/change-password**: Requires JWT authentication
- All other endpoints are public or use application-level security

## Error Responses

### Standard Error Format

```typescript
{
  statusCode: number;
  message: string | string[];
  error: string;
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication failed)
- **404**: Not Found
- **409**: Conflict (resource already exists)

## Validation Rules

### Email Validation

- Must be valid email format
- Must be unique across users

### Password Validation

- Minimum 6 characters
- Required for authentication
- Must be different when changing

### Pagination

- **skip**: Minimum 0 (default: 0)
- **take**: Minimum 1, Maximum 50 (default: 10)

### Price Validation

- Must be positive number
- Decimal precision: 2 places

## Database Schema (Prisma)

### Key Relationships

- User → Orders (one-to-many)
- User → Returns (one-to-many)
- Order → OrderItems (one-to-many)
- Order → Returns (one-to-many)
- Product → OrderItems (one-to-many)
- Product → Inventory (one-to-one)

### Indexes

- User email (unique)
- Order userId
- OrderItem orderId, productId
- Return orderId, userId

## API Usage Examples

### Authentication Flow

```typescript
// 1. Register new user
POST /auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

// 2. Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// 3. Use access token in headers
Authorization: Bearer <accessToken>
```

### Order Creation Flow

```typescript
// 1. Create order
POST /orders
{
  "userId": "user-id-123",
  "items": [
    {
      "productId": "product-id-456",
      "quantity": 2,
      "unitPrice": 299.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}

// 2. Update order status
PATCH /orders/:id/status
{
  "status": "CONFIRMED"
}
```

### Product Search

```typescript
// Search products
GET /products?search=wireless&category=Electronics&skip=0&take=10

// Get specific product
GET /products/:id
```

### Inventory Management

```typescript
// Check low stock items
GET /inventory?lowStock=true

// Update stock levels
PATCH /inventory/:productId
{
  "quantity": 100,
  "minThreshold": 10
}
```

### Return Processing

```typescript
// Create return request
POST /returns
{
  "orderId": "order-id-123",
  "userId": "user-id-456",
  "reason": "Product arrived damaged",
  "refundAmount": 299.99
}

// Approve return
PATCH /returns/:id/status
{
  "status": "APPROVED"
}
```

## Development Guidelines

### Code Structure

- Follow clean architecture principles
- Use dependency injection
- Implement proper error handling
- Include comprehensive logging
- Write unit and integration tests

### TypeScript Best Practices

- Use strict type checking
- Define interfaces for all data structures
- Use enums for constants
- Implement proper error types

### API Design Principles

- RESTful endpoints
- Consistent response formats
- Proper HTTP status codes
- Comprehensive validation
- Clear error messages

This documentation provides a complete reference for understanding and working with the Shop API system, including all endpoints, business logic, data models, and implementation details.
