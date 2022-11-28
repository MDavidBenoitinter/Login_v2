import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
	isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	credentials!: FormGroup;
	matricula:string | null | undefined;

	constructor(
		private fb: FormBuilder,
		private authService: AuthenticationService,
		private alertController: AlertController,
		private router: Router,
		private loadingController: LoadingController,
		public toastController: ToastController,
		private menuCtrl: MenuController,
	) {}

	ngOnInit() {
		this.menuCtrl.enable(false);
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.minLength(10)]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	async login() {
		const loading = await this.loadingController.create();
		await loading.present();

		this.authService.login(this.credentials.value).subscribe(
			async (res: any) => {
				await loading.dismiss();
				this.matricula = localStorage.getItem("Matricula");
				// console.log(this.matricula);
				if(this.matricula == "null"){
					// console.log("this.matricula == null");
					localStorage.clear();
					this.isAuthenticated.next(false);
					await this.authService.logout();
					this.presentToast("Usuario y/o Contraseña Incorrectos");
				} 
				else{
					// console.log("WTF?");
					this.menuCtrl.enable(true);
					this.router.navigateByUrl('config', { replaceUrl: true });
				}
			},
			async (res: { error: { error: any; }; }) => {
				await loading.dismiss();
				const alert = await this.alertController.create({
					header: 'Login failed',
					message: res.error.error,
					buttons: ['OK']
				});

				await alert.present();
			}
		);
	}

	// Easy access for form fields
	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
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
