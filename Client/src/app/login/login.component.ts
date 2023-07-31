import { Component, OnInit } from "@angular/core";
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [],
})
export class LoginComponent implements OnInit {
  public user: SocialUser | undefined;
  public loggedIn: boolean | undefined;
  public isLoggedin?: boolean = undefined;

 constructor(
  private router: Router, 
  private ssoauthService:SocialAuthService) {
  }

  ngOnInit(): void {
    let id = localStorage.getItem("id");
    if(id === null){
      console.log("Id null")
      this.noAutoLogin();
    }else{
      console.log("Id not null")
      this.router.navigate(["search"])
    }
  }

  noAutoLogin(): void{
    this.ssoauthService.authState.subscribe((user)=>{
      this.user = user;
      this.loggedIn = (user != null);
      this.isLoggedin = user != null;
      if(this.loggedIn){
        localStorage.setItem("id", user.id);
        this.router.navigate(["search"]);
      }
    });
  }

  signWithGoogle():void{
    this.ssoauthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut():any{
    this.ssoauthService.signOut();
  }
}