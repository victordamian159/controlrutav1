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
    /* DANDO FORMATO A LA FECHA PARA SER EDITADA EN EL FORMULARIO DE EDITAR*/
    export function formatFech(f : string) : string{
        let _f, r, aux;
        _f = f.split("/");
        aux = _f[0]; _f[0]=_f[2]; _f[2]=aux;
        r = _f.join("-");
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

    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    export function fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        return _thoy;
    }

    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    export function _fecha(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha);  
        /* 
         //_fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        */
        _fechaProg=(_fecha.getDate()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getFullYear()).toString() ;
        _fechaProg=cCeroFecha(_fechaProg);
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

    /* SACAR LA FECHA ACTUAL DEL SISTEMA dd-mm-yyyy */
    export function fechaActual1():string{
        let _fecha:string, fecha=new Date(),dia=fecha.getDate(), mes=fecha.getMonth()+1, año=fecha.getFullYear();
        let _dia:string,_mes:string,_año:string;

        _dia=dia.toString(); _mes=mes.toString(); _año=año.toString();
        _fecha=_dia+"-"+_mes+"-"+_año;
        _fecha =_cCeroFecha(_fecha);
        return _fecha;
    }
    /* yyyy-mm-dd */
    export function editf1(f1:string):string{
        let _f1:string,arrf1:any,_arrf1:any,aux:any,d:string,m:string,a:string;
        arrf1=f1.split("-");    d=arrf1[0]; m=arrf1[1]; a=arrf1[2];
        _f1=a+"-"+m+"-"+d;
        return _f1;
    }

    /* SACAR LA FECHA ACTUAL DEL SISTEMA dd/mm/yyyy */
    export function fechaActual2():string{
        let _fecha:string, fecha=new Date(),dia=fecha.getDate(), mes=fecha.getMonth()+1, año=fecha.getFullYear();
        let _dia:string,_mes:string,_año:string;
        _dia=dia.toString(); _mes=mes.toString(); _año=año.toString();
        _fecha=_dia+"/"+_mes+"/"+_año;
        _fecha =cCeroFecha(_fecha);
        return _fecha;
    }
    /* yyyy/mm/dd */
    export function editf2(f1:string):string{
        let _f1:string,arrf1:any,_arrf1:any,aux:any,d:string,m:string,a:string;
        arrf1=f1.split("-");    d=arrf1[0]; m=arrf1[1]; a=arrf1[2];
        _f1=a+"/"+m+"/"+d;
        return _f1;
    }


    /* HORA ACTUAL */
    export function horaAct():string{
        let horaAct=new Date(), hora=horaAct.getHours(), min=horaAct.getMinutes(), seg=horaAct.getSeconds(), _horaAct:string; 

        _horaAct=hora.toString() +":"+ min.toString() +":"+ seg.toString();
        _horaAct=cCeroHora(_horaAct);

        return _horaAct;
    }