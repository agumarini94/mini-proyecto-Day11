//Este archivo define la "forma" de los datos.
export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Story {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}