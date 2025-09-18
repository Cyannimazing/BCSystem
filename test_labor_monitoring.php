<?php

// Simple test script to diagnose labor monitoring issues
require_once 'backend/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Bootstrap Laravel
$app = require_once 'backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Labor Monitoring Diagnostic ===\n\n";

try {
    // Check if table exists
    echo "1. Checking if labor_monitoring table exists...\n";
    if (Schema::hasTable('labor_monitoring')) {
        echo "✓ Table exists\n";
        
        // Check table structure
        $columns = Schema::getColumnListing('labor_monitoring');
        echo "   Columns: " . implode(', ', $columns) . "\n";
    } else {
        echo "✗ Table does not exist\n";
        exit(1);
    }
    
    // Check if we have any patients
    echo "\n2. Checking patients...\n";
    $patientCount = DB::table('patients')->count();
    echo "   Total patients: $patientCount\n";
    
    if ($patientCount > 0) {
        $samplePatient = DB::table('patients')->first();
        echo "   Sample patient ID: {$samplePatient->id}\n";
        echo "   Birth care ID: {$samplePatient->birth_care_id}\n";
    }
    
    // Check if we have any labor monitoring entries
    echo "\n3. Checking labor monitoring entries...\n";
    $entryCount = DB::table('labor_monitoring')->count();
    echo "   Total entries: $entryCount\n";
    
    // Check if route exists by examining api routes
    echo "\n4. Checking API routes...\n";
    $routes = app('router')->getRoutes();
    $laborRoutes = [];
    foreach ($routes as $route) {
        $uri = $route->uri();
        if (strpos($uri, 'labor-monitoring') !== false) {
            $laborRoutes[] = $route->methods()[0] . ' ' . $uri;
        }
    }
    
    if (!empty($laborRoutes)) {
        echo "✓ Labor monitoring routes found:\n";
        foreach ($laborRoutes as $route) {
            echo "   - $route\n";
        }
    } else {
        echo "✗ No labor monitoring routes found\n";
    }

    echo "\n=== Diagnostic Complete ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}