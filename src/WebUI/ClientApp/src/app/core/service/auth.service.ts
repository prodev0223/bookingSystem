import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      if (this.currentUserValue) {
        observer.next(true);
      } else {
        observer.next(false);
      }
    });
  }

  login(
    username: string,
    password: string,
    rememberMe: boolean
  ): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http
        .post<any>(`${environment.apiUrl}/auth/signin`, {
          Email: username,
          Password: password,
          RememberMe: rememberMe,
        })
        .subscribe((result) => {
          if (result) {
            if (result.success) {
              let useInfo = result.anyData;
              localStorage.setItem("currentUser", JSON.stringify(useInfo));
              this.currentUserSubject.next(useInfo);
              observer.next(true);
            } else {
              observer.next(false);
            }
          } else {
            observer.next(false);
          }
          // store user details and jwt token in local storage to keep user logged in between page refreshes
        });
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    return of({ success: false });
  }
}
