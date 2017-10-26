import {Component,OnInit} from '@angular/core';
import {fechaActual1,editf1,hora,_hora,extFuncArrDistTmps,extFuncArrHora,operMHoras,operSHoras, extFuncCorrecHora} from 'app/funciones';
import {GlobalVars} from 'app/variables';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {ProgramacionService} from '../service/prog.service';
import {PlacasService} from '../service/placas.service';
import {distribTiempoService} from '../service/distribTiempo.service'

@Component({
    selector:'app-distribTiempo',
    templateUrl:'../views/distribTiempo.component.html',
    styleUrls: ['../styles/distribTiempo.component.css']
})

export class distribTiempoComponent implements OnInit{
    /* VARIABLES */
    private mensaje:string;
    private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  
    private emID:number;
    private UsId:number;
    private SuEmId:number;
    private objTiempoSalida:any;
    private TiSaId:number; //PARA TABLA TIEMPOSALIDA
    private TiPrId:number;
    private fecha:string;
    private _prId:number;
    private _TiSaId:number;//PARA TABLA TIEMPOPROGRAMADO Y ONROWSELECT
    private __TiSaId:number; //TIEMPO SALIDA PARA VTN CONFIRMAR
    private TiSaValor:string;
    private BuId:number;
    private fechaAsigna:string; //fecha en la Q SE HIZO LA ASIGNACION DE TIEMPOS A MINIBUSES
    private mensajeconfirmar:string;

    /* ARRAY */
    private tpoDistr:any[]; /* FORMA DISTRUUBCION */
    private arrProgr:any[]; //PARA COMBO PROGRAMACION
    private arrProgramacion:any[]; //TABLA PROGRAMACIONES MODAL
    private arrSubEmps:any[];
    private arrmgtmpsal:any[];
    private arrplacas:any[];
    private arrprogfecha:any[];
    private selectRowtbTimeSep:any[];
    private arrmgtmpprog:any[];

    /*DISPLAY MODALES */
    private disInitTimesProg:boolean;
    private disSepacionTimes:boolean;
    private disReDistribTimes:boolean;
    private disAsignarTimesSeparacion:boolean;
    private displayConfirmarEliminarTS:boolean;
    private displayConfirmarEditarTS:boolean;

    ngOnInit(){
        this.funcBtnSacarTiemposSalida();

        this.getallsubemp(this.emID);
        this.getallplacasbusbyemsuem(this.emID,0);
        this.getalltiemposalidabyem(this.emID);
        this.getallprogramacionbyem(this.emID,0);
        //console.log(extFuncArrDistTmps("00:03:45","00:00:25"));
    }
    constructor(private empsubempservice : EmpSubEmpService, 
                private tiemsalidaservice:distribTiempoService,
                private progservice:ProgramacionService,
                private placaService: PlacasService,
                public ClassGlobal:GlobalVars){
        this.tpoDistr= [{id:"01",nomb:"MENOR TIEMPO"},
                        {id:"02",nomb:"MANUAL"},
                        {id:"03",nomb:"RECORRER"}];
        this.emID=this.ClassGlobal.GetEmId();
        this.UsId=this.ClassGlobal.GetUsId();

        this.disInitTimesProg=false;
        this.disSepacionTimes=false;
        this.disAsignarTimesSeparacion=false;
        this.displayConfirmarEditarTS=false;
        this.displayConfirmarEliminarTS=false;

        this.SuEmId=0;
        this._TiSaId=0;
        this.arrplacas=[];
        this.objTiempoSalida={
            SuEmId:null,
            TiSaId:null,
            TiSaNombre:"",
            TiSaValor:"",
            UsFechaReg:"",
            UsId:null
        }
        this.selectRowtbTimeSep=[];
        this.arrmgtmpprog=[];
        this.arrmgtmpsal=[];
        this.fechaAsigna=editf1(fechaActual1());
    }

