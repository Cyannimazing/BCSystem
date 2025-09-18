# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

BCSystem is a comprehensive Birth Care Management System designed for birthing facilities in the Philippines. It provides a multi-tenant platform where facility owners can manage their birth care centers, staff can handle patient care, and administrators oversee the system.

### Core Architecture

**Full-stack Application:**
- **Backend**: Laravel 12 API with Sanctum authentication
- **Frontend**: Next.js with Tailwind CSS
- **Database**: SQLite (configurable to MySQL)
- **Testing**: Pest PHP for backend testing

**Multi-tenant Role System:**
1. **System Admin** (role_id: 1) - Oversees facility approvals and system management
2. **Facility Owner** (role_id: 2) - Manages their birth care facility 
3. **Staff** (role_id: 3) - Handles patient care operations

## Development Commands

### Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup (Next.js)
```bash
cd frontend  
npm install
cp .env.example .env
npm run dev
```

### Testing
```bash
# Backend tests (Pest)
cd backend
php artisan test
./vendor/bin/pest

# Run specific test files
./vendor/bin/pest tests/Feature/Auth/
./vendor/bin/pest tests/Unit/

# Run with coverage (if configured)
./vendor/bin/pest --coverage
```

### Database Operations
```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Create new migration
php artisan make:migration create_table_name

# Create model with migration
php artisan make:model ModelName -m

# Create controller
php artisan make:controller ControllerName
```

### Code Quality
```bash
# Laravel Pint (code formatting)
cd backend
./vendor/bin/pint

# Fix specific files
./vendor/bin/pint app/Http/Controllers/

# Check without fixing
./vendor/bin/pint --test
```

## Core System Components

### Patient Management Flow
1. **Patient Registration** - Basic patient information and PhilHealth details
2. **Prenatal Visits** - Scheduled checkups and medical history tracking
3. **Patient Admission** - Detailed admission process for labor and delivery
4. **Labor Monitoring** - Real-time vital signs and labor progress tracking
5. **Document Management** - Medical records, forms, and patient documents
6. **Billing & Payments** - Service charges and payment processing
7. **Referrals** - Patient referrals to other facilities when needed

### Key Models and Relationships
- **BirthCare** - Facility information (belongs to User owner)
- **Patient** - Patient records (belongs to BirthCare)
- **PatientAdmission** - Hospital admissions (belongs to Patient)
- **LaborMonitoring** - Vital signs tracking (belongs to Patient)
- **PrenatalVisit** - Prenatal appointments (belongs to Patient)
- **PatientDocument** - Medical documents (belongs to Patient)
- **BirthCareStaff** - Staff assignments (belongs to BirthCare and User)

### API Structure
All authenticated routes are under `/api/` with Sanctum middleware:
- `/api/birthcare/{birthcare_id}/patients` - Patient management
- `/api/birthcare/{birthcare_id}/patient-admissions` - Admissions
- `/api/birthcare/{birthcare_id}/labor-monitoring` - Labor tracking
- `/api/birthcare/{birthcare_id}/prenatal-visits` - Prenatal care
- `/api/birthcare/{birthcare_id}/billing` - Billing operations
- `/api/birthcare/{birthcare_id}/referrals` - Patient referrals

## Development Guidelines

### Authentication Context
- Frontend uses custom `useAuth` hook with Sanctum
- Backend API routes require `auth:sanctum` middleware
- User roles determine access permissions across the system

### State Management Patterns
- React useState and useEffect for component state
- SWR library used for API data fetching and caching
- Form handling typically uses controlled components

### UI/UX Standards
- Tailwind CSS for styling with consistent design system
- Print-friendly layouts for medical forms using `print:` classes
- PDF generation capabilities with jsPDF and html2canvas
- Mobile-responsive design patterns

### Database Patterns
- Uses Laravel Eloquent ORM with proper relationships
- SQLite for development, MySQL for production
- Migration files follow Laravel naming conventions
- Soft deletes and timestamps on relevant models

### Testing Approach
- Pest PHP for backend feature and unit testing
- Authentication tests cover user registration, login, email verification
- Database transactions used in tests for isolation
- Test environment uses array cache and sync queues

## Common Development Tasks

### Adding New Patient Features
1. Create migration: `php artisan make:migration create_new_feature_table`
2. Create model: `php artisan make:model NewFeature -m`
3. Add API routes in `routes/api.php` under birthcare prefix
4. Create controller: `php artisan make:controller NewFeatureController`
5. Add frontend pages under `frontend/src/app/(staff)/[birthcare_Id]/`

### Working with Medical Forms
- Forms follow official Philippine health center templates
- Print layouts use official letterheads and formatting
- PDF generation preserves medical form authenticity
- Digital signatures and medical staff information included

### Managing Multi-tenant Data
- All patient data is scoped by `birth_care_id`
- API routes include birthcare ID parameter for data isolation
- Staff permissions are managed per facility
- Owner access is restricted to their own facilities

## Key File Locations

### Backend Structure
- Models: `backend/app/Models/`
- Controllers: `backend/app/Http/Controllers/`
- Migrations: `backend/database/migrations/`
- API Routes: `backend/routes/api.php`
- Tests: `backend/tests/Feature/` and `backend/tests/Unit/`

### Frontend Structure
- Staff Dashboard: `frontend/src/app/(staff)/[birthcare_Id]/`
- Owner Dashboard: `frontend/src/app/(owner)/`
- Admin Dashboard: `frontend/src/app/(admin)/`
- Authentication: `frontend/src/app/(auth)/`
- Shared Components: `frontend/src/components/`
- API Client: `frontend/src/lib/axios.js`

### Configuration Files
- Backend Environment: `backend/.env`
- Frontend Environment: `frontend/.env.local`
- Database Config: `backend/config/database.php`
- Laravel Config: `backend/config/app.php`

## System Requirements

### Development Environment
- PHP 8.2+
- Composer 2.x
- Node.js 18+ 
- NPM/Yarn
- SQLite or MySQL

### Production Considerations
- MySQL database recommended for production
- File storage configuration for patient documents
- Mail server setup for notifications
- SSL certificate for secure patient data handling
- Regular database backups for medical records

## Integration Points

### PhilHealth Integration
- Patient records include PhilHealth member information
- Billing system accommodates PhilHealth benefits
- Forms generate PhilHealth-compliant documentation

### Document Management
- Patient documents stored with organized file structure  
- PDF generation for official medical forms
- Document viewing and download capabilities
- Version control for updated medical records

### Reporting and Analytics  
- Patient statistics and facility metrics
- Financial reporting for billing operations
- Medical outcome tracking capabilities
- Export functionality for regulatory compliance