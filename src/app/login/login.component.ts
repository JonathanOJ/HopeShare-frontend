import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthUser, TipoUsuario, TipoUsuarioList } from '../shared/models/auth';
import { AuthService } from '../shared/services/auth.service';
import { LoadingService } from '../shared/services/loading.service';
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
  private loadingService = inject(LoadingService);
  private messageConfirmationService = inject(MessageConfirmationService);

  private destroy$ = new Subject();

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const errors: ValidationErrors = {};

      if (value.length < 8) {
        errors['minLength'] = true;
      }

      if (!/[A-Z]/.test(value)) {
        errors['uppercase'] = true;
      }

      if (!/[0-9]/.test(value)) {
        errors['number'] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

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
    });

    this.router.url === '/login/register' ? (this.createUser = true) : null;

    console.log(this.router.url);

    if (this.createUser) {
      this.username?.setValidators(Validators.required);
      this.password?.setValidators([Validators.required, this.passwordValidator()]);
    }

    this.userForm.updateValueAndValidity();

    this.authService.getAuthResponse() ? this.router.navigate(['hopeshare/home']) : null;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setValidatorsForTypeUser() {
    if (this.type_user?.value === TipoUsuario.EMPRESA) {
      this.cnpj?.setValidators([Validators.required]);
      this.cpf?.clearValidators();
      this.birthdate?.clearValidators();
    } else if (this.type_user?.value === TipoUsuario.USER) {
      this.cpf?.setValidators([Validators.required]);
      this.birthdate?.setValidators([Validators.required]);
      this.cnpj?.clearValidators();
    }
    this.cnpj?.updateValueAndValidity();
    this.cpf?.updateValueAndValidity();
    this.birthdate?.updateValueAndValidity();
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
    console.log(this.userForm);
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
    this.loadingService.start();

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
        this.loadingService.done();
      });
  }

  createUserAccount() {
    this.loading = true;
    this.loadingService.start();

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
        this.loadingService.done();
      });
  }

  hasMinLength(): boolean {
    const password = this.password?.value;
    return password && password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.password?.value;
    return password && /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.password?.value;
    return password && /[0-9]/.test(password);
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

  get user_id() {
    return this.userForm.get('user_id');
  }
}

