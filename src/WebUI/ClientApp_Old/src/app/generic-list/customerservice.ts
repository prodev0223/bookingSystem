import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './customer';

@Injectable()
export class CustomerService {
    constructor(private http: HttpClient) { }

    getCustomersLarge() {
        return this.http.get<any>('assets/customer-data.json')
            .toPromise()
            .then(res => <Customer[]>res.data)
            .then(data => { return data; });
    }
}
