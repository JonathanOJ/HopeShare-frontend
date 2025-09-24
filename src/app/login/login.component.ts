import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthUser, TipoUsuario, TipoUsuarioList } from '../shared/models/auth';
import { AuthService } from '../shared/services/auth.service';
import { MessageConfirmationService } from '../shared/services/message-confirmation.service';
import { UsuarioService } from '../shared/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  isInvalid: boolean = false;
  loading: boolean = false;
  createUser: boolean = false;
  type_users = TipoUsuarioList;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private messageConfirmationService = inject(MessageConfirmationService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.userForm = this.fb.group({
      user_id: [''],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required]],
      username: [''],
      cnpj: [''],
      cpf: [''],
      image: [''],
      birthdate: [new Date()],
      type_user: [TipoUsuario.USER],
      rememberUser: [false],
    });

    this.router.url === '/register' ? (this.createUser = true) : null;

    if (this.createUser) {
      this.username?.setValidators(Validators.required);
    }

    this.userForm.updateValueAndValidity();

    this.authService.getAuthResponse() ? this.router.navigate(['hopeshare/home']) : null;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setValidatorsFortype_user() {
    if (this.type_user?.value === TipoUsuario.EMPRESA) {
      this.cnpj?.setValidators([Validators.required]);
      this.cpf?.clearValidators();
      this.birthdate?.clearValidators();
    } else if (this.type_user?.value === TipoUsuario.USER) {
      this.cpf?.setValidators([Validators.required]);
      this.birthdate?.setValidators([Validators.required]);
      this.cnpj?.clearValidators();
    }
  }

  handleLogin() {
    this.loading = true;

    if (this.validateForms()) {
      this.loading = false;
      return;
    }

    this.createUser ? this.createUserAccount() : this.signIn();
  }

  validateForms(): boolean {
    if (this.userForm.invalid) {
      this.messageConfirmationService.showWarning('Atenção', 'Preencha todos os campos obrigatórios');
      return true;
    }

    return false;
  }

  handleCreateUser() {
    this.createUser = !this.createUser;

    if (this.createUser) {
      this.username?.setValidators(Validators.required);
      this.birthdate?.setValidators(Validators.required);
      this.cpf?.setValidators(Validators.required);
    } else {
      this.username?.clearValidators();
      this.birthdate?.clearValidators();
      this.cpf?.clearValidators();
      this.cnpj?.clearValidators();
      this.userForm.reset();
    }
  }

  signIn() {
    this.loading = true;

    this.usuarioService
      .signIn(this.userForm.value)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: AuthUser) => {
          this.authService.setAuthResponse(response);

          this.router.navigate(['hopeshare/home']);
        },
        error: () => {
          this.messageConfirmationService.showWarning('Atenção', 'E-mail ou senha inválidos!');
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  createUserAccount() {
    this.loading = true;

    this.usuarioService
      .saveUser(this.userForm!.value)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: any) => {
          this.authService.setAuthResponse(response);

          this.router.navigate(['hopeshare/home']);
        },
        error: () => {
          this.messageConfirmationService.showError(
            'Erro',
            'Não foi possível criar o usuário. Verifique os dados informados e tente novamente.'
          );
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get cnpj() {
    return this.userForm.get('cnpj');
  }

  get cpf() {
    return this.userForm.get('cpf');
  }

  get birthdate() {
    return this.userForm.get('birthdate');
  }

  get type_user() {
    return this.userForm.get('type_user');
  }

  get rememberUser() {
    return this.userForm.get('rememberUser');
  }

  get user_id() {
    return this.userForm.get('user_id');
  }
}