    /* PROCEDURES */
        //GETTERS
            //PROGRAMACIONES
            getallprogramacionbyem(emId:number, anio: number){
                let arrprog:any[]=[];
                this.progservice.getAllProgramacionByEm(emId, anio).subscribe(
                    data => {
                                arrprog=data; 
                                this.mcobprogramacion(arrprog);
                            }
                );
            }
            //EMPRESAS
            getallsubemp(emId:number){
                this.empsubempservice.getallsubempresasbyemid(emId).subscribe(
                    data=>{this.arrSubEmps=data;},
                    err=>{this.errorMessage=err},
                    ()=>this.isLoading=false
                );
            }
            //TIEMPOSALIDA
                getalltiemposalidabyem(emId:number){
                    let arralltmsa:any;
                    this.tiemsalidaservice.getalltiemposalidabyem(emId).subscribe(
                        data=>{arralltmsa=data; this.mgtiemposalida(arralltmsa);},
                        err=>{this.errorMessage;},
                        ()=>this.isLoading=false
                    );
                }
                gettiemposalidabyid(tisaid:number){
                    let objtisa:any;
                    this.tiemsalidaservice.gettiemposalidabyid(tisaid).subscribe(
                        data=>{objtisa=data; this.mInputTimeSalida(objtisa);},
                        err=>{this.errorMessage=err},
                        ()=>this.isLoading=false
                    );
                }
            //TIEMPO PROGRAMADO
                getalltiempoprogramadobytisaid(tisaid:number){
                    let objtipr:any[]=[];
                    this.tiemsalidaservice.getalltiempoprogramadobytisa(tisaid).subscribe(
                        data => {objtipr=data; this.mgtiempoprogramado(objtipr);},
                        err=>{this.errorMessage=err},
                        ()=>this.isLoading=false
                    );
                }
                gettiemprogramadobyid(tiprid:number){
                    let objtipr:any;
                    this.tiemsalidaservice.gettiempoprogramadobyid(tiprid).subscribe(
                        data=>{objtipr=data; console.log(objtipr);},
                        err=>{this.errorMessage=err},
                        ()=>this.isLoading=false
                    );
                }
            //PROCEDIMIENTO BUSCAR PROGRAMACION POR FECHA
            procFuncBuscarxFecha(prid:number, fecha:string){
                //var myJsonString = JSON.stringify(yourArray);
                let arrprogfecha:any[]=[];
                let string_arr:string;
                this.progservice.getAllProgramacionDetalleByPrFecha(prid,fecha).subscribe(
                    data=> {
                            this.arrprogfecha=data;
                            this.mgprogramacion(this.arrplacas, this.arrprogfecha);
                            },
                    err => {console.log(err);},
                    ()  => {}
                );
                
            }
            //CONSULTA RECUPERAR PLACAS
            getallplacasbusbyemsuem(emId : number, suemId : number){
                let arrplacas:any[]=[];
                let arrplaca:any;
                arrplaca=this.placaService.getAllPlacasBusByEmSuEm(emId,suemId).subscribe(
                    data => {   arrplacas = data;
                                this.arrplacas=arrplacas;
                            },
                    err=>{console.log(err);},
                    () =>{ }
                );
            }
        //MANTENIMIENTO
            //TIEMPOSALIDA
                procNewTimeSalida(){
                    let objnew:any;
                    this.tiemsalidaservice.newtiemposalida().subscribe(
                        data=>{objnew=data; 
                                this.objTiempoSalida.TiSaNombre=objnew.TiSaNombre;
                                this.objTiempoSalida.TiSaValor=objnew.TiSaNombre;
                                this.TiSaId=objnew.TiSaId;
                                console.log(this.TiSaId);}
                    );
                }
                procSaveTimeSalida(tmpSalida:any){
                    this.tiemsalidaservice.savetiemposalida(tmpSalida).subscribe(
                        data=>{console.log(data);},
                        err=>{this.errorMessage=err}
                    );
                }
                procEliminarSalida(TiSaId:number){
                    this.tiemsalidaservice.deletetiemposalida(TiSaId).subscribe(
                        data=>{this.getalltiemposalidabyem(this.emID);},
                        err=>{this.errorMessage=err}
                    );
                }
            
