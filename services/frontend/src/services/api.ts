import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface Article {
  id: string;
  title: string;
  url: string;
  author: string;
  created_at: string;
  similarity?: number;
  image_url?: string | null;
}
