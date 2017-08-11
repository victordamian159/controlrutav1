export class GlobalVars{
    public nombre:string;
    public apellidos:string;
    public emid:number;
    public userid:number;
    public dataUser:any;
    constructor(){}

    /* FUNCIONES */
        /* USADO PARA OCULTAR EL NAVBAR :s */
        public localstorageItems():boolean{
            if(localStorage.getItem('DATOSUSER')!=null || localStorage.getItem('DATOSUSER')!=undefined){
                return true;
            }else{
                return false;
            }
        }

        /* RECUPERANDO DATOS DEL USUARIO AUTENTICADO */
        public GetDatosUsuario():Object{
            let datos:any;
                datos=JSON.parse(localStorage.getItem('DATOSUSER'));
            return datos;
        }
        public GetEmId():number{
            let emid:number, objdata:any;
            objdata = JSON.parse(localStorage.getItem('DATOSUSER'));
            emid=objdata[0].EmId;
            return emid;
        }
        public GetUsId():number{
            let usid:number, objdata:any;
            objdata = JSON.parse(localStorage.getItem('DATOSUSER'));
            usid=objdata[0].UsId;
            return usid;
        }
}
