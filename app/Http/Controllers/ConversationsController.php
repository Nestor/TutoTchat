<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessage;
use App\Message;
use App\Repository\MessageRepository;
use App\User;
use Carbon\Carbon;
use Illuminate\Auth\AuthManager;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\Factory;

class ConversationsController extends Controller
{
    /**
     * @var AuthManager
     */
    private $auth;
    /**
     * @var User
     */
    private $user;
    /**
     * @var Factory
     */
    private $view;
    /**
     * @var Redirector
     */
    private $redirector;
    /**
     * @var MessageRepository
     */
    private $messageRepository;

    /**
     * Create a new controller instance.
     *
     * @param AuthManager $auth
     * @param User $user
     * @param Factory $view
     * @param Redirector $redirector
     */
    public function __construct(AuthManager $auth, User $user, Factory $view, Redirector $redirector, MessageRepository $messageRepository)
    {
        $this->middleware('auth');
        $this->auth = $auth;
        $this->user = $user;
        $this->view = $view;
        $this->redirector = $redirector;
        $this->messageRepository = $messageRepository;
    }

    public function index () {
        return $this->view->make('messages.index', [
            'users' => $this->getUsers(),
            'unread_count' => $this->getUnreadCount()
        ]);
    }

    public function show (int $id) {
        $currentUserId = $this->auth->user()->id;
        $messages = $this->messageRepository->getMessagesFor($currentUserId, $id)->paginate(50);
        $unread = $this->getUnreadCount();
        if (isset($unread[$id])) {
            $this->messageRepository->markAsSeen($id, $currentUserId);
            unset($unread[$id]);
        }

        return $this->view->make('messages.show', [
            'users' => $this->getUsers(),
            'user' => $this->user->newQuery()->findOrFail($id),
            'unread_count' => $unread,
            'messages' => $messages
        ]);
    }

    public function store (int $id, StoreMessage $request) {
        $user = $this->user->newQuery()->findOrFail($id);
        $this->messageRepository->create(
            $request->get('content'),
            $this->auth->user()->id,
            $user->id
        );

        return $this->redirector->route('messages.show', compact('id'));
    }

    private function getUsers () {
        return $this->user
            ->newQuery()
            ->where('id', '!=', $this->auth->user()->id)
            ->get();
    }

    private function getUnreadCount () {
        return $this->messageRepository->unreadCount($this->auth->user()->id);
    }

}
