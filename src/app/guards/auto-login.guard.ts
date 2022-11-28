import { Injectable } from '@angular/core';
import { CanLoad,Router , Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// export class AutoLoginGuard implements CanLoad {
//   canLoad(
//     route: Route,
//     segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return true;
//   }
// }

export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated)=>{
        
        if(isAuthenticated){
          this.router.navigateByUrl('config', { replaceUrl: true });
        }else{
          return true;  
        }
        return true;
        
      })
    )
  }
}
