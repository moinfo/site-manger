<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Project extends Model
{
    protected $fillable = [
        'name',
        'location',
        'start_date',
        'end_date',
        'budget',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'budget' => 'decimal:2',
        ];
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function cashInflows(): HasMany
    {
        return $this->hasMany(CashInflow::class);
    }

    public function getTotalSpentAttribute(): float
    {
        return $this->materials()->sum('subtotal');
    }

    public function getTotalReceivedAttribute(): float
    {
        return $this->cashInflows()->sum('amount');
    }
}
