import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class TControlService{
	//TARJETA CONTROL
    private baseUrl: string ='http://controlbus-ronaldmam.rhcloud.com/rest/tarjetacontrol/';
	//private baseUrl: string ='http://localhost:8089/controlbus/rest/tarjetacontrol/';
    private baseUrl2:string ='http://controlbus-ronaldmam.rhcloud.com/rest/tarjetacontroldetalle/';
	

	//PUNTOS DE CONTROL
	private baseUrl3:  string = 'http://controlbus-ronaldmam.rhcloud.com/rest/puntocontrol/';
	private baseUrl4: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/puntocontroldetalle/';

	//PROGRAMACION
	private baseUrl5: string ='http://controlbus-ronaldmam.rhcloud.com/rest/programacion/';
	private baseUrl6: string ='http://controlbus-ronaldmam.rhcloud.com/rest/programaciondetalle/';

	//BUSES
	private baseUrl7: string ='http://controlbus-ronaldmam.rhcloud.com/rest/bus';

    constructor(private http: Http){}

	//CONSULTA PROGRAMACION CABECERA (SE MUESTRA EN GRILLA PROGRAMACION)
    getAllProgramacionByEm( emId: number, anio: number){
        return this.http        
            .get(this.baseUrl5+"getallprogramacionbyem?emId="+emId+"&anio="+anio)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }

	//CONSULTA PROGRAMACION DETALLE
	getAllProgramacionDetalleByPrFecha(PrId:number, date: string){
        return this.http
			.get(this.baseUrl6+"getallprogramaciondetallebyprfecha?prId="+PrId+"&prDeFecha="+date)
            //.get(this.baseUrl6+'prid/'+PrId)
            .map( (r:Response) => r.json())
            .catch( (error:any) => Observable.throw(error.json.error || 'server error') );
    }
	/*
    getAllProgramacionDetalleByPrId(PrId:number){
        return this.http
            .get(this.baseUrl6+'prid/'+PrId)
            .map( (r:Response) => r.json())
            .catch( (error:any) => Observable.throw(error.json.error || 'server error') );
    }
	*/




	//CONSULTA RECUPERAR PUNTOS DE CONTROL  (1,0)
	getAllPuntoControlByEmRu(emId: number,ruId:number) {
		return this.http
				.get(this.baseUrl3+ "getallpuntocontrolbyemru?emId="+emId+"&ruId="+ruId) 
				.map((r: Response) => r.json() )             
				.catch(this.handleError);
	}
	
	//CONSULTA RECUPERAR  PUNTOS DETALLE, PARA INICIAR LA TARJETA DE CONTROL
	getAllPuntoControlDetalleByPuCo(puCoId:number){
		return this.http
			.get(this.baseUrl4+'pucoid/'+puCoId ) 
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

	//CONSULTA PROVICIONAL PARA MOSTRAR EN LA GRILLA
	getAllTarjetas(){
		return this.http
			.get(this.baseUrl )
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

//CABECERA
    //TARJETAS DE CONTROL POR ID
    getAllTarjetaControlById(taCoId:number){
		return this.http
			.get(this.baseUrl+ taCoId )
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}	

    //NUEVA TARJETA DE CONTROL
     newTarjetaControl(){
		return this.http
			.get(this.baseUrl+'new')
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));

	}

    //GUARDAR TARJETA DE CONTROL
    saveTarjetaControl(tarjetaControl:Object){
		//si en caso se quiere enviar mas de un objeto
		//let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })
		return this.http.post(this.baseUrl+ "save/", tarjetaControl) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}

    //ELIMINAR TARJETA DE CONTROL
	deleteTarjetaControl(id:number){
		//return this.http.delete(this.baseUrl+ "delete/"+id)
		return this.http.delete(this.baseUrl+ id) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}


//DETALLE
    //CAPTURAR TODOS LAS TARJETAS DE CONTROL
    getAllTarjetaControlDetalleByPuCo(taCoId:number){
		return this.http
			.get(this.baseUrl2+'tacoid/'+taCoId )
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

    //NUEVA TARJETA DE CONTROL POR DETALLE
	newTarjetaControlDetalle(){
		return this.http
			.get(this.baseUrl2+ 'new')
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

    //ELIMINAR TARJETA DE CONTROL DETALLE
	deleteTarjetaControlDetalleByRu(taCoId:number){
		return this.http.delete(this.baseUrl2+ "delete/tacoid/"+taCoId) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}

	//GUARDAR TARJETA DE CONTROL DETALLE
	saveTarjetaControlDetalle(tControlDetalle:Object[]){
		//si en caso se quiere enviar mas de un objeto
		//let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })
		return this.http.post(this.baseUrl2+ "save/", tControlDetalle) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}
	asignarTarjetaControl(tarjetaControl:Object[]){
		return this.http.post(this.baseUrl+ "asignartarjeta/", tarjetaControl) // ...using post request
						.map((res:Response) => res.json()) // ...and calling .json() on the response to return data
						.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}

	//CHOFER AUSENTE ACTUALIZAR PROGRAMACION DETALLE
	actualizarProgDetalleAusente(obj : Object[]){
		return this.http.post(this.baseUrl6+ "update/", obj) // ...using post request
						.map((res:Response) => res.json()) // ...and calling .json() on the response to return data
						.catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
	}
//capturar error
	handleError (error: any) {
		// log error
		// could be something more sofisticated
		let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
		console.error(errorMsg);
		// throw an application level error
		return Observable.throw(errorMsg);
	}

}


