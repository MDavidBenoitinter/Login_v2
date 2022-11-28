import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, empty, EmptyError, from, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { ExceptionCode } from '@capacitor/core';

const TOKEN_KEY = 'my-token';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {

	user!: string;
	password: string | undefined;
	resM: string | undefined;
	nombre!:string;
	App!:string;
	Apm!:string;
	matricula!:string;
	correo!:string;

	// Init with null to filter out the first value in a guard!
	isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	token = '';

	constructor(private http: HttpClient,private router: Router,public toastController: ToastController) {
		this.loadToken();
	}

	async loadToken() {
		const token = await Preferences.get({ key: TOKEN_KEY });
		if (token && token.value) {
			console.log('set token: ', token.value);
			this.token = token.value;
			this.isAuthenticated.next(true);
		} else {
			this.isAuthenticated.next(false);
		}
	}

	login(credentials: { email: any; password: any }): Observable<any> {
		return this.http.get<any>('http://localhost:5126/api/Auth/login/'+credentials.email+'/'+credentials.password).pipe(
			map((data: any) => data.alMatricula),
			switchMap((token) => {
				this.matricula = token;
					localStorage.setItem("Matricula", this.matricula)
					return from(Preferences.set({ key: TOKEN_KEY, value: token }));
					
			}),
			tap((_) => {
				this.isAuthenticated.next(true);
			})
		);
	}

	logout(): Promise<void> {
		this.isAuthenticated.next(false);
		return Preferences.remove({ key: TOKEN_KEY });
	}

	async presentToast(msg: string){
		const toast = await this.toastController.create({
		  message: msg,
		  duration: 1000,
		  position: "bottom"
		});
		toast.present();
	  }

}
