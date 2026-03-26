import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/modules/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AiCoachComponent } from "./components/ai-coach.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: AiCoachComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AiCoachComponent],
  exports: [AiCoachComponent]
})
export class AiCoachModule {}
