import { Routes } from '@angular/router';
import { AnimalsComponent } from './pages/animals/animals.component';
import { NewsComponent } from './pages/news/news.component';
import { AnimalDetailComponent } from './pages/animal-detail/animal-detail.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdoptionRequestsComponent } from './pages/adoption-requests/adoption-requests.component';

export const routes: Routes = [
    { path: '', redirectTo: 'news', pathMatch: 'full' },
    { path: 'animals', component: AnimalsComponent },
    { path: 'news', component: NewsComponent},
    { path: 'animals/:id', component: AnimalDetailComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path : 'my-adoptions', component: AdoptionRequestsComponent},
    { path : '**', redirectTo: 'news' }
];
