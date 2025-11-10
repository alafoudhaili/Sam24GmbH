import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kitchen,Room } from '../pages/umzug/add-umzug/add-umzug.component';
import {environment} from "../../environments/environment";
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class UmzugService {
      private apiUrl = environment.apiUrl + 'umzug'
      private baseUrl =  environment.apiUrl +'affectations';


  constructor(private http: HttpClient) { }

  getAll(page: number = 0, size: number = 10): Observable<PageResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<PageResponse<any>>(this.apiUrl, { params });
  }
   uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile, imageFile.name);  // Appending the file to the FormData object

    const headers = new HttpHeaders();

    return this.http.post<string>(`${this.apiUrl}/upload-image`, formData, { headers });
  }
 assignUsersToUmzug(requestId: number, userIds: number[]): Observable<any> {
    const params = {
      userIds: userIds.join(','), // Convert array to comma-separated string
      requestId: requestId.toString()
    };
    return this.http.post(`${this.baseUrl}/assign`, null, { params });
  }
  // Get request by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getAllKitchens(): Observable<Kitchen[]> {
    return this.http.get<Kitchen[]>(`${this.apiUrl}/kitchens`);
  }

  calculatePrice(umzugData: any): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calculate`, umzugData);
  }

  saveUmzug(umzugData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, umzugData,);
  }
    updateUmzug(id: number, requestData: any): Observable<Request> {
    return this.http.put<Request>(`${this.apiUrl}/${id}`, requestData);
  }

  // Delete request
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search requests by client name
  searchByClientName(clientName: string, page: number = 0, size: number = 10): Observable<PageResponse<any>> {
    const params = new HttpParams()
      .set('clientName', clientName)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<PageResponse<any>>(`${this.apiUrl}/search`, { params });
  }

  // Get requests by price range
  getByPriceRange(minPrice: number, maxPrice: number, page: number = 0, size: number = 10): Observable<PageResponse<any>> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString())
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<PageResponse<any>>(`${this.apiUrl}/price-range`, { params });
  }
}