            //TIEMPOPROGRAMADO
                procNewTiempoProgramado(){
                    let objnew:any;
                    this.tiemsalidaservice.newtiempoprogramado().subscribe(
                        data=>{objnew=data; console.log(objnew); this.TiPrId=objnew.TiPrId;}
                    );
                }
                procSaveTimeProgramado(tmpProgramado:any){
                    this.tiemsalidaservice.savetiempoprogramado(tmpProgramado).subscribe(
                        data=>{console.log(data);},
                        err=>{this.errorMessage=err}
                    );
                }
                procEliminarProgramado(TiPrId:number){
                    this.tiemsalidaservice.deletetiempoprogramado(TiPrId).subscribe(
                        data=>{/*this.getalltiemposalidabyem(this.emID);*/},
                        err=>{this.errorMessage=err}
                    );
                }
    /* FUNCIONES */
        //SELECCION FILA TABLA ONROWSELECT()
            onRowPlaca(event){
                //console.log(event.data.BuId);
                this.BuId=event.data.BuId;
            }
            onRowTiempoSalida(event){
                //console.log(event.data.TiSaId);
                //console.log(event.data.TiSaValor);
                this._TiSaId=event.data.TiSaId;
                this.TiSaValor=event.data.TiSaValor;
                this.getalltiempoprogramadobytisaid(this._TiSaId);
            }
        //GUARDAR - CANCELAR
            //TIEMPO SALIDA
                guardarTmpo(){
                    let objsaveTiempoSalida:any;
                    this.disSepacionTimes=false;

                    objsaveTiempoSalida={
                        SuEmId:Number(this.SuEmId),
                        TiSaId:this.TiSaId,
                        TiSaNombre:this.objTiempoSalida.TiSaNombre,
                        TiSaValor:hora(this.objTiempoSalida.TiSaValor),
                        UsFechaReg:new Date(),
                        UsId:this.UsId
                    }
                    this.procSaveTimeSalida(objsaveTiempoSalida);
                }
                cancelarTmpo(){
                    this.disSepacionTimes=false;
                    this.objTiempoSalida.TiSaNombre="";
                    this.objTiempoSalida.TiSaValor="";
                }

            //TIEMPOPROGRAMADO
                guardartiempoprogramado(){
                    let objtiProg:any;
                    this.disAsignarTimesSeparacion=false;
                    objtiProg={
                        BuId:this.BuId,
                        TiPrId:this.TiPrId,
                        TiSaId:this._TiSaId,
                        UsFechaReg:new Date(),
                        UsId:this.UsId
                    }
                    this.selectRowtbTimeSep=null;
                    console.log(this.selectRowtbTimeSep);
                    this.procSaveTimeProgramado(objtiProg);
                }
                cancelartiempoprogramado(){
                    this.selectRowtbTimeSep=null;
                    this.disAsignarTimesSeparacion=false;
                }

        //MOSTRAR RESULTADO
        
