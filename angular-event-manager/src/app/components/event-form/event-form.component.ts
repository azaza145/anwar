import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatStepperModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  loading = false;
  submitted = false;
  categories = [
    'Conférence', 'Séminaire', 'Atelier', 'Formation',
    'Concert', 'Festival', 'Exposition', 'Sportif',
    'Caritatif', 'Networking', 'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: [new Date(), Validators.required],
      time: ['18:00', Validators.required],
      location: ['', Validators.required],
      organizer: ['', Validators.required],
      category: ['', Validators.required],
      maxParticipants: [50, [Validators.required, Validators.min(1)]],
      currentParticipants: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId && this.eventId !== 'new') {
        this.isEditMode = true;
        this.loadEventData();
      }
    });
  }

  loadEventData(): void {
    if (this.eventId) {
      this.loading = true;
      this.eventService.getEventById(this.eventId).subscribe(event => {
        this.loading = false;
        if (event) {
          // Convertir la date en objet Date pour le datepicker
          const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
          
          this.eventForm.patchValue({
            ...event,
            date: eventDate
          });
        } else {
          this.showNotification('Événement non trouvé', 'error');
          this.router.navigate(['/events']);
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.eventForm.invalid) {
      this.showNotification('Veuillez corriger les erreurs du formulaire', 'error');
      return;
    }
    
    this.loading = true;
    const eventData = this.eventForm.value;
    
    if (this.isEditMode && this.eventId) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe(updatedEvent => {
        this.loading = false;
        if (updatedEvent) {
          this.showNotification('Événement mis à jour avec succès', 'success');
          this.router.navigate(['/events', this.eventId]);
        } else {
          this.showNotification('Erreur lors de la mise à jour de l\'événement', 'error');
        }
      });
    } else {
      this.eventService.addEvent(eventData).subscribe(newEvent => {
        this.loading = false;
        this.showNotification('Événement créé avec succès', 'success');
        this.router.navigate(['/events', newEvent.id]);
      });
    }
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  resetForm(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les données saisies seront perdues.')) {
      if (this.isEditMode) {
        this.loadEventData();
      } else {
        this.eventForm.reset({
          date: new Date(),
          time: '18:00',
          maxParticipants: 50,
          currentParticipants: 0
        });
      }
      this.submitted = false;
    }
  }
}
