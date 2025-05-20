import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatDividerModule,
    MatGridListModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  features = [
    {
      icon: 'event_note',
      title: 'Gestion des événements',
      description: 'Créez et organisez facilement vos événements avec toutes les informations nécessaires.'
    },
    {
      icon: 'search',
      title: 'Recherche intuitive',
      description: 'Retrouvez rapidement vos événements grâce à notre système de recherche et de filtrage.'
    },
    {
      icon: 'notifications',
      title: 'Rappels et notifications',
      description: 'Ne manquez plus jamais un événement important grâce aux rappels personnalisables.'
    },
    {
      icon: 'people',
      title: 'Gestion des participants',
      description: 'Suivez facilement le nombre de participants et gérez les inscriptions à vos événements.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
