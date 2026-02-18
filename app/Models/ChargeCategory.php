<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChargeCategory extends Model
{
    protected $fillable = ['name'];

    public function financialCharges(): HasMany
    {
        return $this->hasMany(FinancialCharge::class);
    }
}