            mcobprogramacion(arrprog=[]){
                this.fecha=editf1(fechaActual1()); //FECHA PARA EL INPUT DATE
                this.arrProgr=arrprog;
                //BUSCAR LA ULTIMA LISTA PROGRAMACION
                if(this.arrProgr.length>0){
                    this._prId=this.arrProgr[this.arrProgr.length-1].prId;
                }
            }
            mgtiemposalida(arrtmpsalido=[]){
                this.arrmgtmpsal=[];
                
                for(let tmpsal of arrtmpsalido){
                    this.arrmgtmpsal.push({
                        nro:0,
                        TiSaId:tmpsal.TiSaId,
                        TiSaNombre:tmpsal.TiSaNombre,
                        TiSaValor:_hora(tmpsal.TiSaValor)
                    });
                }
                for(let i=0; i<this.arrmgtmpsal.length;i++){
                    this.arrmgtmpsal[i].nro=i+1;
                }
            }
            mgtiempoprogramado(arrmgtmpprog=[]){
                let arrprog:any[]=[];
                this.arrmgtmpprog=[];

                //console.log(arrmgtmpprog);
                for(let tmpprog of arrmgtmpprog){
                    arrprog.push({
                        nro:0,
                        BuPlaca:tmpprog.BuPlaca,
                        BuDescripcion:tmpprog.BuDescripcion,
                        TiPrId:tmpprog.TiPrId
                    })
                }

                for(let i=0; i<arrmgtmpprog.length; i++){
                    arrprog[i].nro=i+1;
                }

                this.arrmgtmpprog=arrprog;
            }
            mInputTimeSalida(objtime:any){
                this.TiSaId=objtime.TiSaId;
                this.SuEmId=objtime.SuEmId;
                this.objTiempoSalida.TiSaNombre=objtime.TiSaNombre;
                this.objTiempoSalida.TiSaValor=_hora(objtime.TiSaValor);
                console.log(this.TiSaId);
                console.log(this.SuEmId);
            }
            //GRILLA PROGRAMACION DETALLE  -  POR LA FECHA
            mgprogramacion(placas=[], progDetalle){ 
                //console.log(placas);
                //console.log(progDetalle);
                let _progDetalle=[];
                //i: PARA RECORRER EL ARRAY, SI Y NO: CUANTOS SE ENCONTRARON Y NO SE ENCONTRARON
                let i = 0; let j=0;  let si=0; let no=0; let cen = 0, cen2=0; 
                let programacion=[]; let longProg = progDetalle.length;
                //console.log(placas);
                /* BUSCANDO POR PLACAS */
                while (i<placas.length && cen2==0){
                    /* BUSQUEDA */
                    while (j<progDetalle.length && cen==0){
                        /* CONDICIONAL BUSQUEDA */
                        if (progDetalle[i].BuId == placas[j].BuId){ 
                            //SI SON IGUALES CARGANDO EN OTRO ARRAY PARA PASAR A LA SIGUIENTE ETAPA
                            programacion.push({
                                BuId: progDetalle[i].BuId,
                                nroPlaca: placas[j].BuPlaca,
                                PrId:progDetalle[i].PrId,
                                PrDeOrden:progDetalle[i].PrDeOrden,
                                PrDeId: progDetalle[i].PrDeId,
                                PrDeAsignadoTarjeta:progDetalle[i].PrDeAsignadoTarjeta,
                                SuEmRSocial:placas[j].SuEmRSocial,
                                BuDescripcion:placas[j].BuDescripcion
                            });
                            cen = 1; 
                        }else if(progDetalle[i].BuId != placas[j].BuId){
                            /* CONTRARIO CONDICIONAL  */
                        }
                        j++;  
                    }
                    j=0;
                    i++;
                    cen = 0;
                    /* VERIFICANDO QUE SE ENCONTRARON TODAS BUID */
                    if(longProg==programacion.length){
                        cen2=1;
                    }
                }

                //AQUI SE ACTUALIZA EL BUID POR SU PLACA
                for(let progD of programacion){
                    /*/FILTRANDO SI ESTA ASIGNADO, SI LO ESTA NO SE PUEDE MOSTRAR
                    if(progD.PrDeAsignadoTarjeta != 1){}*/
                        _progDetalle.push({
                            nro:0,
                            BuId:progD.BuId,
                            nroPlaca:progD.nroPlaca,
                            PrId:progD.PrId,
                            PrDeOrden:progD.PrDeOrden,
                            PrDeId:progD.PrDeId,
                            PrDeAsignadoTarjeta:progD.PrDeAsignadoTarjeta,
                            SuEmRSocial:progD.SuEmRSocial,
                            BuDescripcion:progD.BuDescripcion
                            /*
                                PrDeFecha:progD.PrDeFecha,
                                UsFechaReg:progD.UsFechaReg,
                                UsId:progD.UsId,
                                PrDeBase:progD.PrDeBase,
                            */
                        });
                    
                }

                /* ENUMERANDO FILAS DE LA TABLA DE PROG, TABLA ASIG NUEVA PROGRAMACION */
                for(let k=0; k<_progDetalle.length;k++){
                    _progDetalle[k].nro=k+1;
                }
                //console.log(_progDetalle);
                this.arrProgramacion=_progDetalle;
                //console.log(this.arrProgramacion);
            }
        //BTN DATATABLE
            //TIEMPOSALIDA
                editartiemposalida(TiSaId:number){
                    //console.log(TiSaId);
                    this.__TiSaId=TiSaId;
                    this.displayConfirmarEditarTS=true;
                    this.mensajeconfirmar="Desea editar el registro?";
                }

