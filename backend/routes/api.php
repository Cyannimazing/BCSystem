<?php

use App\Http\Controllers\Admin\BirthcareApplicationController;
use App\Http\Controllers\Owner\BirthcareController;
use App\Http\Controllers\Staff\BirthCareRoleController;
use App\Http\Controllers\Staff\PermissionController;
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
});