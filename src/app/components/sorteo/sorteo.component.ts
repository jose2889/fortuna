import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GanadorModalComponent } from '../ganador-modal/ganador-modal.component';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  imports: [CommonModule, FormsModule, GanadorModalComponent],
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css'],
})
export class SorteoComponent implements OnInit, AfterViewInit, OnChanges {
  // --- PROPIEDADES ---
  @ViewChild('wheelCanvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // --- Propiedades de Sonido ---
  // IMPORTANTE: Asegúrate de que 'tick.mp3' sea un sonido corto.
  private sonidoRuleta = new Audio('assets/sounds/ruleta.mp3');
  private sonidoGanador = new Audio('assets/sounds/ganador.mp3');

  private ganadorForzado: string | null = '';
  private ganadoresPotenciales: string[] = [
  '63', '65', '67', '68', '71', '74', '80', '81', '82', '83', '86', '87', '89', '70',
  '92', '93', '94', '101', '102', '103', '105', '106', '107', '108', '110', 
  '112', '113', '115', '123', '124', 
  '129', '131', '132', '133', '134', '140', '141', 
  '142', '143', '144', '145', '146', '147', '148', '149', '151', '152', '153', 
  '155', '156', '157', '158', '161', '162', '163', '164', '165', '166', '167', 
  '168', '169', '170', '171', '177', '178', '179', 
  '180', '181', '182', '183',  '188', '190', '191', 
  '192', '193', '194', '195', '196', '197', '199'
];

  // ... (otras propiedades sin cambios)
  participantes: string[] = [];
  nuevoParticipante: string = '';
  colores: string[] = [];
  estaGirando = false;
  ganador: string | null = null;
  mostrarModalGanador = false;
  isFullscreen = false;
  cantidadAGenerar: number = 50;
  modoDeIngreso: 'manual' | 'masivo' = 'manual';
  private tamanoNormal = 500;

  constructor() {
    this.sonidoRuleta.load();
    this.sonidoGanador.load();
  }

  // --- MÉTODOS ---

  // --- LÓGICA DE GIRO ---
  girarRuleta(): void {
    if (this.estaGirando || this.participantes.length < 2) return;
    this.estaGirando = true;
    this.ganador = null;

    let indiceGanador: number;

     if (this.participantes.length === 200) {
    
    // --- Lógica especial para 200 participantes ---
    // console.log("Activando modo de sorteo con ganadores pre-seleccionados.");

    // 1. Filtramos para encontrar a los candidatos válidos.
    const candidatos = this.participantes.filter(participante =>
      this.ganadoresPotenciales.includes(participante)
    );

    // 2. Si hay candidatos, elegimos uno de ellos. Si no, elegimos uno al azar de los 200.
    if (candidatos.length > 0) {
      const ganadorElegido = candidatos[Math.floor(Math.random() * candidatos.length)];
      indiceGanador = this.participantes.indexOf(ganadorElegido);
    } else {
      // console.warn("Sorteo de 200: Ningún ganador potencial encontrado. Se elegirá uno completamente al azar.");
      indiceGanador = Math.floor(Math.random() * this.participantes.length);
    }

  } else {
    
    // --- Lógica normal para cualquier otra cantidad de participantes ---
    // console.log("Activando modo de sorteo completamente aleatorio.");
    indiceGanador = Math.floor(Math.random() * this.participantes.length);
  }

    // --- LÓGICA DE SELECCIÓN DE GANADOR (CONTROLADA POR CÓDIGO) ---
    // Verificamos si hay un ganador forzado y si ese participante existe en la lista actual.
    // if (
    //   this.ganadorForzado &&
    //   this.participantes.includes(this.ganadorForzado)
    // ) {
    //   // MODO FORZADO: Usamos el ganador definido en la variable.
    //   indiceGanador = this.participantes.indexOf(this.ganadorForzado);
    // } else {
    //   // MODO ALEATORIO: Usamos la lógica de siempre.
    //   indiceGanador = Math.floor(Math.random() * this.participantes.length);
    // }
    // --- FIN DE LA LÓGICA DE SELECCIÓN ---

    this.ganador = this.participantes[indiceGanador];

    // El resto de la función para la animación y el sonido no cambia.
    const duracionGiro = 7000;
    this.sonidoRuleta.currentTime = 0;
    this.sonidoRuleta.play();
    const numParticipantes = this.participantes.length;
    const anguloPorSegmento = 360 / numParticipantes;
    const anguloGanador =
      indiceGanador * anguloPorSegmento + anguloPorSegmento / 2;
    const anguloFlecha = 270;
    let rotacionNecesaria = anguloFlecha - anguloGanador;
    if (rotacionNecesaria < 0) {
      rotacionNecesaria += 360;
    }
    const vueltasExtra = 360 * (Math.floor(Math.random() * 5) + 8);
    const rotacionTotal = vueltasExtra + rotacionNecesaria;

    const ruletaEl = this.canvas.nativeElement;
    ruletaEl.style.transition = `transform ${
      duracionGiro / 1000
    }s cubic-bezier(0.1, 0.5, 0.2, 1)`;
    ruletaEl.style.transform = `rotate(${rotacionTotal}deg)`;

    setTimeout(() => {
      this.estaGirando = false;
      this.sonidoGanador.currentTime = 0;
      this.sonidoGanador.play();
      this.mostrarModalGanador = true;
      const anguloFinalVisible = rotacionTotal % 360;
      ruletaEl.style.transition = 'none';
      ruletaEl.style.transform = `rotate(${anguloFinalVisible}deg)`;
    }, duracionGiro);
  }

  // ... (El resto de tus funciones como ngOnInit, dibujarRuleta, etc., no necesitan cambios)
  ngOnInit(): void {
    this.participantes = ['Ana', 'Luis', 'Sara', 'Juan', 'Eva'];
    this.generarColoresAleatorios();
  }
  ngAfterViewInit(): void {
    const canvasEl = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d')!;
    canvasEl.width = this.tamanoNormal;
    canvasEl.height = this.tamanoNormal;
    this.dibujarRuleta();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) {
      this.dibujarRuleta();
    }
  }
  setModoDeIngreso(modo: 'manual' | 'masivo'): void {
    this.modoDeIngreso = modo;
  }
  reiniciarSorteo(): void {
    this.participantes = ['Ana', 'Luis', 'Sara', 'Juan', 'Eva'];
    this.nuevoParticipante = '';
    this.cantidadAGenerar = 50;
    this.ganador = null;
    this.estaGirando = false;
    this.generarColoresAleatorios();
    this.dibujarRuleta();
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    const canvasEl = this.canvas.nativeElement;
    if (this.isFullscreen) {
      const tamanoMaximo =
        Math.min(window.innerWidth, window.innerHeight) * 0.85;
      canvasEl.width = tamanoMaximo;
      canvasEl.height = tamanoMaximo;
    } else {
      canvasEl.width = this.tamanoNormal;
      canvasEl.height = this.tamanoNormal;
    }
    setTimeout(() => {
      this.dibujarRuleta();
    }, 10);
  }
  generarParticipantesEnMasa(): void {
    this.participantes = Array.from({ length: this.cantidadAGenerar }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    );
    this.generarColoresAleatorios();
    this.dibujarRuleta();
  }
  generarColoresAleatorios(): void {
    this.colores = this.participantes.map(
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')}`
    );
  }
dibujarRuleta(): void {
  if (!this.ctx) return;
  const radioRuleta = this.canvas.nativeElement.width / 2;
  this.ctx.clearRect(0, 0, radioRuleta * 2, radioRuleta * 2);
  const numParticipantes = this.participantes.length;
  if (numParticipantes === 0) return;

  const anguloPorSegmento = (2 * Math.PI) / numParticipantes;
  
  // CAMBIO CLAVE: Posición del texto fija cerca del borde para que sea visible.
  const radioTexto = radioRuleta - 25; 

  const fontSize = Math.max(8, Math.min(18, 500 / numParticipantes));
  this.ctx.font = `bold ${fontSize}px Arial`;

  this.participantes.forEach((participante, i) => {
    const anguloActual = i * anguloPorSegmento;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.colores[i % this.colores.length];
    this.ctx.moveTo(radioRuleta, radioRuleta);
    this.ctx.arc(
      radioRuleta,
      radioRuleta,
      radioRuleta,
      anguloActual,
      anguloActual + anguloPorSegmento
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Se eliminó la restricción "if (numParticipantes <= 100)" para que el texto siempre se dibuje.
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.translate(radioRuleta, radioRuleta);
    this.ctx.rotate(anguloActual + anguloPorSegmento / 2);
    
    this.ctx.textAlign = 'center'; // Alineación 'center' luce mejor cerca del borde.
    this.ctx.fillText(participante, radioTexto, fontSize / 3);
    this.ctx.restore();
  });
}
  cerrarModal() {
    this.mostrarModalGanador = false;
  }
  agregarParticipante() {
    if (
      this.nuevoParticipante.trim() &&
      !this.participantes.includes(this.nuevoParticipante.trim())
    ) {
      this.participantes.push(this.nuevoParticipante.trim());
      this.nuevoParticipante = '';
      this.generarColoresAleatorios();
      this.dibujarRuleta();
    }
  }
  eliminarParticipante(index: number) {
    this.participantes.splice(index, 1);
    this.generarColoresAleatorios();
    this.dibujarRuleta();
  }
}
