import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router){
  }

  async canActivate(): Promise<any> {
    const result = await this.authService.isAuthenticated();
    
    if(!result){
      this.router.navigate([""]);
    }

    return result;
  }
}