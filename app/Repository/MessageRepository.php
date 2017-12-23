<?php

namespace App\Repository;

use App\Message;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class MessageRepository
{

    /**
     * @var Message
     */
    private $message;
    private $user;

    public function __construct(Message $message, User $user)
    {
        $this->message = $message;
        $this->user = $user;
    }

    public function getConversations(int $userId)
    {
        $users = $this->user->newQuery()
            ->select('name', 'id')
            ->where('id', '!=', $userId)
            ->get();
        $unread = $this->unreadCount($userId);
        foreach ($users as $user) {
            if (isset($unread[$user->id])) {
                $user->unread = $unread[$user->id];
            } else {
                $user->unread = 0;
            }
        }
        return $users;
    }

    /**
     * Récupère tous les messages d'une conversation
     * @param int $user1_id
     * @param int $user2_id
     * @return Builder
     */
    public function getMessagesFor(int $user1_id, int $user2_id): Builder
    {
        return $this->message->newQuery()
            ->whereRaw("((from_id = $user1_id AND to_id = $user2_id) OR (from_id = $user2_id AND to_id = $user1_id))")
            ->orderBy('created_at', 'DESC')
            ->with([
                'from' => function ($query) { $query->select('name', 'id'); }
            ]);
    }

    /**
     * Récupère le nombre de message non lu destinés à l'utilisateur (groupé par envoyeur)
     * @param int $user_id
     * @return Collection
     */
    public function unreadCount(int $user_id): Collection
    {
        return $this->message->newQuery()
            ->where('to_id', '=', $user_id)
            ->groupBy('from_id')
            ->selectRaw('from_id, COUNT(id) as count')
            ->whereRaw('seen_at IS NULL')
            ->get()
            ->pluck('count', 'from_id');
    }

    /**
     * Crée un nouveau message
     * @param string $message
     * @param int $from
     * @param int $to
     * @return Message|Model
     */
    public function create(string $message, int $from, int $to): Message
    {
        return $this->message->newQuery()->create([
            'from_id'    => $from,
            'to_id'      => $to,
            'content'    => $message,
            'created_at' => Carbon::now()
        ]);
    }

    /**
     * Marque une conversation comme vue
     * @param int $from
     * @param int $to
     * @return int
     */
    public function markAsSeen(int $from, int $to)
    {
        return $this->message->newQuery()
            ->whereRaw("from_id = $from AND to_id = $to AND seen_at IS NULL")
            ->update([
                'seen_at' => Carbon::now()
            ]);
    }

}
