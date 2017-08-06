import {Component, OnInit} from '@angular/core';
import {PersService} from '../service/personal.service';
import {_fecha,fecha,formatFech,cCeroFecha} from 'app/funciones';
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
            /*PeTipo :"",*/
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
                    data => {arrper=data; console.log(arrper);this.mgPersonal(arrper);}
                );
            }
        /* GET BY ID */
            getpersonalbyid(peid:number){
                let objPer:any;
                this.personaService.getPersonaById(peid).subscribe(
                    data => { objPer = data; this.mformPersona(objPer);},
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
                    data => {nwpersona=data; this.peid=0;
                             this.personal=nwpersona; this.PeEstCivil=""; this.PeSexo="";  }
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
            mformPersona(objPer:any){
                this.personal={
                    PeId :objPer.PeId,
                    PeNombres : objPer.PeNombres,
                    PeApellidos : objPer.PeApellidos,
                    PeDni : objPer.PeDNI,
                    PeFecNac : formatFech(_fecha(objPer.PeFecNac)),
                    PeDireccion :objPer.PeDireccion,
                    /*PeTipo :objPer.PeTipo,*/
                    PeTipoLicencia :objPer.PeTipoLicencia,
                    PeNMovil :objPer.PeCelular,
                    PeNFijo :objPer.PeTelefonoFijo,
                    PeEmail :objPer.PeEmail,
                    getPeFechaIng :formatFech(_fecha(objPer.getPeFechaIng)),
                    PeFechaSal :formatFech(_fecha(objPer.PeFechaSal)),
                    UsId:objPer.UsId,
                    UsFechaReg :objPer.UsFechaReg,
                    PeSexo:objPer.PeSexo,
                    PeEstCivil :objPer.PeEstadoCivil
                }
                this.PeSexo=this.personal.PeSexo;
                this.PeEstCivil=this.personal.PeEstCivil;
                console.log(this.personal);
            }

    /*FUN ASOCIADA BTNNUEVO PERSONAL(FORM PRINCIPAL)*/

        /* BTN NUEVO */
        nuevoPersonal(){
            this.mensaje="Nuevo Registro de Personal";
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
                PeFecNac : fecha(this.personal.PeFecNac),
                PeDireccion :this.personal.PeDireccion,
                //PeTipo :this.personal.PeTipo,
                PeTipoLicencia :this.personal.PeTipoLicencia,
                PeCelular :this.personal.PeNMovil,
                PeTelefonoFijo :this.personal.PeNFijo,
                PeEmail :this.personal.PeEmail,
                getPeFechaIng : fecha(this.personal.getPeFechaIng),
                PeFechaSal : fecha(this.personal.PeFechaSal),
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
               
            }

            console.log(this._personal);
            /* CONSULTA GUARDAR PERSONAL*/
            this.savepersonal(this._personal);
            this.mensaje="";
        }

        cancelarPersonal(){

            this.personal.PeNombres = "",
            this.personal.PeApellidos = "",
            this.personal.PeDni = "",
            this.personal.PeFecNac = "",
            this.personal.PeDireccion ="",
            this.personal.PeTipoLicencia ="",
            this.personal.PeNMovil ="",
            this.personal.PeNFijo ="",
            this.personal.PeEmail ="",
            this.personal.getPeFechaIng ="",
            this.personal.PeFechaSal ="",
            
            this.peid=null
            this.PeSexo=null
            this.PeEstCivil=null
            this.displayNuevo=false;
        }

    /*EDITAR PERSONAL*/
        /* FUNCION ASOCIADA A BOTON FILA DATATABLE */
        editarPersonal(perid : number){
            this.mensaje="Editar Registro";
            this.peid=perid;
            this.displayConfEditar=true;
        }

        verificarEditar(){
            this.getpersonalbyid(this.peid);
            this.displayConfEditar=false;
            this.displayNuevo=true; /* USANDO ESTA VENTANA TBN PARA EDITAR LA TABLA */
        }

        cancelarEditar(){
            this.peid=null;
            this.displayConfEditar=false;
        }

    /*ELIMINAR PERSONAL*/
        eliminarPersonal(perid : number){
            this.peid=perid;
            this.mensaje="¿Esta Seguro De Eliminar El Registro?";
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
        }

    /* FUNCION ASOCIADA COMBO GENERO */
        funCboPeGeneroId(){
            this.personal.PeSexo=this.PeSexo
        }

    /* FUNCION ASOCIADA COMBO GENERO */
        funCbopeEstCivilId(){
            this.personal.PeEstCivil=this.PeEstCivil
        }
}