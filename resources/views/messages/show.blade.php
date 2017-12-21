@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            @include('messages.users', ['users' => $users, 'unread' => $unread_count])
            <div class="col-md-9">
                <div class="card">
                    <div class="card-header">{{ $user->name }}</div>
                    <div class="card-body conversations">
                        @if($messages->hasMorePages())
                            <div class="text-center">
                                <a href="{{ $messages->previousPageUrl() }}" class="btn btn-light">
                                    <span class="oi oi-expand-up"></span>
                                    Voir les messages précédents
                                </a>
                            </div>
                        @endif
                        @foreach($messages as $message)
                            <div class="row">
                                <div
                                    class="col-md-10 {{ $message->from->id !== $user->id ? 'offset-md-2 text-right' : '' }}">
                                    <p>
                                        <strong>{{ $message->from->id === $user->id ? $message->from->name : 'Moi' }}</strong><br>
                                        {!! nl2br(e($message->content)) !!}
                                    </p>
                                </div>
                            </div>
                            <hr>
                        @endforeach
                        @if($messages->previousPageUrl())
                            <div class="text-center">
                                <a href="{{ $messages->previousPageUrl() }}" class="btn btn-light">
                                    <span class="oi oi-expand-down"></span>
                                    Voir les messages suivants
                                </a>
                            </div>
                        @endif
                        <h5>Envoyer un message</h5>
                        <form method="post">
                            {{ csrf_field() }}
                            <div class="form-group">
                                <textarea placeholder="Ecrivez un message" class="form-control" name="content" id="" rows="3"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Envoyer</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
