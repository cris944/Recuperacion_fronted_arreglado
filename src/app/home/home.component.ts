import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService, ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { Notas } from "../models/notas";
import { NotasService } from "../services/notas.service";
import { Cursos } from "../models/cursos";
import { Alumnos } from "../models/alumnos";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    ToolbarModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    DropdownModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {
  notas: Notas[] = [];
  nota: Notas = { id: 0, alumno: { id: 0, nombres: '', apellidos: '', dni: '' }, curso: { id: 0, nombre: '' }, nota1: 0, nota2: 0, nota3: 0, promedio: 0 };
  alumnos: Alumnos[] = [];
  cursos: Cursos[] = [];
  escuelaDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private NotasService: NotasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadNotas();
    this.loadAlumnos();
    this.loadCursos();
  }

  loadNotas(): void {
    this.NotasService.getNotas().subscribe(
      (data: Notas[]) => {
        this.notas = data;
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las notas', life: 3000 });
        console.error("Error al cargar notas:", error);
      }
    );
  }

  loadAlumnos(): void {
    this.NotasService.getAlumnos().subscribe(
      (data: Alumnos[]) => {
        this.alumnos = data.map(alumno => ({
          ...alumno,
          displayName: `${alumno.nombres} ${alumno.apellidos} -  ${alumno.dni}`
        }));
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los alumnos', life: 3000 });
        console.error("Error al cargar alumnos:", error);
      }
    );
  }

  loadCursos(): void {
    this.NotasService.getCursos().subscribe(
      (data: Cursos[]) => {
        this.cursos = data;
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los cursos', life: 3000 });
        console.error("Error al cargar cursos:", error);
      }
    );
  }

  openNew() {
    this.nota = { id: 0, alumno: { id: 0, nombres: '', apellidos: '', dni: '' }, curso: { id: 0, nombre: '' }, nota1: 0, nota2: 0, nota3: 0, promedio: 0 };
    this.submitted = false;
    this.escuelaDialog = true;
  }

  hideDialog() {
    this.escuelaDialog = false;
    this.submitted = false;
  }

  saveNota() {
    this.submitted = true;

    if (this.nota.alumno.id && this.nota.curso.id && this.isValidNota(this.nota.nota1) && this.isValidNota(this.nota.nota2) && this.isValidNota(this.nota.nota3)) {

 
      this.nota.promedio = (this.nota.nota1 + this.nota.nota2 + this.nota.nota3) / 3;

      if (this.nota.id) {

        this.NotasService.updateNota(this.nota).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota actualizada', life: 3000 });
            this.loadNotas();
            this.escuelaDialog = false;
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar', life: 3000 });
            console.error("Error al actualizar la nota:", error);
          }
        );
      } else {

        this.NotasService.createNota(this.nota).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota creada', life: 3000 });
            this.loadNotas();
            this.escuelaDialog = false;
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la nota', life: 3000 });
            console.error("Error al crear la nota:", error);
          }
        );
      }

      this.nota = { id: 0, alumno: { id: 0, nombres: '', apellidos: '', dni: '' }, curso: { id: 0, nombre: '' }, nota1: 0, nota2: 0, nota3: 0, promedio: 0 };
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Completa todos los campos requeridos', life: 3000 });
    }
  }

  isValidNota(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  editNota(nota: Notas) {
    this.nota = { ...nota };
    this.escuelaDialog = true;
  }

  deleteNota(nota: Notas) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar esta nota?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.NotasService.deleteNota(nota.id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota eliminada', life: 3000 });
            this.loadNotas();
          },
          (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la nota', life: 3000 });
            console.error("Error al eliminar la nota:", error);
          }
        );
      }
    });
  }
}
