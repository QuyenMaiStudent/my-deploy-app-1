<?php

namespace App\Http\Controllers;

use App\Models\Link;

class RedirectController extends Controller
{
    public function __invoke(string $code)
    {
        $link = Link::where('code', $code)->firstOrFail();
        $link->increment('clicks');

        return redirect()->away($link->long_url, 302);
    }
}
