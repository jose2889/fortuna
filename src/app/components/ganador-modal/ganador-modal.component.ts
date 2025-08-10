import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-ganador-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ganador-modal.component.html',
  styleUrls: ['./ganador-modal.component.css']
})
export class GanadorModalComponent implements OnInit, OnDestroy {
  @Input() nombreGanador: string | null = 'Sin nombre';
  @Output() cerrar = new EventEmitter<void>();
  
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  private myConfetti: any;

  ngOnInit(): void {
    // Escuchar la tecla 'Escape' para cerrar el modal
    document.addEventListener('keydown', this.onKeydown.bind(this));
    this.lanzarConfeti();
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown.bind(this));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cerrarModal();
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
  
  lanzarConfeti() {
    // Asegurarnos que el canvas esté listo
    setTimeout(() => {
        const canvas = this.confettiCanvas.nativeElement;
        this.myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true
        });

        // Animación de confeti
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
          // Lanzar desde los lados
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
    }, 100);
  }
}