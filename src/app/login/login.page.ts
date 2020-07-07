import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ""
  password: string = ""
  constructor(public auth: AngularFireAuth) { }

  ngOnInit() {
  }
  // abcdefg + @KenCee.com
  async login() {
    const { username, password } = this
    try {
      const res = await this.auth.signInWithEmailAndPassword(username + '@KenCee.com', password)
    } catch(err){
      console.dir(err)
      if(err.code === "auth/user-not-found") {
        console.log("User not found")
      }
    }

  }

}
