import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AiCoachComponent } from "./ai-coach.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AiCoachComponent]
})
export class AiCoachModule {}
