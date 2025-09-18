<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientAdmission extends Model
{
    protected $fillable = [
        'patient_id',
        'birth_care_id',
        'admission_date',
        'admission_time',
        'admission_type',
        'chief_complaint',
        'present_illness',
        'medical_history',
        'allergies',
        'current_medications',
        'vital_signs_temperature',
        'vital_signs_blood_pressure',
        'vital_signs_heart_rate',
        'vital_signs_respiratory_rate',
        'vital_signs_oxygen_saturation',
        'weight',
        'height',
        'physical_examination',
        'initial_diagnosis',
        'treatment_plan',
        'attending_physician',
        'room_number',
        'bed_number',
        'status',
        'notes',
        'admitted_by',
    ];

    protected $casts = [
        'admission_date' => 'date',
        'admission_time' => 'datetime:H:i',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
    ];

    // Relationships
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function birthCare(): BelongsTo
    {
        return $this->belongsTo(BirthCare::class);
    }

    public function admittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admitted_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAdmitted($query)
    {
        return $query->where('status', 'admitted');
    }

    public function scopeByBirthCare($query, $birthCareId)
    {
        return $query->where('birth_care_id', $birthCareId);
    }

    // Helper methods
    public function getFormattedAdmissionDateTimeAttribute()
    {
        return $this->admission_date->format('M d, Y') . ' at ' . $this->admission_time->format('H:i');
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'admitted' => 'bg-green-100 text-green-800',
            'active' => 'bg-blue-100 text-blue-800',
            'discharged' => 'bg-gray-100 text-gray-800',
            'transferred' => 'bg-yellow-100 text-yellow-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}
