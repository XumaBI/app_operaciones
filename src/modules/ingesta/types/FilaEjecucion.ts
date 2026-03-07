export interface FilaEjecucion {
  id: number;
  condicion_id: number;
  movimiento: string;
  porcentaje: string;
  cant_registrada: number;
  prima_registrada: number;
  cantidad: number | null;
  prima: number | null;
  ebitda: number | null;
}