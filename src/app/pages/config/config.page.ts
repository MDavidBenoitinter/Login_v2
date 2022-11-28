import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
  }

  async logout() {
		await this.authService.logout();
    localStorage.clear();
		this.router.navigateByUrl('/', { replaceUrl: true });
	}

}
