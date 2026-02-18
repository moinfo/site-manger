<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        $contract->payments()->create($validated);

        return redirect()->route('subcontractors.show', $contract->subcontractor_id)
            ->with('success', 'Payment recorded.');
    }

    public function destroy(Payment $payment)
    {
        $subcontractorId = $payment->contract->subcontractor_id;
        $payment->delete();

        return redirect()->route('subcontractors.show', $subcontractorId)
            ->with('success', 'Payment deleted.');
    }
}
