<?php

use App\Http\Controllers\CashInflowController;
use App\Http\Controllers\FinancialChargeController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SubcontractorController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

// Authenticated routes
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Projects
    Route::resource('projects', ProjectController::class);

    // Expenses (Materials)
    Route::resource('expenses', MaterialController::class);

    // Subcontractors
    Route::resource('subcontractors', SubcontractorController::class);

    // Contracts (nested under subcontractors)
    Route::post('/subcontractors/{subcontractor}/contracts', [ContractController::class, 'store'])->name('contracts.store');
    Route::put('/contracts/{contract}', [ContractController::class, 'update'])->name('contracts.update');
    Route::delete('/contracts/{contract}', [ContractController::class, 'destroy'])->name('contracts.destroy');

    // Payments (nested under contracts)
    Route::post('/contracts/{contract}/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::delete('/payments/{payment}', [PaymentController::class, 'destroy'])->name('payments.destroy');

    // Cash Flow
    Route::get('/cashflow', [CashInflowController::class, 'index'])->name('cashflow.index');
    Route::post('/cashflow', [CashInflowController::class, 'store'])->name('cashflow.store');
    Route::delete('/cashflow/{cashInflow}', [CashInflowController::class, 'destroy'])->name('cashflow.destroy');

    // Financial Charges
    Route::resource('charges', FinancialChargeController::class)->except(['show']);
    Route::post('/charge-categories', [FinancialChargeController::class, 'storeCategory'])->name('charge-categories.store');
    Route::delete('/charge-categories/{chargeCategory}', [FinancialChargeController::class, 'destroyCategory'])->name('charge-categories.destroy');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/monthly', [ReportController::class, 'monthly'])->name('reports.monthly');
    Route::get('/reports/subcontractors', [ReportController::class, 'subcontractors'])->name('reports.subcontractors');
    Route::get('/reports/cashflow', [ReportController::class, 'cashflow'])->name('reports.cashflow');
    Route::get('/reports/project-statement', [ReportController::class, 'projectStatement'])->name('reports.project-statement');
    Route::get('/reports/export/{type}', [ReportController::class, 'export'])->name('reports.export');

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::get('/import', [ImportController::class, 'index'])->name('import.index');
        Route::post('/import', [ImportController::class, 'store'])->name('import.store');
    });
});

require __DIR__.'/auth.php';
