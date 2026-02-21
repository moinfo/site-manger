<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CashInflowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'date' => $this->date?->toDateString(),
            'source' => $this->source,
            'amount' => (float) $this->amount,
            'notes' => $this->notes,
            'recorded_by' => $this->recorded_by,
            'project' => new ProjectResource($this->whenLoaded('project')),
            'recorder' => new UserResource($this->whenLoaded('recorder')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
