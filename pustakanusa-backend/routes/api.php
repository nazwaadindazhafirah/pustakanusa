<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\EbookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SuggestionController;


Route::post('login', [AuthController::class, 'login']);

Route::apiResource('categories', CategoryController::class);
Route::apiResource('ebooks', EbookController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('suggestions', SuggestionController::class);
Route::apiResource('logs', LogController::class);
Route::get('/ebooks/{id}', [EbookController::class, 'show']);
Route::post('/download', [EbookController::class, 'download']);
Route::get('/riwayat-unduhan', [EbookController::class, 'riwayat']);
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/dashboard/monthly', [DashboardController::class, 'monthly']);
Route::get('/logs', [LogController::class, 'index']);

