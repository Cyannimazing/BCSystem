<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Patient extends Model
{
    protected $fillable = [
        'birth_care_id',
        'facility_name',
        'first_name',
        'middle_name', 
        'last_name',
        'date_of_birth',
        'age',
        'civil_status',
        'address',
        'contact_number',
        'philhealth_number',
        'philhealth_category',
        'philhealth_dependent_name',
        'philhealth_dependent_relation',
        'philhealth_dependent_id',
        'status'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'age' => 'integer'
    ];

    // Relationships
    public function birthCare(): BelongsTo
    {
        return $this->belongsTo(BirthCare::class);
    }

    public function prenatalVisits(): HasMany
    {
        return $this->hasMany(PrenatalVisit::class);
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name);
    }

}
