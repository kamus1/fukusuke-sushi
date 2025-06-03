/**
 * Calcula el precio con descuento y lo redondea al número entero más cercano
 * @param precioOriginal Precio original del producto
 * @param descuento Porcentaje de descuento (0-100)
 * @returns Precio con descuento redondeado
 */
export const calcularPrecioConDescuento = (precioOriginal: number, descuento: number): number => {
  const precioConDescuento = precioOriginal * (1 - descuento / 100);
  return Math.round(precioConDescuento);
}; 