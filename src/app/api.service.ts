import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) {}

    // Uses http.get() to load data from a single API endpoint
    move(board: any[]) {
        let body = JSON.stringify(board);
        return this.http.post('/api/move', body, httpOptions);
    }
}
