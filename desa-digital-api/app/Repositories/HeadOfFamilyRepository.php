<?php

namespace App\Repositories;

use App\Interfaces\HeadOfFamilyRepositoryInterface;
use App\Models\HeadOfFamily;

class HeadOfFamilyRepository implements HeadOfFamilyRepositoryInterface
{
    public function getAll(
        ?string $search,
        ?int $limit,
        bool $execute
    ){
        $query = HeadOfFamily::where(function ($query) use ($search){

            // jika ada parameter search dia akan melakukan search, yang kita definisikan pada model user
            if($search){
                $query->search($search);
            }
        });

        $query->orderBy('created_at', 'desc');

        if($limit){
            // take adalah mengambil beberapa berdasarkan limit
            $query->take($limit);
        }

        if($execute) {
            return $query->get();
        }

        return $query;
    }

    public function getAllPaginated(
        ?string $search,
        ?int $rowPerPage
    ){
        $query = $this->getAll(
            $search,
            $rowPerPage,
            false
        );

        return $query->paginate($rowPerPage);
    }
}
