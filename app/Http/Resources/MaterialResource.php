<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'date' => $this->date?->toDateString(),
            'description' => $this->description,
            'quantity' => (float) $this->quantity,
            'unit' => $this->unit,
            'unit_price' => (float) $this->unit_price,
            'subtotal' => (float) $this->subtotal,
            'category' => $this->category,
            'recorded_by' => $this->recorded_by,
            'project' => new ProjectResource($this->whenLoaded('project')),
            'recorder' => new UserResource($this->whenLoaded('recorder')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
