# Fill Sample Data Feature - Labor Monitoring

## Feature Added

### ✅ **Fill Sample Data Button**

**Location**: Labor monitoring entry form (when a patient is selected)
**Purpose**: Quickly populate the monitoring form with realistic test data for development and testing

### **Button Design**
- **Style**: Green background with darker green text (`bg-green-100 text-green-700`)
- **Position**: Next to "Add Entry" button in the top-right of the monitoring entry section
- **Hover Effect**: Lighter green background on hover (`hover:bg-green-200`)

## Sample Data Generated

### **Vital Signs Data**
- **Date**: Current date (automatically set)
- **Time**: Current time (automatically set)
- **Temperature**: `36.7°C` (normal body temperature)
- **Pulse**: `82 bpm` (normal resting heart rate)
- **Respiration**: `18 /min` (normal respiratory rate)
- **Blood Pressure**: `120/80 mmHg` (normal blood pressure)
- **FHT/Location**: `Left lower quadrant` (common fetal heart tone location)

### **Additional Information**
- **Case No**: `LC-2025-001` (Labor Case format)
- **Bed No**: `B-12` (Bed identifier)

*Note: Additional information is only filled if the fields are empty*

## Code Implementation

### **Sample Data Function**
```javascript
const fillSampleData = () => {
  const currentTime = new Date();
  const timeString = currentTime.toTimeString().slice(0, 5);
  
  setNewEntry({
    date: new Date().toISOString().split('T')[0],
    time: timeString,
    temperature: '36.7',
    pulse: '82',
    respiration: '18',
    blood_pressure: '120/80',
    fht_location: 'Left lower quadrant'
  });
  
  // Also fill additional info if empty
  if (!additionalInfo.case_no) {
    setAdditionalInfo({
      ...additionalInfo,
      case_no: 'LC-2025-001',
      bed_no: 'B-12'
    });
  }
};
```

### **Button Implementation**
```jsx
<button
  type="button"
  onClick={fillSampleData}
  className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium transition-colors"
>
  Fill Sample Data
</button>
```

## User Experience

### **Before (Manual Data Entry)**
1. User selects a patient
2. User manually enters each field:
   - Date, Time, Temperature, Pulse, etc.
3. Time-consuming for testing multiple entries

### **After (With Sample Data)**
1. User selects a patient
2. User clicks "Fill Sample Data" button
3. All fields populate instantly with realistic values
4. User can immediately click "Add Entry" or modify values as needed

## Use Cases

### **Development & Testing**
- **Quick Testing**: Rapidly populate forms during development
- **Demo Purposes**: Show functionality with realistic data
- **QA Testing**: Generate consistent test data for quality assurance

### **Training**
- **Staff Training**: New users can see what proper data looks like
- **Form Validation**: Test that all fields work correctly
- **Workflow Testing**: Complete end-to-end testing quickly

## Button Visibility

- **Visible**: Only when a patient is selected
- **Hidden**: When printing (uses `print:hidden` on parent container)
- **Responsive**: Works on all screen sizes

## Data Quality

### **Realistic Values**
- All sample values are within normal medical ranges
- Follows proper formatting (e.g., "120/80" for blood pressure)
- Uses current date/time for relevance

### **Professional Format**
- Temperature: Standard Celsius format
- Pulse: Standard BPM format  
- Blood Pressure: Standard systolic/diastolic format
- Respiration: Per minute format
- FHT Location: Medical terminology

## Files Modified

- **`frontend/src/app/(staff)/[birthcare_Id]/labor-monitoring/page.jsx`**
  - Added `fillSampleData()` function
  - Added "Fill Sample Data" button to UI
  - Updated button layout to accommodate both buttons

## Benefits

1. **Faster Development**: Developers can test functionality quickly
2. **Consistent Testing**: Same sample data every time for reliable testing
3. **Better UX**: Users understand what data format is expected
4. **Training Tool**: New staff can see example entries
5. **Demo Ready**: Always have realistic data for demonstrations

## Usage Instructions

1. Navigate to Labor Monitoring page
2. Select a patient from dropdown
3. Click "Fill Sample Data" button
4. Review/modify the populated values if needed
5. Click "Add Entry" to save the monitoring record

The feature makes testing and development significantly more efficient while maintaining professional data quality standards.