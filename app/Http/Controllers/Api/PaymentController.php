<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\PaymentResource;
use App\Models\Contract;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends ApiController
{
    public function store(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        $payment = $contract->payments()->create($validated);
        $payment->load('recorder');

        return $this->success(new PaymentResource($payment), 'Payment recorded.', 201);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return $this->success(null, 'Payment deleted.');
    }
}
