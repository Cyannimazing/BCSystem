<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PatientAdmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PatientAdmissionController extends Controller
{
    /**
     * Display a listing of patient admissions.
     */
    public function index(Request $request, $birthcare_id): JsonResponse
    {
        $query = PatientAdmission::with(['patient', 'admittedBy'])
            ->where('birth_care_id', $birthcare_id);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('chief_complaint', 'like', "%{$search}%")
                  ->orWhere('room_number', 'like', "%{$search}%")
                  ->orWhere('attending_physician', 'like', "%{$search}%")
                  ->orWhereHas('patient', function ($patientQuery) use ($search) {
                      $patientQuery->where('first_name', 'like', "%{$search}%")
                                   ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('admission_type')) {
            $query->where('admission_type', $request->get('admission_type'));
        }

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->get('patient_id'));
        }

        $admissions = $query->orderBy('admission_date', 'desc')
                           ->orderBy('admission_time', 'desc')
                           ->paginate(15);

        return response()->json($admissions);
    }

    /**
     * Store a newly created patient admission.
     */
    public function store(Request $request, $birthcare_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'admission_date' => 'required|date',
            'admission_time' => 'required|date_format:H:i',
            'admission_type' => 'required|string|max:255',
            'chief_complaint' => 'nullable|string|max:255',
            'present_illness' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'vital_signs_temperature' => 'nullable|string|max:50',
            'vital_signs_blood_pressure' => 'nullable|string|max:50',
            'vital_signs_heart_rate' => 'nullable|string|max:50',
            'vital_signs_respiratory_rate' => 'nullable|string|max:50',
            'vital_signs_oxygen_saturation' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0|max:999.99',
            'height' => 'nullable|numeric|min:0|max:999.99',
            'physical_examination' => 'nullable|string',
            'initial_diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'attending_physician' => 'nullable|string|max:255',
            'room_number' => 'nullable|string|max:50',
            'bed_number' => 'nullable|string|max:50',
            'status' => 'required|in:admitted,discharged,transferred,active',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $admission = PatientAdmission::create([
                'patient_id' => $request->patient_id,
                'birth_care_id' => $birthcare_id,
                'admission_date' => $request->admission_date,
                'admission_time' => $request->admission_time,
                'admission_type' => $request->admission_type,
                'chief_complaint' => $request->chief_complaint,
                'present_illness' => $request->present_illness,
                'medical_history' => $request->medical_history,
                'allergies' => $request->allergies,
                'current_medications' => $request->current_medications,
                'vital_signs_temperature' => $request->vital_signs_temperature,
                'vital_signs_blood_pressure' => $request->vital_signs_blood_pressure,
                'vital_signs_heart_rate' => $request->vital_signs_heart_rate,
                'vital_signs_respiratory_rate' => $request->vital_signs_respiratory_rate,
                'vital_signs_oxygen_saturation' => $request->vital_signs_oxygen_saturation,
                'weight' => $request->weight,
                'height' => $request->height,
                'physical_examination' => $request->physical_examination,
                'initial_diagnosis' => $request->initial_diagnosis,
                'treatment_plan' => $request->treatment_plan,
                'attending_physician' => $request->attending_physician,
                'room_number' => $request->room_number,
                'bed_number' => $request->bed_number,
                'status' => $request->status,
                'notes' => $request->notes,
                'admitted_by' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'Patient admission created successfully',
                'admission' => $admission->load(['patient', 'admittedBy'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create patient admission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified patient admission.
     */
    public function show($birthcare_id, PatientAdmission $admission): JsonResponse
    {
        $admission->load(['patient', 'admittedBy']);
        return response()->json($admission);
    }

    /**
     * Update the specified patient admission.
     */
    public function update(Request $request, $birthcare_id, PatientAdmission $admission): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|required|exists:patients,id',
            'admission_date' => 'sometimes|required|date',
            'admission_time' => 'sometimes|required|date_format:H:i',
            'admission_type' => 'sometimes|required|string|max:255',
            'chief_complaint' => 'nullable|string|max:255',
            'present_illness' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'vital_signs_temperature' => 'nullable|string|max:50',
            'vital_signs_blood_pressure' => 'nullable|string|max:50',
            'vital_signs_heart_rate' => 'nullable|string|max:50',
            'vital_signs_respiratory_rate' => 'nullable|string|max:50',
            'vital_signs_oxygen_saturation' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0|max:999.99',
            'height' => 'nullable|numeric|min:0|max:999.99',
            'physical_examination' => 'nullable|string',
            'initial_diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'attending_physician' => 'nullable|string|max:255',
            'room_number' => 'nullable|string|max:50',
            'bed_number' => 'nullable|string|max:50',
            'status' => 'sometimes|required|in:admitted,discharged,transferred,active',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $admission->update($request->validated());

            return response()->json([
                'message' => 'Patient admission updated successfully',
                'admission' => $admission->load(['patient', 'admittedBy'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update patient admission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified patient admission.
     */
    public function destroy($birthcare_id, PatientAdmission $admission): JsonResponse
    {
        try {
            $admission->delete();
            
            return response()->json([
                'message' => 'Patient admission deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete patient admission',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
