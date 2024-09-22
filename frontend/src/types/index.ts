export type Livro = {
  id: number,
  Nome: string   // Permitir undefined caso o dado não esteja presente
  Autor: string
  Genero: string
  Sinopse: string
  Capa: Capa    // O objeto Capa pode ser undefined se não estiver carregado
  Nota?: number   // Pode ser undefined se ainda não tiver nota atribuída
  nCapitulos: number    // Pode ser undefined caso o número de capítulos não esteja definido
}

type Capa = {
  id: number,
  url: string
}

export type User = {
  id: number,
  username: string,
  role: Role,
  email: string
}

type Role = {
  name: string
}

export type Poste = {
  id: number;
  Conteudo: string;
  Dado: number;
  Tipo: string;
  livro: Livro; // Supondo que Livro já está definido corretamente
  users_permissions_user: User; // Verifique a definição do tipo User
}

export type Estante = {
  id: number,
  livros: Livro[],
  user: User,
}


export interface ApplicationError {
  error: {
    name: string,
    message: string,
  }
}