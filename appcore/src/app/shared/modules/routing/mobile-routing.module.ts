import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from "../../models/app-routes";

const routes: Routes = [
  {
    path: AppRoutes.activities,
    loadChildren: () => import("../../../activities/activities.module").then(module => module.ActivitiesModule)
  },
  {
    path: AppRoutes.fitnessTrend,
    loadChildren: () => import("../../../fitness-trend/fitness-trend.module").then(module => module.FitnessTrendModule)
  },
  {
    path: AppRoutes.yearProgressions,
    loadChildren: () => import("../../../year-progress/year-progress.module").then(module => module.YearProgressModule)
  },
  {
    path: AppRoutes.athleteSettings,
    loadChildren: () =>
      import("../../../athlete-settings/athlete-settings.module").then(module => module.AthleteSettingsModule)
  },
  {
    path: AppRoutes.zonesSettings,
    loadChildren: () =>
      import("../../../zones-settings/zones-settings.module").then(module => module.ZonesSettingsModule)
  },
  {
    path: AppRoutes.aiCoach,
    loadChildren: () => import("../../../ai-coach/ai-coach.module").then(module => module.AiCoachModule)
  },
  {
    path: "",
    redirectTo: AppRoutes.activities,
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class MobileRoutingModule {}
