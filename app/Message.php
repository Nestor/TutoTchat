<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'from_id', 'to_id', 'content', 'created_at', 'seen_at'
    ];

    protected $dates = [
        'created_at', 'seen_at'
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('c');
    }

    public function from() {
        return $this->belongsTo(User::class, 'from_id');
    }

}
