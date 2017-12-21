@extends('layouts.app')

@section('content')
    <div class="container">
        <div id="conversations" data-base="{{ route('messages', [], false) }}"></div>
    </div>
@endsection
