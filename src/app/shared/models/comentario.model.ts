export interface Comentario {
  id?: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
  user: {
    id: string;
    username: string;
    image?: string;
  };
  campanha_id: string;
}

export interface CreateComentarioRequest {
  content: string;
}
