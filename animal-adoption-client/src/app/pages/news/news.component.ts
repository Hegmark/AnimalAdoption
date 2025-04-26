import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  imports: [CommonModule],
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  newsList: News[] = [];
  selectedNews: News | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe({
      next: (data) => this.newsList = data,
      error: (err) => console.error('Failed to load news', err)
    });
  }

  openModal(news: News) {
    this.selectedNews = news;
  }

  closeModal() {
    this.selectedNews = null;
  }
}
