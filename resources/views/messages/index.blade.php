@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            @include('messages.users', ['users' => $users, 'unread' => $unread_count])
            <div class="col-md-9">
            </div>
        </div>
    </div>
@endsection
