import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notas } from '../models/notas';
import { Alumnos } from '../models/alumnos';
import { Cursos } from '../models/cursos';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private apiUrl = 'http://localhost:8080/api/notas';  
  private alumnoUrl = 'http://localhost:8080/api/alumnos';  
  private cursoUrl = 'http://localhost:8080/api/cursos';

  constructor(private http: HttpClient) {}


  getNotas(): Observable<Notas[]> {
    return this.http.get<Notas[]>(this.apiUrl);
  }


  getAlumnos(): Observable<Alumnos[]> {
    return this.http.get<Alumnos[]>(this.alumnoUrl);
  }


  getCursos(): Observable<Cursos[]> {
    return this.http.get<Cursos[]>(this.cursoUrl);
  }


  createNota(nota: Notas): Observable<Notas> {

    
    const payload = {
      alumno: { id: nota.alumno.id },
      curso: { id: nota.curso.id },
      nota1: nota.nota1,
      nota2: nota.nota2,
      nota3: nota.nota3,
      promedio: nota.promedio
    };
    return this.http.post<Notas>(this.apiUrl, payload);
  }

  updateNota(nota: Notas): Observable<Notas> {


    const payload = {
      id: nota.id,
      alumno: { id: nota.alumno.id },
      curso: { id: nota.curso.id },
      nota1: nota.nota1,
      nota2: nota.nota2,
      nota3: nota.nota3,
      promedio: nota.promedio
    };
    
    return this.http.put<Notas>(`${this.apiUrl}/${nota.id}`, payload);
  }

  deleteNota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
