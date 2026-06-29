<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    public function rules(): array
    {
        return [
            'project_id'  => 'required|integer|exists:projects,id',
            'user_id'     => 'required|integer|exists:users,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:todo,in_progress,done',
            'priority'    => 'sometimes|in:low,medium,high',
            'due_date'    => 'nullable|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.exists' => 'The selected project does not exist.',
            'user_id.exists'    => 'The selected user does not exist.',
            'due_date.after_or_equal' => 'Due date must be today or in the future.',
        ];
    }
}
