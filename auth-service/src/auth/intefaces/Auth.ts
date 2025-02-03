import { Roles } from "../enums/roles.enum"

export class IAuth {
  id: number
  username: string
  password: string
  role: Roles
}
