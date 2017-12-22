export class classDataUsuario {
  private EmId:number;
  private PeApellidos:string;
  private PeNombres:string;
  private UsActivo:boolean;
  private UsId:number;
  private UsUserName:string;
  public CoId:number;
  private ObjConfiguracion:any;
  constructor() { 
  }

  //GETTERS
  public GetEmId(emid:number){
    this.EmId=emid;
  }
  public GetCoId(coid:number){
    this.CoId=coid;
  }
  public GetObjConfig(objConfiguracion:any){
    this.ObjConfiguracion=objConfiguracion;
  }

  //SETTERS
  public SetEmId(){
    return this.EmId;
  }
  public SetCoId(){
    return this.CoId;
  }
}