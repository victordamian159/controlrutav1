import {User} from "./user.model";
/**
 * Created by xavi on 5/17/17.
 */
export class Session {
  public token: string; /*TOKEN DE AUTHENTICACION */
  public user: User;  /* INSTANCIA DE MODELO USUARIO */
}
