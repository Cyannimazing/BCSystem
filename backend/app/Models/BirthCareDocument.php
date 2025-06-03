<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BirthCareDocument extends Model
{
    protected $fillable = ['birth_care_id', 'document_type', 'document_path', 'timestamp'];

    public function birthCare()
    {
        return $this->belongsTo(BirthCare::class);
    }
}