import { Component, OnInit } from "@angular/core";
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [],
})
export class LoginComponent implements OnInit {
  
  constructor(
    private router: Router, 
    private ssoauthService:SocialAuthService) {
  }

  ngOnInit(): void {
      this.ssoauthService.authState.subscribe((user)=>{
        let validUser = user != null;
        if(validUser){
          localStorage.setItem("gData", JSON.stringify(user));
          this.router.navigate(["/app/search"])
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