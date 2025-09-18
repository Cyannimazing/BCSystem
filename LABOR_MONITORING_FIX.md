# Labor Monitoring Issue - Troubleshooting Guide

## Issues Found and Fixed

### ✅ 1. Database Migration Issue
**Problem**: The `labor_monitoring` table was not migrated.
**Status**: FIXED - Migration has been run successfully.

### ✅ 2. Frontend Environment Configuration
**Problem**: Missing `.env.local` file in frontend.
**Status**: FIXED - Created `/frontend/.env.local` with `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`

### 🔧 3. Authentication Issue
**Problem**: API routes require authentication but frontend might not be properly authenticated.

## Steps to Resolve Authentication Issues

### Step 1: Start the Backend Server
```bash
cd backend
php artisan serve
```
The server should start on `http://localhost:8000`

### Step 2: Start the Frontend Development Server
```bash
cd frontend
npm install  # if not already done
npm run dev
```
The frontend should start on `http://localhost:3000`

### Step 3: Verify User Authentication
1. Open the application in browser: `http://localhost:3000`
2. Log in with a user account
3. Navigate to the staff dashboard
4. Ensure you're logged in as a staff member with access to birth care center ID 1

### Step 4: Test Labor Monitoring
1. Go to Labor Monitoring page: `/staff/1/labor-monitoring` (replace 1 with your birth care ID)
2. Select a patient from the dropdown
3. Try adding a monitoring entry

## Debugging Tools

### 1. Use the Debug HTML Page
I've created `debug_labor.html` in the root directory. Open it in a browser and:
1. Click "Test API Connection" - should show authentication error (expected)
2. This will help verify if the backend is running

### 2. Check Browser Console
Open browser developer tools (F12) and check:
- Network tab for API requests
- Console tab for JavaScript errors

### 3. Backend Logs
Check Laravel logs for any errors:
```bash
cd backend
tail -f storage/logs/laravel.log
```

## Common Issues and Solutions

### Issue: "Error saving monitoring entry"
**Possible Causes:**
1. User not authenticated
2. User doesn't have access to the birth care center
3. Patient doesn't exist
4. Validation errors

**Debug Steps:**
1. Check browser console for error details
2. Verify user is logged in and has staff role
3. Confirm patient exists in the database

### Issue: Patient dropdown is empty
**Solution:**
1. Ensure patients exist for the birth care center
2. Check if user has access to the birth care center
3. Verify the birth care ID in the URL matches the user's assigned center

### Issue: Authentication errors
**Solutions:**
1. Clear browser cookies and local storage
2. Log out and log back in
3. Check if Sanctum session is working properly

## Manual Database Verification

To check if data is being saved:
```bash
cd backend
php artisan tinker
```

Then in tinker:
```php
// Check patients
\App\Models\Patient::count()

// Check labor monitoring entries
\App\Models\LaborMonitoring::count()

// Check latest entry
\App\Models\LaborMonitoring::latest()->first()

// Add test entry manually
\App\Models\LaborMonitoring::create([
    'patient_id' => 1,
    'birth_care_id' => 1, 
    'monitoring_date' => '2025-09-17',
    'monitoring_time' => '10:30:00',
    'temperature' => '36.5',
    'pulse' => '80',
    'respiration' => '18',
    'blood_pressure' => '120/80',
    'fht_location' => 'Left lower quadrant',
    'created_by' => 1
]);
```

## Additional Fixes Applied

### Frontend Environment File
Created `/frontend/.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Verified API Routes
The following labor monitoring routes are confirmed working:
- GET `/api/birthcare/{birthcare_id}/labor-monitoring`
- POST `/api/birthcare/{birthcare_id}/labor-monitoring`
- DELETE `/api/birthcare/{birthcare_id}/labor-monitoring/{entry}`

## Expected Workflow

1. User logs in as staff member
2. Navigates to labor monitoring page
3. Selects patient from dropdown (populated from `/api/birthcare/1/patients`)
4. Fills monitoring form
5. Clicks "Add Entry" button
6. Data is sent to `/api/birthcare/1/labor-monitoring` via POST
7. Entry appears in the monitoring table
8. User can print/export the monitoring sheet

## Next Steps if Issues Persist

1. **Check User Roles**: Ensure logged-in user has staff role (system_role_id = 3)
2. **Verify Birth Care Assignment**: User must be assigned to the birth care center
3. **Check Patients**: Ensure patients exist for the birth care center
4. **Test API Directly**: Use the debug HTML tool or Postman to test API endpoints
5. **Check Laravel Logs**: Look for specific error messages in backend logs

## Contact Information

If issues persist, provide:
1. Browser console errors
2. Backend log errors  
3. Steps to reproduce the issue
4. User role and birth care center assignment details