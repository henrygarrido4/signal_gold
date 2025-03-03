<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CKEditorController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();

            // Store the file in the public disk
            $path = $file->storeAs('uploads/ckeditor', $fileName, 'public');

            return response()->json([
                'url' => Storage::url($path)
            ]);
        }

        return response()->json([
            'error' => 'No image provided'
        ], 400);
    }
}
