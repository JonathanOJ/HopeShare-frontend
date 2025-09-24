import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampanhaService } from '../../../../../../shared/services/campanha.service';
import { Comentario, CreateComentarioRequest } from '../../../../../../shared/models/comentario.model';
import { Campanha } from '../../../../../../shared/models/campanha.model';
import { AuthUser } from '../../../../../../shared/models/auth';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { MessageConfirmationService } from '../../../../../../shared/services/message-confirmation.service';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrl: './comments-modal.component.css',
})
export class CommentsModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() campanha: Campanha | null = null;
  @Output() onClose = new EventEmitter<void>();

  commentForm!: FormGroup;
  comments: Comentario[] = [];
  loading = false;
  loadingComments = false;
  currentUser: AuthUser | null = null;

  constructor(
    private fb: FormBuilder,
    private campanhaService: CampanhaService,
    private authService: AuthService,
    private messageService: MessageConfirmationService
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
    });

    // Obter usuário atual
    this.currentUser = this.authService.getAuthResponse();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible && this.campanha) {
      this.loadComments();
    }
  }

  loadComments() {
    if (!this.campanha) return;

    this.loadingComments = true;
    this.campanhaService.getComments(this.campanha.campanha_id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loadingComments = false;
      },
      error: () => {
        this.messageService.showError('Erro', 'Erro ao carregar comentários.');
        this.loadingComments = false;
      },
    });
  }

  onSubmit() {
    if (this.commentForm.invalid || !this.campanha) return;

    // Verificar se o usuário pode comentar
    if (!this.canComment()) {
      this.messageService.showWarning('Restrição', this.getCommentRestrictionMessage());
      return;
    }

    this.loading = true;
    const commentData: CreateComentarioRequest = this.commentForm.value;

    this.campanhaService.addComment(this.campanha.campanha_id, commentData).subscribe({
      next: (newComment) => {
        this.comments.unshift(newComment); // Adiciona no início da lista
        this.commentForm.reset();
        this.messageService.showMessage('Comentário', 'Comentário adicionado com sucesso!');
        this.loading = false;
      },
      error: () => {
        this.messageService.showError('Erro', 'Erro ao adicionar comentário. Tente novamente.');
        this.loading = false;
      },
    });
  }

  deleteComment(comment: Comentario) {
    if (!this.campanha || !comment.id) return;

    this.campanhaService.deleteComment(this.campanha.campanha_id, comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c.id !== comment.id);
        this.messageService.showMessage('Comentário', 'Comentário removido com sucesso!');
      },
      error: () => {
        this.messageService.showError('Erro', 'Erro ao remover comentário.');
      },
    });
  }

  closeModal() {
    this.visible = false;
    this.commentForm.reset();
    this.comments = [];
    this.loading = false;
    this.onClose.emit();
  }

  getFieldError(field: string): string {
    const control = this.commentForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Comentário é obrigatório';
      if (control.errors['minlength']) return 'Comentário deve ter pelo menos 5 caracteres';
      if (control.errors['maxlength']) return 'Comentário deve ter no máximo 500 caracteres';
    }
    return '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  canDeleteComment(comment: Comentario): boolean {
    if (!this.currentUser) return false;

    // Admin pode deletar qualquer comentário
    if (this.currentUser.is_admin) return true;

    // Usuário pode deletar apenas seus próprios comentários
    return comment.user.id === this.currentUser.user_id;
  }

  canComment(): boolean {
    if (!this.currentUser || !this.campanha) return false;

    // Admin pode sempre comentar
    if (this.currentUser.is_admin) return true;

    // Responsável pela campanha pode sempre comentar
    if (this.campanha.user_responsable.user_id === this.currentUser.user_id) return true;

    // Verificar se o usuário fez doação para esta campanha
    return this.campanha.users_donated.some((donor) => donor.user_id === this.currentUser!.user_id);
  }

  getCommentRestrictionMessage(): string {
    if (!this.currentUser || !this.campanha) return '';

    // Se não pode comentar, mostrar mensagem apropriada
    if (!this.canComment()) {
      return 'Você precisa fazer uma doação para esta campanha para poder comentar.';
    }

    return '';
  }
}

