<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subcontractor_id' => $this->subcontractor_id,
            'project_id' => $this->project_id,
            'description' => $this->description,
            'billed_amount' => (float) $this->billed_amount,
            'status' => $this->status,
            'total_paid' => (float) $this->total_paid,
            'balance' => (float) $this->balance,
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'project' => new ProjectResource($this->whenLoaded('project')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
