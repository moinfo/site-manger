<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Material extends Model
{
    protected $fillable = [
        'project_id',
        'date',
        'description',
        'quantity',
        'unit',
        'unit_price',
        'subtotal',
        'category',
        'recorded_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public static function categoryOptions(): array
    {
        return [
            'cement' => 'Cement',
            'paint' => 'Paint & Finishing',
            'timber' => 'Timber & Wood',
            'electrical' => 'Electrical',
            'plumbing' => 'Plumbing',
            'steel' => 'Steel & Iron',
            'transport' => 'Transport',
            'labor' => 'Labor',
            'hardware' => 'Hardware & Tools',
            'sand_aggregate' => 'Sand & Aggregates',
            'other' => 'Other',
        ];
    }
}
