# StaySpot Backend API

## Architecture
The backend follows a layered architecture:
- **Models**: Database schema and associations
- **Controllers**: Request/response handlers
- **Services**: Business logic
- **Routes**: API endpoint definitions
- **Middleware**: Request processing functions

## API Documentation
All API endpoints require authentication unless specified.

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/logout` - User logout

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Properties
- GET `/api/properties` - Get all properties
- POST `/api/properties` - Create property
- GET `/api/properties/:id` - Get property by ID
- PUT `/api/properties/:id` - Update property
- DELETE `/api/properties/:id` - Delete property
- POST `/api/properties/:id/upload` - Upload property images

## Database Models
Key models include:
- User: System users with roles
- Property: Rental properties with geolocation
- Company: Management companies
- Portfolio: Property portfolios
- Task: Work assignments
- Invitation: Team member invitations

## Development
```bash
# Install dependencies
npm install

# Setup database
npm run setup-db

# Start development server
npm run dev

# Run tests
npm test