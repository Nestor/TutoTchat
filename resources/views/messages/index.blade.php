@extends('layouts.app')

@section('content')
    <div class="container">
        <div id="conversations" data-base="{{ route('messages', [], false) }}" data-userid="{{ Auth::user()->id }}"></div>
    </div>
@endsection
