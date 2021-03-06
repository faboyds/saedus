import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private url = '/api';

  async upload(id, file): Promise<any> {

    const endpoint = 'methods/file/upload/upload.php';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', file.name);
    fd.append('id', id);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const response = await this.http.post(this.url + '/' + endpoint, fd, {headers}).toPromise();
    return response;

  }
  async deletePic(id): Promise<any> {

    const endpoint = 'methods/file/upload/delete_pic.php';
    const fd = new FormData();
    fd.append('id', id);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const response = await this.http.post(this.url + '/' + endpoint, fd, {headers}).toPromise();
    return response;

  }

  async uploadPortfolio(id, file): Promise<any> {

    const endpoint = 'methods/file/upload/portfolio.php';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', file.name);
    fd.append('id', id);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const response = await this.http.post(this.url + '/' + endpoint, fd, {headers}).toPromise();
    return response;

  }

  constructor(
    private http: HttpClient,
  ) {
    if (environment.production) {
      this.url = 'http://18.224.180.162/api';
    } else {
      this.url = '/api';
    }
  }
}
