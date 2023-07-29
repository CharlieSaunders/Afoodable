import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [],
})
export class LoginComponent implements OnInit {

  constructor(
    private ngZone: NgZone,
    private router: Router
    ) {
  }

  ngOnInit(): void{
    // @ts-ignore
      google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("google-button"), { theme: "outline", size: "large", width: "100%" });
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {console.log(notification)});
  }

  async handleCredentialResponse(response: any) {
    console.log(response)
    // this.ngZone.run(() => localStorage.setItem("id", response.credential));
    // this.router.navigate(["search"]);
  }
}