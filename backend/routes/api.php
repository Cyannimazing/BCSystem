<?php

use App\Http\Controllers\Admin\BirthcareApplicationController;
use App\Http\Controllers\Owner\BirthcareController;
use App\Http\Controllers\Staff\BirthCareRoleController;
use App\Http\Controllers\Staff\PermissionController;
use App\Http\Controllers\Staff\RoomController;
use App\Http\Controllers\SubscriptionPlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthenticated or user not found'], 401);
    }

    if ($user->system_role_id == 3) {
        $user->load('birthCareStaff.birthCare');
        $user->permissions = $user->permissions()->get()->pluck('name')->toArray();
    }

    if ($user->system_role_id == 2) {
        $user->load('birthCare');
    }
    return $user;
});
    
Route::get('/plans', [SubscriptionPlanController::class, 'index']);
Route::get('/plans/{plan}', [SubscriptionPlanController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/plans', [SubscriptionPlanController::class, 'store']);
    Route::put('/plans/{plan}', [SubscriptionPlanController::class, 'update']);
    Route::delete('/plans/{plan}', [SubscriptionPlanController::class, 'destroy']);
    
    // Owner routes - require authentication
    Route::prefix('owner')->group(function () {
        // Subscription
        Route::get('/subscription', [BirthcareController::class, 'getSubscription']);
        
        // Birthcare
        Route::get('/birthcare', [BirthcareController::class, 'getBirthcare']);
        Route::post('/register-birthcare', [BirthcareController::class, 'register']);
        Route::put('/birthcare/{id}', [BirthcareController::class, 'update']);
        Route::get('/birthcare/approval-status', [BirthcareController::class, 'checkApprovalStatus']);
    });
    
    // Admin routes - require authentication and admin role
    Route::prefix('admin')->group(function () {
        // Birthcare applications
        Route::get('/birthcare-applications', [BirthcareApplicationController::class, 'index']);
        Route::get('/birthcare-applications/{id}', [BirthcareApplicationController::class, 'show']);
        Route::post('/birthcare-applications/{id}/approve', [BirthcareApplicationController::class, 'approve']);
        Route::post('/birthcare-applications/{id}/reject', [BirthcareApplicationController::class, 'reject']);
        
        // Document download
        Route::get('/birthcare-documents/{id}/download', [BirthcareApplicationController::class, 'downloadDocument']);
    });
    
    // Permission routes
    Route::get('/permissions', [PermissionController::class, 'index']);
    
    // BirthCare Role management routes
    Route::get('/birthcare/{birthcare_id}/roles', [BirthCareRoleController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/roles', [BirthCareRoleController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/roles/{role}', [BirthCareRoleController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/roles/{role}', [BirthCareRoleController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/roles/{role}', [BirthCareRoleController::class, 'destroy']);

    // Staff management routes
    Route::get('/birthcare/{birthcare_id}/staff', [\App\Http\Controllers\Staff\StaffController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/staff', [\App\Http\Controllers\Staff\StaffController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/staff/{staff}', [\App\Http\Controllers\Staff\StaffController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/staff/{staff}', [\App\Http\Controllers\Staff\StaffController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/staff/{staff}', [\App\Http\Controllers\Staff\StaffController::class, 'destroy']);
    
    // Patient management routes
    Route::get('/birthcare/{birthcare_id}/patients', [\App\Http\Controllers\Staff\PatientController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/patients', [\App\Http\Controllers\Staff\PatientController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/patients/{patient}', [\App\Http\Controllers\Staff\PatientController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/patients/{patient}', [\App\Http\Controllers\Staff\PatientController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/patients/{patient}', [\App\Http\Controllers\Staff\PatientController::class, 'destroy']);
    
    // Prenatal visit management routes
    Route::get('/birthcare/{birthcare_id}/prenatal-visits', [\App\Http\Controllers\Staff\PrenatalVisitController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/prenatal-visits', [\App\Http\Controllers\Staff\PrenatalVisitController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/prenatal-visits/{visit}', [\App\Http\Controllers\Staff\PrenatalVisitController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/prenatal-visits/{visit}', [\App\Http\Controllers\Staff\PrenatalVisitController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/prenatal-visits/{visit}', [\App\Http\Controllers\Staff\PrenatalVisitController::class, 'destroy']);
    
    // Prenatal form routes
    Route::get('/birthcare/{birthcare_id}/prenatal-forms', [\App\Http\Controllers\Staff\PrenatalFormController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/prenatal-forms', [\App\Http\Controllers\Staff\PrenatalFormController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/prenatal-forms/{form}', [\App\Http\Controllers\Staff\PrenatalFormController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/prenatal-forms/{form}', [\App\Http\Controllers\Staff\PrenatalFormController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/prenatal-forms/{form}', [\App\Http\Controllers\Staff\PrenatalFormController::class, 'destroy']);
    
    // Patient documents routes
    Route::get('/birthcare/{birthcare_id}/patient-documents', [\App\Http\Controllers\PatientDocumentController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/patient-documents', [\App\Http\Controllers\PatientDocumentController::class, 'store']);
    Route::post('/birthcare/{birthcare_id}/patient-documents/from-data', [\App\Http\Controllers\PatientDocumentController::class, 'storeFromData']);
    Route::get('/birthcare/{birthcare_id}/patient-documents/{document}', [\App\Http\Controllers\PatientDocumentController::class, 'show']);
    Route::get('/birthcare/{birthcare_id}/patient-documents/{document}/download', [\App\Http\Controllers\PatientDocumentController::class, 'download']);
    Route::get('/birthcare/{birthcare_id}/patient-documents/{document}/view', [\App\Http\Controllers\PatientDocumentController::class, 'view']);
    Route::delete('/birthcare/{birthcare_id}/patient-documents/{document}', [\App\Http\Controllers\PatientDocumentController::class, 'destroy']);
    
    // Patient-specific document routes
    Route::get('/birthcare/{birthcare_id}/patients/{patient}/documents', [\App\Http\Controllers\PatientDocumentController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/patients/{patient}/documents', [\App\Http\Controllers\PatientDocumentController::class, 'store']);
    
    // Patient admission routes
    Route::get('/birthcare/{birthcare_id}/patient-admissions', [\App\Http\Controllers\PatientAdmissionController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/patient-admissions', [\App\Http\Controllers\PatientAdmissionController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/patient-admissions/{admission}', [\App\Http\Controllers\PatientAdmissionController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/patient-admissions/{admission}', [\App\Http\Controllers\PatientAdmissionController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/patient-admissions/{admission}', [\App\Http\Controllers\PatientAdmissionController::class, 'destroy']);
    
    // Prenatal scheduling routes (legacy)
    Route::get('/birthcare/{birthcare_id}/prenatal-calendar', [\App\Http\Controllers\Staff\PatientController::class, 'getCalendarData']);
    Route::get('/birthcare/{birthcare_id}/todays-visits', [\App\Http\Controllers\Staff\PatientController::class, 'getTodaysVisits']);
    
    // Patient referral routes
    Route::get('/birthcare/{birthcare_id}/referrals', [\App\Http\Controllers\ReferralController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/referrals', [\App\Http\Controllers\ReferralController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/referrals/stats', [\App\Http\Controllers\ReferralController::class, 'stats']);
    Route::get('/birthcare/{birthcare_id}/referrals/{referral}', [\App\Http\Controllers\ReferralController::class, 'show']);
    Route::get('/birthcare/{birthcare_id}/referrals/{referral}/pdf', [\App\Http\Controllers\ReferralController::class, 'generatePDF']);
    Route::put('/birthcare/{birthcare_id}/referrals/{referral}', [\App\Http\Controllers\ReferralController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/referrals/{referral}', [\App\Http\Controllers\ReferralController::class, 'destroy']);
    
    // Patient charges routes
    Route::get('/birthcare/{birthcare_id}/billing', [\App\Http\Controllers\BillingController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/billing', [\App\Http\Controllers\BillingController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/billing/{charge}', [\App\Http\Controllers\BillingController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/billing/{charge}', [\App\Http\Controllers\BillingController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/billing/{charge}', [\App\Http\Controllers\BillingController::class, 'destroy']);
    
    // Payments routes
    Route::get('/birthcare/{birthcare_id}/payments/dashboard', [\App\Http\Controllers\PaymentsController::class, 'dashboard']);
    Route::get('/birthcare/{birthcare_id}/payments/patients', [\App\Http\Controllers\PaymentsController::class, 'getPatients']);
    Route::get('/birthcare/{birthcare_id}/payments/services', [\App\Http\Controllers\PaymentsController::class, 'getPatientCharges']);
    Route::get('/birthcare/{birthcare_id}/payments', [\App\Http\Controllers\PaymentsController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/payments', [\App\Http\Controllers\PaymentsController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/payments/{bill}', [\App\Http\Controllers\PaymentsController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/payments/{bill}', [\App\Http\Controllers\PaymentsController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/payments/{bill}', [\App\Http\Controllers\PaymentsController::class, 'destroy']);
    Route::patch('/birthcare/{birthcare_id}/payments/{bill}/status', [\App\Http\Controllers\PaymentsController::class, 'updateStatus']);
    Route::post('/birthcare/{birthcare_id}/payments/{bill}/payments', [\App\Http\Controllers\PaymentsController::class, 'addPayment']);
    
    // Birth care facility details route
    Route::get('/birthcare/{id}', [\App\Http\Controllers\BirthCareController::class, 'show']);
    
    // Labor monitoring routes
    Route::get('/birthcare/{birthcare_id}/labor-monitoring', [\App\Http\Controllers\LaborMonitoringController::class, 'index']);
    Route::post('/birthcare/{birthcare_id}/labor-monitoring', [\App\Http\Controllers\LaborMonitoringController::class, 'store']);
    Route::get('/birthcare/{birthcare_id}/labor-monitoring/{entry}', [\App\Http\Controllers\LaborMonitoringController::class, 'show']);
    Route::put('/birthcare/{birthcare_id}/labor-monitoring/{entry}', [\App\Http\Controllers\LaborMonitoringController::class, 'update']);
    Route::delete('/birthcare/{birthcare_id}/labor-monitoring/{entry}', [\App\Http\Controllers\LaborMonitoringController::class, 'destroy']);
    
    // Room management routes
    Route::get('/birthcare/{birthcare_Id}/rooms', [RoomController::class, 'index']);
    Route::post('/birthcare/{birthcare_Id}/rooms', [RoomController::class, 'store']);
    Route::get('/birthcare/{birthcare_Id}/rooms/{room}', [RoomController::class, 'show']);
    Route::put('/birthcare/{birthcare_Id}/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/birthcare/{birthcare_Id}/rooms/{room}', [RoomController::class, 'destroy']);
    Route::get('/birthcare/{birthcare_Id}/rooms/{roomId}/beds', [RoomController::class, 'getBeds']);
    
});
