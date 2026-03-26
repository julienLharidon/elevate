import { Component, Inject, OnInit } from "@angular/core";
import { AiCoachService } from "../services/ai-coach.service";
import { PropertiesDao } from "../../shared/dao/properties/properties.dao";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-ai-coach",
  template: `
    <div class="ai-coach-container" fxLayout="column" fxLayoutGap="20px" style="padding: 16px;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>AI Coach</mat-card-title>
        </mat-card-header>
        <mat-card-content fxLayout="column" fxLayoutGap="10px" style="margin-top: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Model</mat-label>
            <mat-select [(ngModel)]="selectedModel" (selectionChange)="saveSettings()">
              <mat-option *ngFor="let model of models" [value]="model.value">
                {{model.viewValue}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Context window (weeks)</mat-label>
            <input matInput type="number" [(ngModel)]="weeks" (change)="saveSettings()" min="1" max="52">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Your instructions to the coach</mat-label>
            <textarea matInput rows="5" [(ngModel)]="userPrompt" (change)="saveSettings()" placeholder="e.g. Analyze my progress and suggest improvements for my cycling."></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" [disabled]="isLoading" (click)="onAskCoach()">
            {{ isLoading ? 'Thinking...' : 'What do you think coach?' }}
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="coachResponse">
        <mat-card-header>
          <mat-card-title>Coach's Response</mat-card-title>
        </mat-card-header>
        <mat-card-content style="margin-top: 16px; white-space: pre-wrap;">
          {{coachResponse}}
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class AiCoachComponent implements OnInit {
  public selectedModel = "gemini-1.5-flash";
  public userPrompt = "";
  public weeks = 4;
  public isLoading = false;
  public coachResponse = "";

  public models = [
    { value: "gemini-1.5-flash", viewValue: "Gemini 1.5 Flash (Fast)" },
    { value: "gemini-1.5-pro", viewValue: "Gemini 1.5 Pro (Powerful)" }
  ];

  constructor(
    private readonly aiCoachService: AiCoachService,
    @Inject(PropertiesDao) private readonly propertiesDao: PropertiesDao,
    private readonly snackBar: MatSnackBar
  ) {}

  public async ngOnInit() {
    const props: any = await this.propertiesDao.findOne();
    if (props.aiCoachModel) this.selectedModel = props.aiCoachModel;
    if (props.aiCoachPrompt) this.userPrompt = props.aiCoachPrompt;
    if (props.aiCoachWeeks) this.weeks = props.aiCoachWeeks;
  }

  public async saveSettings() {
    const props: any = await this.propertiesDao.findOne();
    props.aiCoachModel = this.selectedModel;
    props.aiCoachPrompt = this.userPrompt;
    props.aiCoachWeeks = this.weeks;
    await this.propertiesDao.update(props);
  }

  public async onAskCoach() {
    this.isLoading = true;
    this.coachResponse = "";
    try {
      this.coachResponse = await this.aiCoachService.getAiAdvice(this.selectedModel, this.userPrompt, this.weeks);
    } catch (err) {
      this.snackBar.open(err.message, "Close", { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }
}
