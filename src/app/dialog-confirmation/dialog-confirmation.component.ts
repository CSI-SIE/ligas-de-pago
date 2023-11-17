import { Component, Inject } from '@angular/core';


import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { GenerarIndividualComponent } from '../tabs/generar-individual/generar-individual.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatDialogModule, MatButtonModule,MatIconModule],
})
export class DialogConfirmationComponent {


  ok:boolean = true;

  constructor(
    public dialogRef: MatDialogRef<GenerarIndividualComponent>,
    ) {}

  onClick(): void {
    this.dialogRef.close();
  }
}
