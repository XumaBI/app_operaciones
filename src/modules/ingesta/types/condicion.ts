import { Movimiento } from "./movimiento";

export interface Condicion {
  id: number;
  por_retorno: number | null;
  movimiento?: {
    tipo_movimiento: string;
  } | null;
  movimientos?: Movimiento[] | null;
}