import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  public socialUser!: SocialUser;
  public isLoggedin?: boolean;

  constructor(
    private titleService: Title,
    private socialAuthService: SocialAuthService
    ) {
    this.titleService.setTitle(`${environment.name} ${environment.version}`);
  }

  ngOnInit(): void{
    this.socialAuthService.authState.subscribe((user: any) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }
}
