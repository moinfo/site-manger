<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FinancialChargeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'charge_category_id' => $this->charge_category_id,
            'date' => $this->date?->toDateString(),
            'amount' => (float) $this->amount,
            'description' => $this->description,
            'recorded_by' => $this->recorded_by,
            'project' => new ProjectResource($this->whenLoaded('project')),
            'category' => new ChargeCategoryResource($this->whenLoaded('category')),
            'recorder' => new UserResource($this->whenLoaded('recorder')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
