<?php

use App\Models\FamilyMember;

class FamilyMemberRepository implements FamilyMemberRepositoryInterface
{
    public function getAll(
        ?string $search,
        ?int $limit,
        bool $execute
    ){
        $query = FamilyMember::where(function ($query) use ($search){

            // jika ada parameter search dia akan melakukan search, yang kita definisikan pada model user
            if($search){
                $query->search($search);
            }
        });

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
