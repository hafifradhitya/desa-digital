<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\ProfileStoreRequest;
use App\Http\Resources\ProfileResource;
use App\Interfaces\ProfileRepositoryInterface;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    private ProfileRepositoryInterface $profileRepository;

    public function __construct(ProfileRepositoryInterface $profileRepository) {
        $this->profileRepository = $profileRepository;
    }

    public function index()
    {
        try {
            $profile = $this->profileRepository->get();

            if(!$profile){
                return ResponseHelper::jsonResponse(false, 'Data Profile Tidak Ada', null, 404);
            }

            return ResponseHelper::jsonResponse(true, 'Profil Berhasil Diambil', new ProfileResource($profile), 200);
        } catch (\Exception $e) {
            return ResponseHelper::jsonResponse(false, $e->getMessage(), null, 500);
        }
    }

    public function store(ProfileStoreRequest $request)
    {
        $request = $request->validated();

        try {
            $profile = $this->profileRepository->create($request);

            return ResponseHelper::jsonResponse(true, 'Data Profil Berhasil Ditambahkan', new ProfileResource($profile), 201);
        } catch (\Exception $e) {
            return ResponseHelper::jsonResponse(false, $e->getMessage(), null, 500);
        }
    }
}
