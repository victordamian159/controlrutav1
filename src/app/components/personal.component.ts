import {Component, OnInit} from '@angular/core';

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
        PeFechaIng :"",
        PeFechaSal :"",
        UsId:0,
        UsFechaReg :null,
        PeSexo:null,
        PeEstCivil :"",
    }
    personalArr=[];

    /*BORRAR CUANDO SE TENGAS LOS SERVICIOS*/
    bpersonal = [] /*BORRAR ESTE ARRAY, SOLO TEMPORAL*/
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
    displayEditar : boolean = false;

    /* VARIABLE MENSAJE MODAL */ 
    mensaje : string
    titulo : string

    /* OTRAS VARIABLES */
    idReg : number;
    ngOnInit(){
        this.bpersonal=[{
            PeNombres:"Victor Damian",
            PeApellidos:"Luque Velasquez",
            PeDni:"46692919",
            PeDireccion:"Natividad Nro 1580",
            PeTipo:"Administrador",
            PeLicencia:"FASFASD 4545",
            PeCelular :"952988103"
        },{
            PeNombres:"Mariano Octavio",
            PeApellidos:"Cartagena Matute",
            PeDni:"00564812",
            PeDireccion:"Los Arenales Nro 1320",
            PeTipo:"Chule",
            PeLicencia:"RWERW 666",
            PeCelular :"941553230"
        }]
        console.log(this.bpersonal);
        this.mgPersonal();
    }

    //MOSTRAR GRILLA PERSONAL
    mgPersonal(){
        for(let per of this.bpersonal){
            this.personalArr.push({
                nro : 0,
                PeNombres: per.PeNombres,
                PeApellidos: per.PeApellidos,
                PeDni: per.PeDni,
                PeDireccion: per.PeDireccion,
                PeTipo: per.PeTipo,
                PeLicencia: per.PeLicencia,
                PeCelular: per.PeCelular,
            });

        for(let i=0; i<this.personalArr.length; i++){
            this.personalArr[i].nro = i+1;
        }
        }
        console.log(this.personalArr);
    }

    /*NUEVO PERSONAL*/
    nuevoPersonal(){
        this.titulo="Nuevo Registro de Personal";
        this.displayNuevo=true;
        /*CONSULTA NUEVO PERSONAL*/
        console.log("NUEVO : objeto nuevopersonal");
    }
    guardarPersonal(){
        this.displayNuevo=false;
        console.log(this.personal);
        /*CONDICIONAL EN CASO DE NUEVO O EDITANDO*/
        if(this.personal.PeId==0){
            
            this.personal.PeId=0; /*NUEVO REGISTRO */
            this.personal.UsFechaReg = new Date(); /*FECHA ACTUAL DEL SISTEMA */

            /*REEMPLAZAR POR EL VARIABLE CONSULTA NUEVO REG */
            this.borrarpersonal = {
                PeId : this.personal.PeId,
                PeNombres : this.personal.PeNombres,
                PeApellidos : this.personal.PeApellidos,
                PeDni : this.personal.PeDni,
                PeFecNac : this.fecha(this.personal.PeFecNac),
                PeDireccion :this.personal.PeDireccion,
                PeTipo :this.personal.PeTipo,
                PeTipoLicencia :this.personal.PeTipoLicencia,
                PeNMovil :this.personal.PeNMovil,
                PeNFijo :this.personal.PeNFijo,
                PeEmail :this.personal.PeEmail,
                PeFechaIng : this.fecha(this.personal.PeFechaIng),
                PeFechaSal : this.fecha(this.personal.PeFechaSal),
                UsId:this.personal.UsId,
                UsFechaReg : this.personal.UsFechaReg,
                PeSexo:this.personal.PeSexo,
                PeEstCivil :this.personal.PeEstCivil,
            };

            /*CONSULTA REST NUEVO REG */
            
        }else if(this.personal.PeId!=0){
            this.borrarpersonal.PeFecNac = this.fecha(this.personal.PeFecNac),
            this.borrarpersonal.PeFechaIng = this.fecha(this.personal.PeFechaIng),
            this.borrarpersonal.PeFechaSal = this.fecha(this.personal.PeFechaSal),
            this.borrarpersonal=this.personal;
        }
        
        console.log("guardado");
        console.log(this.personal);
        console.log(this.borrarpersonal);
        /* CONSULTA GUARDAR PERSONAL*/
    }
    cancelarPersonal(){
        this.displayNuevo=false;
    }

    /*EDITAR PERSONAL*/
    editarPersonal(per : Object){
        this.titulo="Nuevo Registro";
        console.log(per);
    }

    /*ELIMINAR PERSONAL*/
    eliminarPersonal(id : number){
        console.log("eliminar : "+id);
        this.idReg=id;
        this.mensaje="¿Esta Seguro De Eliminar El Registro?";
        this.displayEliminar=true;
    }
    verificarEliminar(){
        this.mensaje="";
        this.displayEliminar=false;
        /*PROCEDURE ELIMINAR*/
        console.log("id eliminar: "+this.idReg);
    }
    cancelarEliminar(){
        this.idReg=undefined;
        this.mensaje="";
        this.displayEliminar=false;
        console.log("cancelar");
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