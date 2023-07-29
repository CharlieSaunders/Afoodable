import { Component } from "@angular/core";
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [],
})
export class LoginComponent {

  public socialUser!: SocialUser;
  public isLoggedin?: boolean;
  public clientId!: string;
  public loginEndpoint!: string;

  constructor(
    private socialAuthService: SocialAuthService,
    private router: Router
    ) {
    this.clientId = environment.googleClientId;
    this.loginEndpoint = environment.loginEndpoint;
    
  }

  ngOnInit(): void{
    if(localStorage.getItem("user") == null){
      this.socialAuthService.authState.subscribe((user: any) => {
        this.socialUser = user;
        this.isLoggedin = user != null;
        if(this.isLoggedin){
          localStorage.setItem("user", JSON.stringify(user));
          this.router.navigate(["search"])
        }
      });
    }
    else{
      this.router.navigate(["search"]);
    }
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }
}