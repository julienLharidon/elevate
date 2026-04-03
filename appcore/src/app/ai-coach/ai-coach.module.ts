import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AiCoachComponent } from "./ai-coach.component";
import { SharedModule } from "../shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: AiCoachComponent
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [AiCoachComponent]
})
export class AiCoachModule {}
