<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    protected $fillable = ['ebook_id'];

    public function ebook()
    {
        return $this->belongsTo(Ebook::class);
    }
}