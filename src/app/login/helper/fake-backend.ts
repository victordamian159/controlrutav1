import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function fakeBackendFactory(backend: MockBackend,  options: BaseRequestOptions,  realBackend: XHRBackend) {
    
    /*  -> Array in local storage for registered users
        -> Array en almacenamiento local para usuarios registrados */
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    /*  -> configure fake backend
        -> Configurar el backend falso,
           connection: tipo de MockConnection */
    backend.connections.subscribe((connection: MockConnection) => {
        /* 
            wrap in timeout to simulate server api call 
            Envolver en tiempo de espera para simular la llamada api de servidor
        */
        setTimeout(() => {

            /* authenticate     AUTENTICACION DEL USUARIO*/
            if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                /*
                    ->  get parameters from post request
                    ->  obtener los parámetros de solicitud POST, estos son enviados y necesitan ser convertidos a json
                */
                let params = JSON.parse(connection.request.getBody());

                /* 
                    ->  find if any user matches login credentials
                
                    ->  Buscar si cualquier usuario coincide con 
                        las credenciales de inicio de sesión
                */
                let filteredUsers = users.filter(user => {return user.username === params.username && user.password === params.password;});
                
                /*console.log("AUTENTICADO"); console.log(filteredUsers);*/
                
                if (filteredUsers.length) {
                    /* 
                        if login details are valid return 200 OK with user details and fake jwt token
                        Si los datos de inicio de sesión son válidos, devuelva 200 OK con detalles de usuario y un token de jwt falso
                    */
                    let user = filteredUsers[0];

                    /*DEVUELVE UNA RESPUESTA CON EL NOMBRE Y CONTRASEÑA, INICIO CORRECTAMENTE*/
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 200,
                        body: { id: user.id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                //token: 'fake-jwt-token'
                                token: 'este_es_el_token_=D' }
                    })));
                } else {
                    /* -> else return 400 bad request
                       -> ERROR AL TRATAR DE INGRESAR AL SISTEMA, USUARIO Y CONTRASEÑA INCORRECTO*/ 
                    
                    /*DEVUELVE UNA RESPUESTA*/
                    connection.mockError(new Error('Usuario o Contraseña Incorrectos'));
                }

                console.log(connection);
                return;
            }


            // get users OBTENER USUARIOS               RequestMethod: solicitado un metodo al servicio http (Obtener todos usuario)
            if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
                /* 
                    ->  check for fake auth token in header and return users if valid, 
                        this security is implemented server side in a real application
                    
                    ->  Compruebe si el token de autenticación falso en el encabezado y 
                        devuelve los usuarios si es válido, esta seguridad se implementa 
                        en una aplicación real del servidor
                */
                console.log("OBTENER USUARIOS");
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users })));
                } else {
                    /* 
                        return 401 not authorised if token is null or invalid
                        Return 401 no autorizado si token es nulo o inválido
                    */
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }

                return;
            }


            // get user by id   Obtener usuario por id  RequestMethod: solicitado un metodo al servicio http (Obtener)
            if (connection.request.url.match( / \/ api\/ users\/ \d+$/ ) && connection.request.method === RequestMethod.Get) {
                console.log("OBTENER USUARIO POR ID");
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = connection.request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    // respond 200 OK with user
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
                } else {
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }

                return;
            }


            // create user      CREAR USUARIO           RequestMethod: solicitado un metodo al servicio http (CREAR)
            if (connection.request.url.endsWith( '/api/users' ) && connection.request.method === RequestMethod.Post) {
                console.log("CREAR USUARIO");
                // get new user object from post body
                let newUser = JSON.parse(connection.request.getBody());

                // validation
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    /* 
                        Error: El nombre de usuario "damian" ya está 
                        ERROR, EL USUARIO YA EXISTE EN LA BASE DE DATOS Y TERMINA LA FUNCION
                    */
                    return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
                }

                // save new user        GUARDAR NUEVO USUARIO
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

                return;
            }


            // delete user      ELIMINAR USUARIO        RequestMethod: solicitado un metodo al servicio http (DELETE)
            if (connection.request.url.match( /\/api\/users\/\d+$/ ) && connection.request.method === RequestMethod.Delete) {
               console.log("ELIMINAR USUARIO");
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                //Comprobar el token de autenticación falsa en el encabezado y devolver el usuario si es válido, esta seguridad se implementa en una aplicación real del servidor
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    //Encontrar usuario por id en el array de usuarios
                    let urlParts = connection.request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                } else {
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }

                return;
            }


            /*  pass through any requests not handled above
                Pasar por cualquier solicitud no tratada anteriormente*/
            let realHttp = new Http(realBackend, options);

            /*OPCIONES PARA LA SOLICITUD */
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });

            console.log("antes de enviar la solicitud");
            /*          URL PARA ENVIAR LA SOLICITUD,   OPCIONES DE SOLICITUD*/
            realHttp.request( connection.request.url,   requestOptions)
                .subscribe(
                            (response: Response) => {connection.mockRespond(response); console.log(" ENVIO UNA SOLICITUD =D");},
                            (error: any) => {connection.mockError(error);}
                          );

        }, 500);    /* FIN FUNCION SETTIMEOUT*/

    });

    return new Http(backend, options);
};

