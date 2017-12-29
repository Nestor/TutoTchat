<?php
namespace App\Http\Controllers\Api;

use App\Events\NewMessage;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessage;
use App\Message;
use App\Notifications\MessageReceived;
use App\Repository\MessageRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ConversationsController extends Controller {

    private $messageRepository;

    public function __construct(MessageRepository $messageRepository)
    {
        $this->middleware('auth:api');
        $this->messageRepository = $messageRepository;
    }

    public function index (Request $request) {
        return response()
            ->json([
                'conversations' => $this->messageRepository->getConversations($request->user()->id)
            ]);
    }

    public function show (int $userId, Request $request) {
        $messagesQuery = $this->messageRepository
            ->getMessagesFor($userId, $request->user()->id)
            ->limit(10);
        if ($request->get('before')) {
            $messagesQuery = $messagesQuery->where('created_at', '<', $request->get('before'));
        }
        $messages = $messagesQuery->get();
        $this->messageRepository->markAsSeen($messages, $request->user()->id);
        return [
            'count'    => $messagesQuery->count(),
            'messages' => array_reverse($messages->toArray())
        ];
    }

    public function store (StoreMessage $request) {
        $message = $this->messageRepository->create(
            $request->get('content'),
            $request->user()->id,
            $request->get('to_id')
        );
        $message->from = $request->user();
        event(new NewMessage($message));
        // $request->user()->notify(new MessageReceived($message));
        return $message;
    }

    public function seen (int $messageId, Message $message) {
        $message = $message->newQuery()->findOrFail($messageId);
        $update = $message->update([
            'seen_at' => Carbon::now()
        ], ['validates']);
        return ['success' => $update];
    }

}
