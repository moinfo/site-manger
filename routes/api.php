<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CashFlowController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\FinancialChargeController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SubcontractorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Projects
    Route::apiResource('projects', ProjectController::class);

    // Expenses
    Route::get('/expenses/categories', [ExpenseController::class, 'categories']);
    Route::apiResource('expenses', ExpenseController::class);

    // Subcontractors
    Route::apiResource('subcontractors', SubcontractorController::class);

    // Contracts (nested under subcontractors for create)
    Route::post('/subcontractors/{subcontractor}/contracts', [ContractController::class, 'store']);
    Route::put('/contracts/{contract}', [ContractController::class, 'update']);
    Route::delete('/contracts/{contract}', [ContractController::class, 'destroy']);

    // Payments (nested under contracts for create)
    Route::post('/contracts/{contract}/payments', [PaymentController::class, 'store']);
    Route::delete('/payments/{payment}', [PaymentController::class, 'destroy']);

    // Cash Flow
    Route::get('/cashflow', [CashFlowController::class, 'index']);
    Route::post('/cashflow', [CashFlowController::class, 'store']);
    Route::delete('/cashflow/{cashInflow}', [CashFlowController::class, 'destroy']);

    // Financial Charges
    Route::get('/charges/categories', [FinancialChargeController::class, 'categories']);
    Route::get('/charges', [FinancialChargeController::class, 'index']);
    Route::post('/charges', [FinancialChargeController::class, 'store']);
    Route::put('/charges/{charge}', [FinancialChargeController::class, 'update']);
    Route::delete('/charges/{charge}', [FinancialChargeController::class, 'destroy']);
    Route::post('/charge-categories', [FinancialChargeController::class, 'storeCategory']);
    Route::delete('/charge-categories/{chargeCategory}', [FinancialChargeController::class, 'destroyCategory']);

    // Reports
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    Route::get('/reports/subcontractors', [ReportController::class, 'subcontractors']);
    Route::get('/reports/cashflow', [ReportController::class, 'cashflow']);
    Route::get('/reports/project-statement', [ReportController::class, 'projectStatement']);
    Route::get('/reports/export/{type}', [ReportController::class, 'export']);

    // Admin (role:admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });
});
