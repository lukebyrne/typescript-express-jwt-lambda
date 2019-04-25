export type typeUser = { id: number; email: string; password: string }

export type typeClaims = {
  sub: string
  email: string
}

export type typeRoles = { name: number; map: Function }
export type typeRole = { name: string }
