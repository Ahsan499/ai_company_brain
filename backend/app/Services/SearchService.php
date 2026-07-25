<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class SearchService
{
    /**
     * Apply search, filters, sorting and pagination.
     */
    public function apply(Builder $query, Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Global Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                foreach ($this->searchableColumns($query) as $column) {
                    $q->orWhere($column, 'LIKE', "%{$search}%");
                }

            });
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $sortBy = $request->get('sort_by', 'id');

        $sortOrder = $request->get('sort_order', 'desc');

        $query->orderBy($sortBy, $sortOrder);

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        return $query->paginate(
            $request->get('per_page', 10)
        );
    }

    /**
     * Searchable columns.
     */
    protected function searchableColumns(Builder $query): array
    {
        $model = $query->getModel();

        return match (class_basename($model)) {

            'Organization' => [
                'name',
                'email',
                'phone',
            ],

            'Department' => [
                'name',
                'description',
            ],

            'Project' => [
                'name',
                'description',
            ],

            'Task' => [
                'title',
                'description',
                'status',
                'priority',
            ],

            'Meeting' => [
                'title',
                'agenda',
            ],

            'User' => [
                'first_name',
                'last_name',
                'email',
            ],

            default => ['id'],
        };
    }
}