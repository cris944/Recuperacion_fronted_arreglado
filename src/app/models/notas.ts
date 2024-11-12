import { Alumnos } from "./alumnos";
import { Cursos } from "./cursos";


export interface Notas {
    id: number;
    alumno: Alumnos;
    curso: Cursos;
    nota1: number;
    nota2: number;
    nota3: number;
    promedio: number;
}