/* Proveedor de backend falso */
export let fakeBackendProvider = {
    /*  -> Use fake backend in place of Http service for backend-less development
        -> Uso backend falso en lugar de servicio de HTTP para Sin-backend desarrollo*/

    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};


/* 

        import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
        import { MockBackend, MockConnection } from '@angular/http/testing';

        export function fakeBackendFactory(backend: MockBackend,  options: BaseRequestOptions,  realBackend: XHRBackend) {
            
            -> Array in local storage for registered users
                -> Array en almacenamiento local para usuarios registrados 
            let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

            -> configure fake backend
                -> Configurar el backend falso,
                connection: tipo de MockConnection 
            backend.connections.subscribe((connection: MockConnection) => {
                
                    wrap in timeout to simulate server api call 
                    Envolver en tiempo de espera para simular la llamada api de servidor
                
                setTimeout(() => {

                    authenticate     AUTENTICACION DEL USUARIO
                    if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                        
                            ->  get parameters from post request
                            ->  obtener los parámetros de solicitud POST, estos son enviados y necesitan ser convertidos a json
                        
                        let params = JSON.parse(connection.request.getBody());
                        console.log(params); 

                        
                            ->  find if any user matches login credentials
                        
                            ->  Buscar si cualquier usuario coincide con 
                                las credenciales de inicio de sesión
                        
                        let filteredUsers = users.filter(user => {return user.username === params.username && user.password === params.password;});
                        
                        console.log("AUTENTICADO");
                        console.log(filteredUsers);
                        
                        if (filteredUsers.length) {
                            
                                if login details are valid return 200 OK with user details and fake jwt token
                                Si los datos de inicio de sesión son válidos, devuelva 200 OK con detalles de usuario y un token de jwt falso
                            
                            let user = filteredUsers[0];
                            connection.mockRespond(new Response(new ResponseOptions({
                                status: 200,
                                body: {
                                    id: user.id,
                                    username: user.username,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    token: 'fake-jwt-token'
                                    token: 'este_es_el_token_=D'
                                }
                            })));
                        } else {
                            else return 400 bad request
                            ERROR AL TRATAR DE INGRESAR AL SISTEMA, USUARIO Y CONTRASEÑA INCORRECTO
                            connection.mockError(new Error('Username or password is incorrect'));
                            connection.mockError(new Error('Usuario o Contraseña Incorrectos'));
                        }

                        console.log(connection);
                        return;
                    }


                    get users OBTENER USUARIOS               RequestMethod: solicitado un metodo al servicio http (Obtener todos usuario)
                    if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
                        
                            ->  check for fake auth token in header and return users if valid, 
                                this security is implemented server side in a real application
                            
                            ->  Compruebe si el token de autenticación falso en el encabezado y 
                                devuelve los usuarios si es válido, esta seguridad se implementa 
                                en una aplicación real del servidor
                        
                        console.log("OBTENER USUARIOS");
                        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users })));
                        } else {
                            
                                return 401 not authorised if token is null or invalid
                                Return 401 no autorizado si token es nulo o inválido
                            
                            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                        }

                        return;
                    }


                    get user by id   Obtener usuario por id  RequestMethod: solicitado un metodo al servicio http (Obtener)
                    if (connection.request.url.match( / \/ api\/ users\/ \d+$/ ) && connection.request.method === RequestMethod.Get) {
                        console.log("OBTENER USUARIO POR ID");
                        check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                            find user by id in users array
                            let urlParts = connection.request.url.split('/');
                            let id = parseInt(urlParts[urlParts.length - 1]);
                            let matchedUsers = users.filter(user => { return user.id === id; });
                            let user = matchedUsers.length ? matchedUsers[0] : null;

                            respond 200 OK with user
                            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
                        } else {
                            return 401 not authorised if token is null or invalid
                            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                        }

                        return;
                    }


                    create user      CREAR USUARIO           RequestMethod: solicitado un metodo al servicio http (CREAR)
                    if (connection.request.url.endsWith( '/api/users' ) && connection.request.method === RequestMethod.Post) {
                        console.log("CREAR USUARIO");
                            get new user object from post body
                        let newUser = JSON.parse(connection.request.getBody());

                        validation
                        let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                        if (duplicateUser) {
                        
                                Error: El nombre de usuario "damian" ya está 
                                ERROR, EL USUARIO YA EXISTE EN LA BASE DE DATOS Y TERMINA LA FUNCION
                            
                            return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
                        }

                        save new user        GUARDAR NUEVO USUARIO
                        newUser.id = users.length + 1;
                        users.push(newUser);
                        localStorage.setItem('users', JSON.stringify(users));

                        respond 200 OK
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

                        return;
                    }


                        delete user      ELIMINAR USUARIO        RequestMethod: solicitado un metodo al servicio http (DELETE)
                    if (connection.request.url.match( /\/api\/users\/\d+$/ ) && connection.request.method === RequestMethod.Delete) {
                    console.log("ELIMINAR USUARIO");
                        check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                        Comprobar el token de autenticación falsa en el encabezado y devolver el usuario si es válido, esta seguridad se implementa en una aplicación real del servidor
                        
                        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                            find user by id in users array
                            Encontrar usuario por id en el array de usuarios
                            
                            let urlParts = connection.request.url.split('/');
                            let id = parseInt(urlParts[urlParts.length - 1]);
                            for (let i = 0; i < users.length; i++) {
                                let user = users[i];
                                if (user.id === id) {
                                    // delete user
                                    users.splice(i, 1);
                                    localStorage.setItem('users', JSON.stringify(users));
                                    break;
                                }
                            }

                                respond 200 OK
                            connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                        } else {
                                return 401 not authorised if token is null or invalid
                            connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                        }

                        return;
                    }


                        pass through any requests not handled above
                        Pasar por cualquier solicitud no tratada anteriormente
                    let realHttp = new Http(realBackend, options);

                    OPCIONES PARA LA SOLICITUD 
                    let requestOptions = new RequestOptions({
                        method: connection.request.method,
                        headers: connection.request.headers,
                        body: connection.request.getBody(),
                        url: connection.request.url,
                        withCredentials: connection.request.withCredentials,
                        responseType: connection.request.responseType
                    });

                    console.log("antes de enviar la solicitud");
                            URL PARA ENVIAR LA SOLICITUD,   OPCIONES DE SOLICITUD
                    realHttp.request( connection.request.url,   requestOptions)
                        .subscribe(
                                    (response: Response) => {connection.mockRespond(response); console.log(" ENVIO UNA SOLICITUD =D");},
                                    (error: any) => {connection.mockError(error);}
                                );

                }, 500);     FIN FUNCION SETTIMEOUT

            });

            return new Http(backend, options);
        };

        Proveedor de backend falso 
        export let fakeBackendProvider = {
                -> Use fake backend in place of Http service for backend-less development
                -> Uso backend falso en lugar de servicio de HTTP para Sin-backend desarrollo

            provide: Http,
            useFactory: fakeBackendFactory,
            deps: [MockBackend, BaseRequestOptions, XHRBackend]
        };

*/