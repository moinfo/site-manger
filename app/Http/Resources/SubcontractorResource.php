<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubcontractorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'notes' => $this->notes,
            'total_billed' => (float) $this->total_billed,
            'total_paid' => (float) $this->total_paid,
            'balance' => (float) $this->balance,
            'contracts' => ContractResource::collection($this->whenLoaded('contracts')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
