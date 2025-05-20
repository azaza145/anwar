import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Event } from '../models/event';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [];
  private eventsSubject = new BehaviorSubject<Event[]>([]);

  constructor() {
    // Charger les événements depuis le localStorage lors de l'initialisation
    this.loadEvents();
  }

  // Récupérer tous les événements
  getEvents(): Observable<Event[]> {
    return this.eventsSubject.asObservable();
  }

  // Récupérer un événement par son ID
  getEventById(id: string): Observable<Event | undefined> {
    return this.eventsSubject.pipe(
      map(events => events.find(event => event.id === id))
    );
  }

  // Ajouter un nouvel événement
  addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Observable<Event> {
    const now = new Date();
    const newEvent: Event = {
      ...event,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };

    this.events = [...this.events, newEvent];
    this.eventsSubject.next(this.events);
    this.saveEvents();
    
    return of(newEvent);
  }

  // Mettre à jour un événement existant
  updateEvent(id: string, eventData: Partial<Event>): Observable<Event | undefined> {
    const index = this.events.findIndex(e => e.id === id);
    
    if (index !== -1) {
      const updatedEvent: Event = {
        ...this.events[index],
        ...eventData,
        updatedAt: new Date()
      };
      
      this.events = [
        ...this.events.slice(0, index),
        updatedEvent,
        ...this.events.slice(index + 1)
      ];
      
      this.eventsSubject.next(this.events);
      this.saveEvents();
      
      return of(updatedEvent);
    }
    
    return of(undefined);
  }

  // Supprimer un événement
  deleteEvent(id: string): Observable<boolean> {
    const initialLength = this.events.length;
    this.events = this.events.filter(event => event.id !== id);
    
    if (initialLength !== this.events.length) {
      this.eventsSubject.next(this.events);
      this.saveEvents();
      return of(true);
    }
    
    return of(false);
  }

  // Méthodes privées pour la persistance
  private saveEvents(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  private loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        // Convertir les chaînes de date en objets Date
        this.events = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }));
        this.eventsSubject.next(this.events);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        this.events = [];
        this.eventsSubject.next(this.events);
      }
    }
  }
}
