<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BirthCareSubscription extends Model
{
    protected $fillable = ['user_id', 'plan_id', 'start_date', 'end_date', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }
}