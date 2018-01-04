<?php

namespace App\Policies;

use App\User;
use App\Message;
use Illuminate\Auth\Access\HandlesAuthorization;

class MessagePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the message.
     *
     * @param  \App\User  $user
     * @param  \App\Message  $message
     * @return mixed
     */
    public function view(User $user, Message $message)
    {
        return $user->id === $message->from_id || $user->id === $message->to_id;
    }

    public function read (User $user, Message $message)
    {
        return $user->id === $message->to_id;
    }

    /**
     * Determine whether the user can create messages.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the message.
     *
     * @param  \App\User  $user
     * @param  \App\Message  $message
     * @return mixed
     */
    public function update(User $user, Message $message)
    {
        return $message->from_id == $user->id;
    }

    /**
     * Determine whether the user can delete the message.
     *
     * @param  \App\User  $user
     * @param  \App\Message  $message
     * @return mixed
     */
    public function delete(User $user, Message $message)
    {
        return $this->update($user, $message);
    }
}
