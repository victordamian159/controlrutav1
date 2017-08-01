import {Component, OnInit} from '@angular/core';
import {PersService} from '../service/personal.service';

@Component({
    selector: 'app-personal',
    templateUrl	: '../views/personal.component.html',
    styleUrls: ['../styles/personal.component.css']
})

export class PersComponent implements OnInit{
    /*OBJETOS*/
        personal={
            PeId :null,
            PeNombres : "",
            PeApellidos : "",
            PeDni : "",
            PeFecNac : "",
            PeDireccion :"",
            PeTipo :"",
            PeTipoLicencia :"",
            PeNMovil :"",
            PeNFijo :"",
            PeEmail :"",
            getPeFechaIng :"",
            PeFechaSal :"",
            UsId:0,
            UsFechaReg :null,
            PeSexo:null,
            PeEstCivil :"",
        }
        _personal:any;
        personalArr=[];
        _personalArr:any[]=[];

    /*BORRAR CUANDO SE TENGAS LOS SERVICIOS*/
        borrarpersonal : any ={
            PeId :null,
            PeNombres : "",
            PeApellidos : "",
            PeDni : "",
            PeFecNac : "",
            PeDireccion :"",
            PeTipo :"",
            PeTipoLicencia :"",
            PeNMovil :"",
            PeNFijo :"",
            PeEmail :"",
            PeFechaIng :"",
            PeFechaSal :"",
            UsId:0,
            UsFechaReg :null,
            PeSexo:null,
            PeEstCivil :"",
        }

    /*VARIABLES DISPLAY VENTANAS MODAL*/
        displayNuevo : boolean = false;
        displayEliminar : boolean = false;
        displayConfEditar : boolean = false;

    /* VARIABLE MENSAJE MODAL */ 
        mensaje : string
        titulo : string

    /* OTRAS VARIABLES */
        idReg : number;
        private errorMessage:string='';
        private isLoading: boolean = false;  
        private peid : number;
        private usid:number;
        private emid:number;
        private genero:any;
        private estCivil:any;
        private PeSexo:string; /* VARIABLE ASOCIADA EN COMBO SEXO */
        private PeEstCivil:string; /* VARIABLE ASOCIADA EN COMBO EST CIVIL */

    ngOnInit(){
        this.getallpersonal();
        this.usid=1; /* AQUI PONER EL VALOR DEVUELTO DEL LOGIN */
        this.genero=[{id:false,sexo:"Masculino"},{id:true,sexo:"Femenino"}];
        this.estCivil=[{id:"01",estado:"Soltero"},{id:"02",estado:"Casado"},{id:"03",estado:"Conviviente"},{id:"04",estado:"Viudo"},{id:"05",estado:"Divorciado"}];
    }

    constructor(private personaService : PersService){}

    /*PROCEDURES */
        /* GET ALL */
            getallpersonal(){
                let arrper:any[]=[];
                this.personaService.getallpersonal().subscribe(
                    data => {arrper=data; console.log(arrper); this.mgPersonal(arrper);}
                );
            }
        /* GET BY ID */
            getpersonalbyid(peid:number){
                let objPer:any;
                this.personaService.getPersonaById(peid).subscribe(
                    data => { objPer = data; console.log(objPer); this.mformPersona(objPer);},
                            err => {this.errorMessage = err}, 
                            () =>this.isLoading = false
                );
            }
        /* GET SAVE */
            savepersonal(obj : Object){
                this.personaService.savePersona(obj).subscribe( 
                    realizar => { this.getallpersonal();},
                        err => { this.errorMessage = err }
                );
            }
        /* GET DELETE */
            deletepersona(peid:number){
                this.personaService.deletePersona(peid).subscribe(
                     realizar => {this.getallpersonal(); },
                     err => {console.log(err);}
                );
            }
        /* GET NEW */
            nuevapersonaProc(){
                let nwpersona:any;
                this.personaService.newPersona().subscribe(
                    data => {nwpersona=data; console.log(nwpersona); this.peid=0;}
                );
            }

    /*MOSTRAR PERSONAL*/
        /* GRILLA */
            mgPersonal(arrper=[]){
                this.personalArr=[];/* LIMPIANDO ARRAY */
                for(let per of arrper){
                    this.personalArr.push({
                        nro : 0,
                        PeId:per.PeId,
                        PeNombres: per.PeNombres,
                        PeApellidos: per.PeApellidos,
                        PeDNI: per.PeDNI,
                        PeDireccion: per.PeDireccion,
                        PeTipoLicencia: per.PeTipoLicencia,
                        PeCelular: per.PeCelular,
                    });
                }
                for(let i=0; i<this.personalArr.length; i++){
                    this.personalArr[i].nro = i+1;
                }
            }

        /* FORMULARIO */
            mformPersona(objPer:Object){
                console.log(objPer);
            }

    /*FUN ASOCIADA BTNNUEVO PERSONAL(FORM PRINCIPAL)*/
        nuevoPersonal(){
            this.titulo="Nuevo Registro de Personal";
            this.displayNuevo=true;
            /*CONSULTA NUEVO PERSONAL*/
            this.nuevapersonaProc();
        }

