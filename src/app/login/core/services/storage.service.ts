/**
 * Created by xavi on 5/16/17.
 */
import {Injectable} from "@angular/core";
import { Router } from '@angular/router';
import {Session} from "../models/session.model";
import {User} from "../models/user.model";

@Injectable()
export class StorageService {
  private localStorageService;
  private currentSession : Session = null; /* VARIABLE DEL TIPO DE ESTRUCTURA SESSION*/

  constructor(private router: Router) {
    this.localStorageService = localStorage;
    console.log(localStorage);
    this.currentSession = this.loadSessionData();
    console.log(1);
    console.log(this.currentSession);
  }

/* login.component.ts llama a esta funcion para enviar los datos del usuario*/
  setCurrentSession(session: Session): void {
    this.currentSession = session;
    console.log(2);
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
    console.log(this.localStorageService.setItem('currentUser', JSON.stringify(session)));
    console.log("2 - 2");
  }

  loadSessionData(): Session{
    console.log(3);
    var sessionStr = this.localStorageService.getItem('currentUser');
    console.log(sessionStr);
    console.log((sessionStr) ? <Session> JSON.parse(sessionStr) : null);
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): Session {
    console.log(4);
    return this.currentSession;
  }

  removeCurrentSession(): void {
    console.log(5);
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    console.log(6);
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };

  isAuthenticated(): boolean {
    console.log(7);
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    console.log(8);
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };

  logout(): void{
    console.log(9);
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }

}
