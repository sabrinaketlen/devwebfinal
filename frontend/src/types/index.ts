export type Livro = {
  id: number,
  nome: string | undefined,   // Permitir undefined caso o dado não esteja presente
  autor: string | undefined,
  genero: string | undefined,
  sinopse: string | undefined,
  capa: Capa | undefined,     // O objeto Capa pode ser undefined se não estiver carregado
  nota: number | undefined,   // Pode ser undefined se ainda não tiver nota atribuída
  caps: number | undefined    // Pode ser undefined caso o número de capítulos não esteja definido
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

export interface ApplicationError {
  error: {
    name: string,
    message: string,
  }
}