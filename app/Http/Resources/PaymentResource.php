<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contract_id' => $this->contract_id,
            'date' => $this->date?->toDateString(),
            'amount' => (float) $this->amount,
            'notes' => $this->notes,
            'recorded_by' => $this->recorded_by,
            'recorder' => new UserResource($this->whenLoaded('recorder')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
