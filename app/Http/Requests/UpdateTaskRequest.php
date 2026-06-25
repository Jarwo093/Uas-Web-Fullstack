<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware/controller
    }

    public function rules(): array
    {
        return [
            'project_id'  => 'required|integer|exists:projects,id',
            'user_id'     => 'required|integer|exists:users,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'required|in:todo,in_progress,done',
            'priority'    => 'required|in:low,medium,high',
            'due_date'    => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.exists' => 'The selected project does not exist.',
            'user_id.exists'    => 'The selected user does not exist.',
        ];
    }
}
