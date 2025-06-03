<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\RegisterBirthcareRequest;
use App\Models\BirthCare;
use App\Models\BirthCareDocument;
use App\Models\BirthCareSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class BirthcareController extends Controller
{
    /**
     * Get the current user's subscription status
     */
    public function getSubscription(Request $request)
    {
        $user = $request->user();
        
        $subscription = BirthCareSubscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->first();
        
        if (!$subscription) {
            return response()->json([
                'status' => 'inactive',
                'message' => 'No active subscription found.'
            ]);
        }
        
        return response()->json([
            'status' => 'active',
            'subscription' => $subscription,
            'expires_at' => $subscription->expires_at,
        ]);
    }
    
    /**
     * Get the current user's birthcare
     */
    public function getBirthcare(Request $request)
    {
        $user = $request->user();
        
        $birthcare = BirthCare::with('documents')
            ->where('user_id', $user->id)
            ->first();
        
        if (!$birthcare) {
            return response()->json([
                'message' => 'No birthcare found for this user.'
            ], 404);
        }
        
        // Add document URLs for frontend display
        foreach ($birthcare->documents as $document) {
            $document->url = Storage::url($document->document_path);
        }
        
        return response()->json($birthcare);
    }
    
    /**
     * Register a new birthcare
     */
    public function register(RegisterBirthcareRequest $request)
    {
        $user = $request->user();
        
        // Check if user already has a birthcare
        $existingBirthcare = BirthCare::where('user_id', $user->id)->first();
        if ($existingBirthcare) {
            return response()->json([
                'message' => 'You already have a registered birthcare facility.'
            ], 409);
        }
        
        // Begin transaction to ensure all related records are created together
        DB::beginTransaction();
        
        try {
            // Create the birthcare record
            $birthcare = BirthCare::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'description' => $request->description,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'is_public' => false, // Default to not public
                'status' => 'pending', // Default status is pending
            ]);
            
            // Process and store the documents
            $documentTypes = [
                'business_permit' => 'Business Permit',
                'doh_cert' => 'DOH Certificate',
                'philhealth_cert' => 'PhilHealth Certificate',
            ];
            
            foreach ($documentTypes as $key => $type) {
                if ($request->hasFile($key)) {
                    $file = $request->file($key);
                    // Create unique filename
                    $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                    // Store file in appropriate directory
                    $path = $file->storeAs(
                        'birthcare_documents/' . $birthcare->id,
                        $filename,
                        'public'
                    );
                    
                    // Create document record
                    BirthCareDocument::create([
                        'birth_care_id' => $birthcare->id,
                        'document_type' => $type,
                        'document_path' => $path,
                        'timestamp' => now(),
                    ]);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Birthcare facility registered successfully and pending admin approval.',
                'birthcare' => $birthcare
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Log error for debugging
            Log::error('Birthcare registration failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to register birthcare facility. Please try again.'
            ], 500);
        }
    }
    
    /**
     * Check if a user's birthcare is approved
     */
    public function checkApprovalStatus(Request $request)
    {
        $user = $request->user();
        
        $birthcare = BirthCare::where('user_id', $user->id)->first();
        
        if (!$birthcare) {
            return response()->json([
                'status' => 'not_registered',
                'message' => 'No birthcare facility found for this user.'
            ]);
        }
        
        return response()->json([
            'status' => $birthcare->status,
            'approved' => $birthcare->status === 'approved',
            'message' => $this->getStatusMessage($birthcare->status)
        ]);
    }
    
    /**
     * Get a descriptive message for each status
     */
    private function getStatusMessage($status)
    {
        switch ($status) {
            case 'pending':
                return 'Your birthcare facility registration is pending admin approval.';
            case 'approved':
                return 'Your birthcare facility registration has been approved.';
            case 'rejected':
                return 'Your birthcare facility registration has been rejected.';
            default:
                return 'Unknown status.';
        }
    }
}

