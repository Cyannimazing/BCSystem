<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Referral;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Patient;

class ReferralController extends Controller
{
    /**
     * Display a listing of referrals.
     */
    public function index(Request $request, $birthcare_id): JsonResponse
    {
        $query = Referral::with(['patient', 'createdBy'])
            ->where('birth_care_id', $birthcare_id);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->search($search);
        }

        if ($request->filled('status')) {
            $query->withStatus($request->get('status'));
        }

        if ($request->filled('urgency_level')) {
            $query->where('urgency_level', $request->get('urgency_level'));
        }

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->get('patient_id'));
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->where('referral_date', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('referral_date', '<=', $request->get('date_to'));
        }

        $referrals = $query->orderBy('referral_date', 'desc')
                          ->orderBy('referral_time', 'desc')
                          ->paginate(15);

        return response()->json($referrals);
    }

    /**
     * Store a newly created referral.
     */
    public function store(Request $request, $birthcare_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'referring_facility' => 'required|string|max:255',
            'referring_physician' => 'required|string|max:255',
            'referring_physician_contact' => 'nullable|string|max:255',
            'receiving_facility' => 'required|string|max:255',
            'receiving_physician' => 'nullable|string|max:255',
            'receiving_physician_contact' => 'nullable|string|max:255',
            'referral_date' => 'required|date',
            'referral_time' => 'required|date_format:H:i',
            'urgency_level' => 'required|in:routine,urgent,emergency,critical',
            'reason_for_referral' => 'required|string',
            'clinical_summary' => 'nullable|string',
            'current_diagnosis' => 'nullable|string',
            'relevant_history' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'vital_signs' => 'nullable|string',
            'laboratory_results' => 'nullable|string',
            'imaging_results' => 'nullable|string',
            'treatment_provided' => 'nullable|string',
            'patient_condition' => 'nullable|string|max:100',
            'transportation_mode' => 'required|in:ambulance,private_transport,helicopter,wheelchair,stretcher',
            'accompanies_patient' => 'nullable|string|max:255',
            'special_instructions' => 'nullable|string',
            'equipment_required' => 'nullable|string|max:255',
            'isolation_precautions' => 'nullable|string|max:255',
            'anticipated_care_level' => 'nullable|string|max:100',
            'expected_duration' => 'nullable|string|max:255',
            'insurance_information' => 'nullable|string',
            'family_contact_name' => 'nullable|string|max:255',
            'family_contact_phone' => 'nullable|string|max:50',
            'family_contact_relationship' => 'nullable|string|max:100',
            'status' => 'required|in:pending,accepted,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $referral = Referral::create([
                'patient_id' => $request->patient_id,
                'birth_care_id' => $birthcare_id,
                'referring_facility' => $request->referring_facility,
                'referring_physician' => $request->referring_physician,
                'referring_physician_contact' => $request->referring_physician_contact,
                'receiving_facility' => $request->receiving_facility,
                'receiving_physician' => $request->receiving_physician,
                'receiving_physician_contact' => $request->receiving_physician_contact,
                'referral_date' => $request->referral_date,
                'referral_time' => $request->referral_time,
                'urgency_level' => $request->urgency_level,
                'reason_for_referral' => $request->reason_for_referral,
                'clinical_summary' => $request->clinical_summary,
                'current_diagnosis' => $request->current_diagnosis,
                'relevant_history' => $request->relevant_history,
                'current_medications' => $request->current_medications,
                'allergies' => $request->allergies,
                'vital_signs' => $request->vital_signs,
                'laboratory_results' => $request->laboratory_results,
                'imaging_results' => $request->imaging_results,
                'treatment_provided' => $request->treatment_provided,
                'patient_condition' => $request->patient_condition,
                'transportation_mode' => $request->transportation_mode,
                'accompanies_patient' => $request->accompanies_patient,
                'special_instructions' => $request->special_instructions,
                'equipment_required' => $request->equipment_required,
                'isolation_precautions' => $request->isolation_precautions,
                'anticipated_care_level' => $request->anticipated_care_level,
                'expected_duration' => $request->expected_duration,
                'insurance_information' => $request->insurance_information,
                'family_contact_name' => $request->family_contact_name,
                'family_contact_phone' => $request->family_contact_phone,
                'family_contact_relationship' => $request->family_contact_relationship,
                'status' => $request->status ?? 'pending',
                'notes' => $request->notes,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Referral created successfully',
                'data' => $referral->load(['patient', 'createdBy'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to create referral',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified referral.
     */
    public function show($birthcare_id, Referral $referral): JsonResponse
    {
        $referral->load(['patient', 'createdBy', 'updatedBy']);
        return response()->json($referral);
    }

    /**
     * Update the specified referral.
     */
    public function update(Request $request, $birthcare_id, Referral $referral): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|required|exists:patients,id',
            'referring_facility' => 'sometimes|required|string|max:255',
            'referring_physician' => 'sometimes|required|string|max:255',
            'referring_physician_contact' => 'nullable|string|max:255',
            'receiving_facility' => 'sometimes|required|string|max:255',
            'receiving_physician' => 'nullable|string|max:255',
            'receiving_physician_contact' => 'nullable|string|max:255',
            'referral_date' => 'sometimes|required|date',
            'referral_time' => 'sometimes|required|date_format:H:i',
            'urgency_level' => 'sometimes|required|in:routine,urgent,emergency,critical',
            'reason_for_referral' => 'sometimes|required|string',
            'clinical_summary' => 'nullable|string',
            'current_diagnosis' => 'nullable|string',
            'relevant_history' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'vital_signs' => 'nullable|string',
            'laboratory_results' => 'nullable|string',
            'imaging_results' => 'nullable|string',
            'treatment_provided' => 'nullable|string',
            'patient_condition' => 'nullable|string|max:100',
            'transportation_mode' => 'sometimes|required|in:ambulance,private_transport,helicopter,wheelchair,stretcher',
            'accompanies_patient' => 'nullable|string|max:255',
            'special_instructions' => 'nullable|string',
            'equipment_required' => 'nullable|string|max:255',
            'isolation_precautions' => 'nullable|string|max:255',
            'anticipated_care_level' => 'nullable|string|max:100',
            'expected_duration' => 'nullable|string|max:255',
            'insurance_information' => 'nullable|string',
            'family_contact_name' => 'nullable|string|max:255',
            'family_contact_phone' => 'nullable|string|max:50',
            'family_contact_relationship' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:pending,accepted,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $updateData = $request->all();
            $updateData['updated_by'] = auth()->id();

            $referral->update($updateData);

            DB::commit();

            return response()->json([
                'message' => 'Referral updated successfully',
                'data' => $referral->load(['patient', 'createdBy', 'updatedBy'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to update referral',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified referral.
     */
    public function destroy($birthcare_id, Referral $referral): JsonResponse
    {
        try {
            DB::beginTransaction();
            
            $referral->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Referral deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to delete referral',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF for the specified referral.
     */
    public function generatePDF($birthcare_id, Referral $referral): Response
    {
        try {
            $referral->load(['patient', 'createdBy']);
            
            // Create PDF content
            $pdfContent = $this->generateReferralPDFContent($referral);
            
            // Generate filename
            $patientName = $referral->patient 
                ? str_replace(' ', '_', $referral->patient->first_name . '_' . $referral->patient->last_name)
                : 'unknown_patient';
            $filename = "referral_{$patientName}_{$referral->referral_date}.pdf";
            
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generate PDF content for referral (simplified version)
     */
    private function generateReferralPDFContent($referral): string
    {
        $html = '<html><head><title>Patient Referral Form</title></head><body>';
        $html .= '<h1 style="text-align: center; color: #3C82F6;">PATIENT REFERRAL FORM</h1>';
        
        // Patient Information
        if ($referral->patient) {
            $html .= '<h2>PATIENT INFORMATION</h2>';
            $html .= '<p><strong>Name:</strong> ' . $referral->patient->first_name . ' ' . ($referral->patient->middle_name ?? '') . ' ' . $referral->patient->last_name . '</p>';
            if ($referral->patient->date_of_birth) {
                $html .= '<p><strong>Date of Birth:</strong> ' . $referral->patient->date_of_birth . '</p>';
            }
            if ($referral->patient->phone_number) {
                $html .= '<p><strong>Phone:</strong> ' . $referral->patient->phone_number . '</p>';
            }
        }
        
        // Referral Information
        $html .= '<h2>REFERRAL DETAILS</h2>';
        $html .= '<p><strong>Date:</strong> ' . $referral->referral_date . ' <strong>Time:</strong> ' . $referral->referral_time . '</p>';
        $html .= '<p><strong>Urgency Level:</strong> ' . strtoupper($referral->urgency_level) . '</p>';
        
        // Facilities
        $html .= '<h3>Referring Facility:</h3>';
        $html .= '<p><strong>Facility:</strong> ' . $referral->referring_facility . '</p>';
        $html .= '<p><strong>Physician:</strong> ' . $referral->referring_physician . '</p>';
        if ($referral->referring_physician_contact) {
            $html .= '<p><strong>Contact:</strong> ' . $referral->referring_physician_contact . '</p>';
        }
        
        $html .= '<h3>Receiving Facility:</h3>';
        $html .= '<p><strong>Facility:</strong> ' . $referral->receiving_facility . '</p>';
        if ($referral->receiving_physician) {
            $html .= '<p><strong>Physician:</strong> ' . $referral->receiving_physician . '</p>';
        }
        
        // Clinical Information
        $html .= '<h2>CLINICAL INFORMATION</h2>';
        $html .= '<p><strong>Reason for Referral:</strong></p>';
        $html .= '<p>' . nl2br(htmlspecialchars($referral->reason_for_referral)) . '</p>';
        
        if ($referral->clinical_summary) {
            $html .= '<p><strong>Clinical Summary:</strong></p>';
            $html .= '<p>' . nl2br(htmlspecialchars($referral->clinical_summary)) . '</p>';
        }
        
        if ($referral->current_diagnosis) {
            $html .= '<p><strong>Current Diagnosis:</strong></p>';
            $html .= '<p>' . nl2br(htmlspecialchars($referral->current_diagnosis)) . '</p>';
        }
        
        // Transfer Details
        $html .= '<h2>TRANSFER DETAILS</h2>';
        if ($referral->patient_condition) {
            $html .= '<p><strong>Patient Condition:</strong> ' . $referral->patient_condition . '</p>';
        }
        $html .= '<p><strong>Transportation Mode:</strong> ' . $referral->transportation_mode . '</p>';
        
        if ($referral->special_instructions) {
            $html .= '<p><strong>Special Instructions:</strong></p>';
            $html .= '<p>' . nl2br(htmlspecialchars($referral->special_instructions)) . '</p>';
        }
        
        // Footer
        $html .= '<hr><p style="font-size: 10px; color: #666;">Generated on: ' . now()->format('Y-m-d H:i:s') . '</p>';
        $html .= '</body></html>';
        
        // For now, return simple HTML. In production, you'd use a proper PDF library
        // like TCPDF or DomPDF to convert HTML to PDF
        return $html;
    }

    /**
     * Get referrals statistics for dashboard.
     */
    public function stats($birthcare_id): JsonResponse
    {
        try {
            $stats = [
                'total_referrals' => Referral::where('birth_care_id', $birthcare_id)->count(),
                'pending_referrals' => Referral::where('birth_care_id', $birthcare_id)->where('status', 'pending')->count(),
                'completed_referrals' => Referral::where('birth_care_id', $birthcare_id)->where('status', 'completed')->count(),
                'urgent_referrals' => Referral::where('birth_care_id', $birthcare_id)->where('urgency_level', 'urgent')->count(),
                'emergency_referrals' => Referral::where('birth_care_id', $birthcare_id)->where('urgency_level', 'emergency')->count(),
                'recent_referrals' => Referral::with(['patient'])
                    ->where('birth_care_id', $birthcare_id)
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get referrals statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
