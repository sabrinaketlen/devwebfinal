export type Livro = {
  id: number,
  nome: string,
  autor: string,
  genero: string,
  sinopse: string,
  capa: Capa,
  nota: number,
  caps: number
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