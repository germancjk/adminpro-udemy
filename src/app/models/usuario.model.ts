
export class Usuario {

    // Inicializar de esta manera es mucho más rápido que 1 por 1
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string, // Luego del primer opcional, los demás tienen que ser opcionales
        public role?: string,
        public google?: boolean,
        public _id?: string
    ) {}
}
