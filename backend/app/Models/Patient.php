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
        'first_name',
        'middle_name', 
        'last_name',
        'date_of_birth',
        'age',
        'civil_status',
        'religion',
        'occupation',
        'address',
        'contact_number',
        'emergency_contact_name',
        'emergency_contact_number',
        'husband_first_name',
        'husband_middle_name',
        'husband_last_name',
        'husband_date_of_birth',
        'husband_age',
        'husband_occupation',
        'lmp',
        'edc',
        'gravida',
        'para',
        'term',
        'preterm',
        'abortion',
        'living_children',
        'philhealth_number',
        'philhealth_category',
        'philhealth_dependent_name',
        'philhealth_dependent_relation',
        'philhealth_dependent_id',
        'medical_history',
        'allergies',
        'current_medications',
        'previous_pregnancies',
        'status',
        'notes'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'husband_date_of_birth' => 'date',
        'lmp' => 'date',
        'edc' => 'date',
        'age' => 'integer',
        'husband_age' => 'integer',
        'gravida' => 'integer',
        'para' => 'integer',
        'term' => 'integer',
        'preterm' => 'integer',
        'abortion' => 'integer',
        'living_children' => 'integer'
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

    public function getHusbandFullNameAttribute(): ?string
    {
        if (!$this->husband_first_name) {
            return null;
        }
        return trim($this->husband_first_name . ' ' . $this->husband_middle_name . ' ' . $this->husband_last_name);
    }

    // Helper method to automatically schedule prenatal visits based on LMP
    public function schedulePrenatalVisits()
    {
        if (!$this->lmp) {
            return;
        }

        $visits = [
            ['number' => 1, 'name' => 'First visit (before 12 weeks)', 'week' => 8],
            ['number' => 2, 'name' => 'Second visit', 'week' => 20],
            ['number' => 3, 'name' => 'Third visit', 'week' => 26],
            ['number' => 4, 'name' => 'Fourth visit', 'week' => 30],
            ['number' => 5, 'name' => 'Fifth visit', 'week' => 34],
            ['number' => 6, 'name' => 'Sixth visit', 'week' => 36],
            ['number' => 7, 'name' => 'Seventh visit', 'week' => 38],
            ['number' => 8, 'name' => 'Eighth visit', 'week' => 40],
        ];

        foreach ($visits as $visit) {
            $scheduledDate = Carbon::parse($this->lmp)->addWeeks($visit['week']);
            
            PrenatalVisit::create([
                'patient_id' => $this->id,
                'visit_number' => $visit['number'],
                'visit_name' => $visit['name'],
                'recommended_week' => $visit['week'],
                'scheduled_date' => $scheduledDate,
                'status' => 'Scheduled'
            ]);
        }
    }
}
