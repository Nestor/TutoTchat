<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/conversations', 'Api\ConversationsController@index');
Route::post('/conversations/{message}/seen', 'Api\ConversationsController@seen')->middleware('can:read,message');
Route::get('/conversations/{id}', 'Api\ConversationsController@show');
Route::post('/conversations', 'Api\ConversationsController@store');