    guardarPersonal(){
        this.displayNuevo=false;
        this.personal.UsFechaReg = new Date(); /*FECHA ACTUAL DEL SISTEMA */
        this.personal.UsId=this.usid;


        /*REEMPLAZAR POR EL VARIABLE CONSULTA NUEVO REG */
        this._personal = {
            PeId : this.personal.PeId,
            PeNombres : this.personal.PeNombres,
            PeApellidos : this.personal.PeApellidos,
            PeDNI : this.personal.PeDni,
            PeFecNac : this.fecha(this.personal.PeFecNac),
            PeDireccion :this.personal.PeDireccion,
            PeTipo :this.personal.PeTipo,
            PeTipoLicencia :this.personal.PeTipoLicencia,
            PeCelular :this.personal.PeNMovil,
            PeTelefonoFijo :this.personal.PeNFijo,
            PeEmail :this.personal.PeEmail,
            getPeFechaIng : this.fecha(this.personal.getPeFechaIng),
            PeFechaSal : this.fecha(this.personal.PeFechaSal),
            UsId:this.personal.UsId,
            UsFechaReg : this.personal.UsFechaReg,
            PeSexo:this.personal.PeSexo,
            PeEstadoCivil :this.personal.PeEstCivil,
        };

        /*CONDICIONAL EN CASO DE NUEVO O EDITANDO*/
        if(this.peid==0){
            this._personal.PeId=0;
            
        }else if(this.peid!=0){
            this._personal.PeId=this.peid;
            /*this._personal.PeFecNac = this.fecha(this.personal.PeFecNac), this._personal.PeFechaIng = this.fecha(this.personal.PeFechaIng), this._personal.PeFechaSal = this.fecha(this.personal.PeFechaSal), this._personal=this.personal;*/
        }
        
        console.log("guardado");
        console.log(this._personal);
        /* CONSULTA GUARDAR PERSONAL*/
        this.savepersonal(this._personal);
    }

    cancelarPersonal(){
        this.displayNuevo=false;
    }

    /*EDITAR PERSONAL*/
        editarPersonal(perid : number){
            this.mensaje="Editar Registro";
            this.peid=perid;
            this.displayConfEditar=true;
        }

        verificarEditar(){
            this.getpersonalbyid(this.peid);
            this.displayConfEditar=false;
        }

        cancelarEditar(){
            this.peid=null;
            this.displayConfEditar=false;
        }

    /*ELIMINAR PERSONAL*/
        eliminarPersonal(perid : number){
            this.peid=perid;
            this.mensaje="¿Esta Seguro De Eliminar El Registro?";
            console.log("eliminar : "+this.peid);
            this.displayEliminar=true;
        }
        verificarEliminar(){
            this.mensaje="";
            this.displayEliminar=false;
            /*PROCEDURE ELIMINAR*/
                this.deletepersona(this.peid);
        }

        cancelarEliminar(){
            this.peid=null;
            this.mensaje="";
            this.displayEliminar=false;
            console.log("cancelar");
        }

    /* FUNCION ASOCIADA COMBO GENERO */
        funCboPeGeneroId(){
            this.personal.PeSexo=this.PeSexo
        }

    /* FUNCION ASOCIADA COMBO GENERO */
        funCbopeEstCivilId(){
            this.personal.PeEstCivil=this.PeEstCivil
        }

/*CREAR CLASES PARA ESTO, Y BORRAR ESTO*/
       //CONVERTIR STRING A DATE FORMULARIO A BD  HORAS
    hora(fecha : string) : Date{
        //FECHA               
        let thoy:Date,  otra:Date, horaTarjeta:string;
        thoy=new Date();
        if(fecha.length<=5){ fecha = fecha+":00"; }
        horaTarjeta=fecha;
        let resultado=horaTarjeta.split(':');
        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
        //console.log(otra);
        return otra; 
        
    }

    //CONVERTIR DATE A STRING DE BD A FORMULARIO HORAS
    _hora(fecha : Date) :string{
        let hora : string; let _hora : string; let _fecha = new Date(fecha);
        _hora =  (_fecha.getHours() - 1).toString();// restando 1 hora (CORREGIR EN EL BACKEND)
            hora = _hora + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();

            hora = this.cCeroHora(hora);
        return hora;
    }
    //COMPLETANDO CEROS EN CASO DE NECESITAR PARA HORAS Y FECHAS   2017/
    cCeroHora(h:string) :string{
            //DIVIDIRLO EN PARTES Y COMPLETAR LOS CEROS PARA QUE LOS ELEMENTOS SEAN TODOS PARES
            let hora : string, _hora :string, resultado, i=0;
            resultado = h.split(':');
            while(i<resultado.length){
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _hora=resultado[0]+":"+resultado[1]+":"+resultado[2];
        return _hora;
    }

    cCeroFecha(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('/');
            while(i<resultado.length){
                resultado[i]=resultado[i].trim(); //BORRANDO ESPACIOS EN BLANCO
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _fecha=resultado[0]+"/"+resultado[1]+"/"+resultado[2];
        
        return _fecha
    }

    cCeroFechaForEditar(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('/');
            while(i<resultado.length){
                resultado[i]=resultado[i].trim(); //BORRANDO ESPACIOS EN BLANCO
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _fecha=resultado[0]+"-"+resultado[1]+"-"+resultado[2];
        
        return _fecha
    }
    
    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    _fecha(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha); 
        _fechaProg=(_fecha.getDate()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+ (_fecha.getFullYear()).toString();
        //_fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        
        _fechaProg=this.cCeroFecha(_fechaProg);
        return  _fechaProg;
    }
      //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD 
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        return _thoy;
    }

}