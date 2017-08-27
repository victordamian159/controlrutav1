    //CONVERTIR HORA DE STRING A DATE FORMULARIO A LA BD  
    export function hora(fecha : string) : Date{
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
    export function _hora(fecha : Date) :string{
        let hora : string; let _hora : string; let _min : string; let _seg : string; let _fecha = new Date(fecha);

        _hora =  (_fecha.getHours()).toString();
        _min =  (_fecha.getMinutes()).toString();
        _seg =  (_fecha.getSeconds()).toString();

        /*hora = _hora + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();*/
        hora = _hora+":"+_min+":"+_seg;
        hora = cCeroHora(hora); /* COMPLETANDO CERO EN LOS MINUTOS O  SEGUNDOS */
        return hora;
    }
    
    //COMPLETANDO CEROS EN CASO DE NECESITAR PARA HORAS  2017/
    export function cCeroHora(h:string) :string{
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

    /* COMPLETANDO CEROS A FORMATO YYYY/MM/DD */
    export function cCeroFecha(f : string) :string{
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

    /* COMPLETANDO CEROS A FORMATO YYYY-MM-DD */
    export function _cCeroFecha(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('-');
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

    /* AJUSTANDO FORMATO DE LA FECHA PARA PASARLO A UN FORMULARIO */
        /* YYYY/MM/DD  ->  YYYY-MM-DD    DD/MM/YYYY  ->  DD-MM-YYYY */
            export function formatFech(f : string) : string{
                let _f, r, aux;
                _f = f.split("/");
                aux = _f[0]; _f[0]=_f[2]; _f[2]=aux;
                r = _f.join("-");
                return r;
            }
        /* YYYY-MM-DD  ->  YYYY/MM/DD    DD-MM-YYYY  ->  DD/MM/YYYY*/
            export function _formatFech(f : string) : string{
                let _f, r, aux;
                _f = f.split("-");
                aux = _f[0]; _f[0]=_f[2]; _f[2]=aux;
                r = _f.join("/");
                return r;
            }

    /* CAMBIANDO EL '/' POR '-' */
    export function cCeroFechaForEditar(f : string) :string{
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


    //  (yyyy-mm-dd)  CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    export function fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        return _thoy;
    }

    //CONVERTIR DATE A STRING PARA FECHA   (DD/MM/YYYY)  - ---   BD A GRILLA
    export function _fecha1(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha);  
        _fechaProg=(_fecha.getDate()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getFullYear()).toString() ;
        _fechaProg=cCeroFecha(_fechaProg);
        return  _fechaProg;
    }

    //CONVERTIR DATE A STRING PARA FECHA   (DD-MM-YYYY)  - ---   BD A GRILLA
    export function _fecha2(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; 
        let _fech = new Date(fecha);  
       
        _fechaProg=(_fech.getDate()).toString() +"-"+ (_fech.getMonth() +1 ).toString() +"-"+(_fech.getFullYear()).toString() ;
        
        _fechaProg=_cCeroFecha(_fechaProg);
        return  _fechaProg;
    }

    /* COMPLETAR LA HORA EN CASO NECESARIO (PUEDEN BORRAR LOS SEGUNDOS) */
    export function corrigiendoHora(hora:string):Date{
         let thoy:Date,  otra:Date, horaTarjeta:string;
            thoy=new Date();          
            //COMPLETANDO LOS SEGUNDOS SI ES NECESARIO
            if(hora.length<=5){
                hora = hora+":00"; 
            }
            horaTarjeta=hora;
            let resultado=horaTarjeta.split(':');
            otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));
        return otra;
    }

    export function corrigiendoHoraString(hora:string):string{
            if(hora.length<=5){
                hora = hora+":00"; 
            }
        return hora;
    }

    /* SACAR LA FECHA ACTUAL DEL SISTEMA dd-mm-yyyy */
    export function fechaActual1():string{
        let _f:string, fecha=new Date(),dia=fecha.getDate(), mes=fecha.getMonth()+1, año=fecha.getFullYear();
        let _dia:string,_mes:string,_año:string;

        _dia=dia.toString(); _mes=mes.toString(); _año=año.toString();
        _f=_dia+"-"+_mes+"-"+_año;
        _f =_cCeroFecha(_f);
        return _f;
    }       
    /* ADAPTAR A FORMATO yyyy-mm-dd */
    export function editf1(f1:string):string{
        let _f1:string,arrf1:any,_arrf1:any,aux:any,d:string,m:string,a:string;
        arrf1=f1.split("-");    d=arrf1[0]; m=arrf1[1]; a=arrf1[2];
        _f1=a+"-"+m+"-"+d;
        return _f1;
    }

    /* SACAR LA FECHA ACTUAL DEL SISTEMA dd/mm/yyyy */
    export function fechaActual2():string{
        let _f:string, fecha=new Date(),dia=fecha.getDate(), mes=fecha.getMonth()+1, año=fecha.getFullYear();
        let _dia:string,_mes:string,_año:string;
        _dia=dia.toString(); _mes=mes.toString(); _año=año.toString();
        _f=_dia+"/"+_mes+"/"+_año;
        _f =cCeroFecha(_f);
        return _f;
    }
    /* ADAPTAR A FORMATO yyyy/mm/dd */
    export function editf2(f1:string):string{
        let _f1:string,arrf1:any,_arrf1:any,aux:any,d:string,m:string,a:string;
        arrf1=f1.split("-");    d=arrf1[0]; m=arrf1[1]; a=arrf1[2];
        _f1=a+"/"+m+"/"+d;
        return _f1;
    }

    /* ADAPTAR POS DE ELEMENTOS FECHA CON SLASH dd/mm/yyyy A yyyy/mm/dd */
    export function slash_posFecha(f:string):string{
        let _f:any[]=[], _fResp:string;
            _f=f.split("/");
            _fResp=_f[2]+"/"+_f[1]+"/"+_f[0];
        return _fResp;
    }

    /* ADAPTAR POS DE ELEMENTOS FECHA CON GUION dd-mm-yyyy A yyyy-mm-dd */
    export function guion_posFecha(f:string):string{
        let _f:any[]=[], _fResp:string;
            _f=f.split("-");
            _fResp=_f[2]+"-"+_f[1]+"-"+_f[0];
        return _fResp;
    }

    /* HORA ACTUAL */
    export function horaAct():string{
        let horaAct=new Date(), hora=horaAct.getHours(), min=horaAct.getMinutes(), seg=horaAct.getSeconds(), _horaAct:string; 

        _horaAct=hora.toString() +":"+ min.toString() +":"+ seg.toString();
        _horaAct=cCeroHora(_horaAct);

        return _horaAct;
    }

    export var arrABI=[31,29,31,30,31,30,31,31,30,31,30,31];
    export var arrANBI=[31,28,31,30,31,30,31,31,30,31,30,31];

    
    
   
    /* DEVUELVE SI ES AÑO BISIESTO O NO BISIESTO */
    export function tipoAnio(anio:number):number{
        let tipoAnio:number; /* 1: AÑO NO BISIESTO, 0:AÑO BISIESTO */
        if(anio %4!=0 || (anio%100==0  &&  anio %400 !=0)){
            tipoAnio= 1; //NO BISIESTO
           }else {
            tipoAnio= 0; //BISIESTO
       }
        return tipoAnio;
    }

    /* AGREGANDO DIAS A UN FECHA DETERMINADA DEVUELVE YYYY-MM-SS */
    export function addDays(f:string,days:number) {
        var result = fecha(f); let _result;
        result.setDate(result.getDate() + days);
        _result=Number(result);
        return _fecha2(_result);
    }

     /* AGREGANDO DIAS A UN FECHA DETERMINADA  FORMAT UTC STANDART */
     export function _addDays(f:string,days:number) {
        var result = fecha(f); let _result;
        result.setDate(result.getDate() + days);
        return result;
    }


    /* RECIBE ["YYYY","MM","DD"], DEVUEVLE NRO DE DIAS DESDE 1970*/
    //NUMERO DE DIAS DESDE 1970, PARA TENER COMO REFERENCIA AL MOMENTO DE RESTAR Y SACAR EL NRO DE DIAS EXISTENTE
    export function _fnroDias(f=[]) : number{
        let n: number; 
        let minute = 1000 * 60; let hour = minute * 60; let day = hour * 24; 
        let date = new Date(f[0],f[1],f[2]);
        var time = date.getTime();
        n = Math.round(time/day);
        return n;
    }

    /* AJUSTANDO DATE, QUITANDO LOS CEROS A NRO 01,02,...,09  MES & DIAS */
    export function formatFechInArr(f){
        let _f:any[]=[];
        _f=f.split("-");
        _f[1]=Number(_f[1]).toString();
        _f[2]=Number(_f[2]).toString();
        return _f;
    }


    export function ajustaHora(arrH=[],nroTarjetas:number){
       let j=0; let i=1; let auxS,_auxS,auxM,_auxM,auxH,_auxH;
       let sarrH:any[]=[];

       while(i<nroTarjetas){
            /* SEGUNDOS*/
            if(arrH[i][2]>59){
                if(arrH[i][2]%60==0){
                    auxS = arrH[i][2];
                    arrH[i][2]=0;
                    arrH[i][1]=arrH[i][1]+(auxS/60);
                }else if(arrH[i][2]%60>0){
                    auxS = arrH[i][2];
                    arrH[i][2] = arrH[i][2]%60;
                    arrH[i][1] = arrH[i][1]+((auxS-auxS%60)/60);
                }
            }else if(arrH[i][2]<=59){
                /* NO HACE NADA */
            }
                
            /* MINUTOS */
            if(arrH[i][1]>59){
                if(arrH[i][1]%60==0){
                    auxM = arrH[i][1];
                    arrH[i][1]=0;
                    arrH[i][0]=arrH[i][0]+(auxM/60);
                }else if(arrH[i][1]%60>0){
                    auxM = arrH[i][1];
                    arrH[i][1] = arrH[i][1]%60;
                    arrH[i][0] = arrH[i][0]+((auxM-auxM%60)/60) ; /* SUMANDO A LA HORA */
                }
            }else if(arrH[i][1]<=59){
                /* NO HACE NADA */
            }

            /* HORAS */
            if(arrH[i][0]>23){
                /*PASA AL SIGUIENTE DIA */
                if(arrH[i][0]%24==0){
                    arrH[i][0]=0;
                    /* arrH[i][3]= arrH[i][0]/24 */
                }else if(arrH[i][0]%24>0){
                    arrH[i][0]=arrH[i][0]%24;
                    /* arrH[i][3] = arrH[i][3]+(arrH[i][0]-arrH[i][0]%24)/60 ; */
                }
            }else if(arrH[i][0]<=23){
                /* NO HACE NADA */
            }
            i++;
        }
       /*     sarrH=arrH.join(":");*/
        return arrH;
    }

/*  DEVUELVE FECHA DADO UNA  FECHA INICIAL Y UN 
        NRO DE DIAS EN FORMATO  ->  YYYY/MM/SS
        export function fechaSgte(f:string, nrodias):string{
            let _f:any[]=[], tipAnio:number, fResp:string; _f=f.split("/");
            _f[0]=Number(_f[0]); _f[1]=Number(_f[1]); _f[2]=Number(_f[2]);_f.push(tipoAnio(_f[0])); 
            
            let i,sum:number,mes,_mes:number, res1,res2:number;
            mes=_f[1]-1; _mes=0;

            AÑO NO BISIESTO 
            if(_f[3]==1){
                sum=0;i=1;
                while(sum<nrodias){ sum=sum+arrANBI[mes+i-1]; i++;}
                i--; 
                res1=sum-nrodias; res2=Number(_f[2])-res1; dias - res1 

                if(res2>=0){
                    _f[2]=res2;  DIAS  _f[1]=_f[1]+i;   MES 
                }else if(res2<0){
                    mes=mes+i-1;  MES  _f[2]=arrANBI[mes]+res2;  DIAS 
                }

            AÑO BISIESTO 
            }else if(_f[3]==0){
                sum=0;i=1;
                while(sum<nrodias){
                    sum=sum+arrABI[mes+i-1];
                    i++;
                }
                i--; console.log("i: "+i+" sum: "+sum); res1=sum-nrodias; res2=Number(_f[2])-res1;dias - res1 
                if(res2>=0){
                    _f[2]=res2;  DIAS 
                    _f[1]=_f[1]+i;   MES 
                }else if(res2<0){
                    console.log("mes: "+mes);
                    mes=mes+i-1;  MES 
                    _f[2]=arrABI[mes]+res2;  DIAS 
                    console.log("mes: "+mes+" _f[2]: "+_f[2]);
                }

                if(mes>11){
                    mes=mes-11;  MES 
                    _f[0]=_f[0]+1;        AÑOS 
                }
            }
            
            _f.pop();_f[1]=_f[1]+1;
            fResp=_f.join("/");
        return fResp;
        } 
    */

    /*
        DEVUELVE EL NRO DE DIAS ENTRE DOS FECHAS DADAS
        export function diasEntreFecha(){
            
        }
    */
     /* AJUSTANDO LAS HORAS A 24 HORAS 00:00:00   ---> arrH
                j=0; i=1; let auxS,_auxS,auxM,_auxM,auxH,_auxH;
                while(i<nroTarjetas){
                    // SEGUNDOS
                    if(arrH[i][2]>59){
                        if(arrH[i][2]%60==0){
                            auxS = arrH[i][2];
                            arrH[i][2]=0;
                            arrH[i][1]=arrH[i][1]+(auxS/60);
                        }else if(arrH[i][2]%60>0){
                            auxS = arrH[i][2];
                            arrH[i][2] = arrH[i][2]%60;
                            arrH[i][1] = arrH[i][1]+((auxS-auxS%60)/60);
                        }
                    }else if(arrH[i][2]<=59){
                        // NO HACE NADA 
                    }
                        
                    // MINUTOS 
                    if(arrH[i][1]>59){
                        if(arrH[i][1]%60==0){
                            auxM = arrH[i][1];
                            arrH[i][1]=0;
                            arrH[i][0]=arrH[i][0]+(auxM/60);
                        }else if(arrH[i][1]%60>0){
                            auxM = arrH[i][1];
                            arrH[i][1] = arrH[i][1]%60;
                            arrH[i][0] = arrH[i][0]+((auxM-auxM%60)/60) ; // SUMANDO A LA HORA 
                        }
                    }else if(arrH[i][1]<=59){
                        // NO HACE NADA 
                    }

                    // HORAS 
                    if(arrH[i][0]>23){
                        //PASA AL SIGUIENTE DIA 
                        if(arrH[i][0]%24==0){
                            arrH[i][0]=0;
                            // arrH[i][3]= arrH[i][0]/24 
                        }else if(arrH[i][0]%24>0){
                            arrH[i][0]=arrH[i][0]%24;
                            // arrH[i][3] = arrH[i][3]+(arrH[i][0]-arrH[i][0]%24)/60 ; 
                        }
                    }else if(arrH[i][0]<=23){
                        // NO HACE NADA 
                    }
                    i++;
                }*/