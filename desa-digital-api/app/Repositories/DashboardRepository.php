<?php

namespace App\Repositories;

use App\Interfaces\DashboardRepositoryInterface;
use App\Models\Development;
use App\Models\DevelopmentApplicant;
use App\Models\Event;
use App\Models\FamilyMember;
use App\Models\HeadOfFamily;
use App\Models\SocialAssistance;
use App\Models\SocialAssistanceRecipient;
use Carbon\Carbon;

class DashboardRepository implements DashboardRepositoryInterface
{

    public function getDashboardData()
    {

        $today = Carbon::today();

        $upcomingEvents = Event::whereDate('date', '>=', $today)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->take(5)
            ->get();

        // total penduduk = jumlah kepala keluarga + anggota keluarga
        $totalResidents = HeadOfFamily::count() + FamilyMember::count();

        // hitung gender
        $maleResidents = HeadOfFamily::where('gender', 'male')->count()
            + FamilyMember::where('gender', 'male')->count();

        $femaleResidents = HeadOfFamily::where('gender', 'female')->count()
            + FamilyMember::where('gender', 'female')->count();

        // hitung anak-anak & balita dari date_of_birth
        $today = Carbon::today();

        // anak-anak (6–12 tahun)
        $childrenFrom = $today->copy()->subYears(12)->toDateString();
        $childrenTo   = $today->copy()->subYears(6)->toDateString();
        $children = FamilyMember::whereBetween('date_of_birth', [$childrenFrom, $childrenTo])->count();

        // balita (0–5 tahun)
        $toddlerFrom = $today->copy()->subYears(5)->toDateString();
        $toddlerTo   = $today->toDateString();
        $toddler = FamilyMember::whereBetween('date_of_birth', [$toddlerFrom, $toddlerTo])->count();

        // ambil social assistance terakhir
        $latestSocialAssistances = SocialAssistanceRecipient::with(['socialAssistance', 'headOfFamily.user'])
            ->latest()
            ->take(5)
            ->get();

        // ✅ ambil total applicant
        $totalApplicants = DevelopmentApplicant::count();

        // ✅ ambil applicant terakhir (misal 5 terakhir)
        $latestApplicants = DevelopmentApplicant::with(['development', 'user'])
            ->latest()
            ->take(5)
            ->get();

        return [
            'residents' => $totalResidents,
            'head_of_families' => HeadOfFamily::count(),
            'social_assistances' => SocialAssistance::count(),
            'events' => Event::count(),
            'developments' => Development::count(),
            'resident_statistics' => [
                'male' => $maleResidents,
                'female' => $femaleResidents,
                'children' => $children,
                'toddler' => $toddler,
            ],
            'latest_social_assistances' => $latestSocialAssistances,

            // 🔽 tambahan ini
            'total_applicants' => $totalApplicants,
            'latest_applicants' => $latestApplicants,

            //  tambahan ini
            'upcoming_events' => $upcomingEvents,
            'today' => $today->toDateString(),
        ];
    }
}
