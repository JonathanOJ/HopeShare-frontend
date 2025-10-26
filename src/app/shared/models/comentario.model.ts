export interface Comentario {
  comment_id: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
  user: {
    user_id: string;
    username: string;
    image?: string;
  };
  campanha_id: string;
}

