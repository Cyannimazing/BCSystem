# Dynamic Header Update - Labor Monitoring

## Changes Made

### ✅ **Backend API Endpoint**

**Created new controller and route:**
- **File**: `backend/app/Http/Controllers/BirthCareController.php`
- **Route**: `GET /api/birthcare/{id}`
- **Purpose**: Fetch birth care facility details by ID

**Controller Method:**
```php
public function show($id)
{
    $birthcare = BirthCare::find($id);
    
    if (!$birthcare) {
        return response()->json([
            'message' => 'Birth care facility not found.'
        ], 404);
    }
    
    return response()->json([
        'data' => $birthcare
    ]);
}
```

### ✅ **Frontend Dynamic Header**

**Added state and functionality:**
- Added `birthCareInfo` state to store facility data
- Added `fetchBirthCareInfo()` function to get facility details
- Updated `useEffect` to fetch facility info on component load

**Updated Header Display:**
- **Before**: Hardcoded "BUHANGIN HEALTH CENTER-BIRTHING HOME"
- **After**: Dynamic `{birthCareInfo?.name?.toUpperCase() || 'BIRTH CARE FACILITY'}`

- **Before**: Hardcoded "NHA Buhangin, Buhangin District, Davao City"
- **After**: Dynamic `{birthCareInfo?.description || 'Registered Birth Care Facility'}`

## Header Structure

### Current Header Layout:
```
REPUBLIC OF THE PHILIPPINES
CITY GOVERNMENT OF DAVAO
[FACILITY NAME] ← Now Dynamic
[FACILITY DESCRIPTION] ← Now Dynamic
LABOR MONITORING SHEET
```

### Example with Dynamic Data:
```
REPUBLIC OF THE PHILIPPINES
CITY GOVERNMENT OF DAVAO
MARY'S BIRTHING CENTER
Complete maternity care services in Davao City
LABOR MONITORING SHEET
```

## API Usage

The labor monitoring page now makes this API call:
```javascript
const fetchBirthCareInfo = async () => {
  try {
    const response = await axios.get(`/api/birthcare/${birthcare_Id}`);
    setBirthCareInfo(response.data.data);
  } catch (error) {
    console.error('Error fetching birth care info:', error);
  }
};
```

## Files Modified

### Backend:
1. **`backend/app/Http/Controllers/BirthCareController.php`** - New controller for facility details
2. **`backend/routes/api.php`** - Added new API route

### Frontend:
1. **`frontend/src/app/(staff)/[birthcare_Id]/labor-monitoring/page.jsx`** - Updated to use dynamic header

## Database Requirements

The system uses the `birth_cares` table with these key fields:
- `id` - Facility ID (from URL parameter)
- `name` - Facility name (displayed in header)
- `description` - Facility description (displayed below name)

## Fallback Behavior

If the facility data cannot be loaded:
- **Name**: Shows "BIRTH CARE FACILITY" 
- **Description**: Shows "Registered Birth Care Facility"
- **Functionality**: Labor monitoring continues to work normally

## Benefits

1. **Personalized Forms**: Each facility's forms show their actual name
2. **Professional Branding**: Official documents reflect the correct facility
3. **Multi-Tenant Support**: Different facilities see their own branding
4. **Print-Friendly**: Headers print correctly with facility details
5. **Error Resilient**: Graceful fallbacks if data loading fails

## Usage

This change automatically applies to all labor monitoring forms. When staff members access the labor monitoring page for their facility, they will see their facility's name and description in the official header, making the documents more professional and facility-specific.