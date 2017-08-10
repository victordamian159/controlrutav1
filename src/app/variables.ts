export class GlobalVars{
    constructor(){}
    public localstorageItems():boolean{
        if(localStorage.getItem('DATOSUSER')!=null || localStorage.getItem('DATOSUSER')!=undefined){
            return true;
        }else{
            return false;
        }
    }
}