                eliminartiemposalida(TiSaId:number){
                    //console.log(TiSaId);
                    this.procEliminarSalida(TiSaId);
                }
                
                //CONFIRMAR
                    //EDITAR
                    acepEditarTS(){
                        this.disSepacionTimes=true;
                        this.gettiemposalidabyid(this.__TiSaId);
                        this.displayConfirmarEditarTS=false;
                        this.mensajeconfirmar="";
                    }
                    canEditarTS(){
                        this.__TiSaId=null;
                        this.displayConfirmarEditarTS=false;
                        this.mensajeconfirmar="";
                    }
                    
                    //ELIMINAR
                    canEliminarTS(){
                        
                    }
                    acepEliminarTS(){
                        
                    }

            //TIEMPOREPARTO
                eliminartiempoprogramado(TiPrId:number){
                    //console.log(TiPrId);
                    this.procEliminarProgramado(TiPrId);
                    this.getalltiempoprogramadobytisaid(this._TiSaId);
                }

                //CONFIRMAR


        //FUNCIONES BTNS FORM PRINCIPAL
            /*btnAsignarATiempo(){
                this.disInitTimesProg=true;
            }*/
            btnTSeparacion(){
                this.disSepacionTimes=true;
                this.procNewTimeSalida();
            }
            funcBtnAsignarATiempos(){
                this.disAsignarTimesSeparacion=true;
                this.procNewTiempoProgramado();
            }
            funcBtnSacarTiemposSalida(){
                let arr:any[]=[];
                arr=this.sacarTiempoSalidas("06:00:00",16, "00:02:30");
            }
        //VARIADAS
            funcCboSubEmp(){
                console.log(this.SuEmId);
            }
            sacarTiempoSalidas(hInit:string, nPlacas:number, tpoInter:string){
                /* i: para recorrer array bucles */
                let auxT:string, i:number; let arrResult:any[]=[];
                i=0;
                while(i<nPlacas){
                    auxT=operMHoras(tpoInter,i);
                    arrResult[i]=extFuncCorrecHora(operSHoras(hInit,auxT));
                    i++;
                }
                return arrResult;
            }

            /* IMPARES Y PARES DISTRIBUIR TIEMPO */
            distribuirTiempos(tipo:string, arrTmp=[], tmpRep:string, _tmpRep:string){
                let arrTmpsRep:string[]=[];
                /* 
                    tipo: tiempo de distribucion,
                    arrTmp: array de tiempos a aumentar su minutos o segundos
                    tmpRep: tiempo total a repartir
                    _tmpRep: tiempo en q debe dividirse el tmpRep
                    arrTmpsRep: array de tiempos divididos partes pequeñas
                */
                arrTmpsRep=extFuncArrDistTmps(tmpRep,_tmpRep);

                /* MENOR TIEMPO */
                if(tipo=="01"){    

                /* MANUAL */
                }else if(tipo=="02"){
                    //NO PROGRAMADO
                /* RECORRER:  */
                }else if(tipo=="03"){
                    //NO PROGRAMADO
                }
                
            }
            
            funcCboPrId(){
                //console.log(this._prId);
            }

            //FUNCION DEL BOTON MODAL
            funcBtnBuscarxFecha(){
                let prid:number, fecha:string;
                let arrplacas=[], arrprog=[];

                prid=this._prId; fecha=fechaActual1();
                arrplacas=this.arrplacas; arrprog=this.arrprogfecha;

                //FUNCIONES
                this.procFuncBuscarxFecha(prid,fecha);
            }

        
}