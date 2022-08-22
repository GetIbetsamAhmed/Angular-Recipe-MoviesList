import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HttpHelperService {
  private url = "https://jsonmock.hackerrank.com/api/";
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    "Content-Type": "application/json; charset=utf-8",
  });

  getMoviesByYear(year) {
    return this.http.get<ApiResponse>(this.url + "movies?Year=" + year);
  }
}

export interface Movie {
  Title: string;
  Year: number;
  imdbID: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Movie[];
}
