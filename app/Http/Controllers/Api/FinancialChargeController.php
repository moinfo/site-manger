<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ChargeCategoryResource;
use App\Http\Resources\FinancialChargeResource;
use App\Models\ChargeCategory;
use App\Models\FinancialCharge;
use Illuminate\Http\Request;

class FinancialChargeController extends ApiController
{
    public function index(Request $request)
    {
        $query = FinancialCharge::with('project', 'category', 'recorder');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('category_id')) {
            $query->where('charge_category_id', $request->category_id);
        }
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $charges = $query->latest('date')->paginate(25);

        return FinancialChargeResource::collection($charges);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'charge_category_id' => 'required|exists:charge_categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        $charge = FinancialCharge::create($validated);
        $charge->load('project', 'category', 'recorder');

        return $this->success(new FinancialChargeResource($charge), 'Charge recorded.', 201);
    }

    public function update(Request $request, FinancialCharge $charge)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'charge_category_id' => 'required|exists:charge_categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $charge->update($validated);
        $charge->load('project', 'category', 'recorder');

        return $this->success(new FinancialChargeResource($charge), 'Charge updated.');
    }

    public function destroy(FinancialCharge $charge)
    {
        $charge->delete();

        return $this->success(null, 'Charge deleted.');
    }

    public function categories()
    {
        return $this->success(ChargeCategoryResource::collection(
            ChargeCategory::orderBy('name')->get()
        ));
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:charge_categories,name',
        ]);

        $category = ChargeCategory::create($validated);

        return $this->success(new ChargeCategoryResource($category), 'Category created.', 201);
    }

    public function destroyCategory(ChargeCategory $chargeCategory)
    {
        if ($chargeCategory->financialCharges()->exists()) {
            return $this->error('Cannot delete a category that has charges.', 422);
        }

        $chargeCategory->delete();

        return $this->success(null, 'Category deleted.');
    }
}
