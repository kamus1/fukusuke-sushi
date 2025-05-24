import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const flowToken = searchParams.get("token");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!flowToken) {
        setError("No se encontró el token del comprobante.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5001/api/orders/by-token/${flowToken}`);
        if (!res.ok) throw new Error("Error al cargar el comprobante.");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError("No se pudo obtener el comprobante.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [flowToken]);

  if (loading) return <div>Cargando comprobante...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!order) return <div>No se encontró la orden.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Poppins, sans-serif" }}>
      <h2>¡Pago confirmado!</h2>
      <p>Gracias por tu compra. Aquí está tu comprobante:</p>

      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 8 }}>
        <p><strong>Ticket ID:</strong> {order.ticketId}</p>
        <p><strong>Fecha:</strong> {new Date(order.fechaPedido).toLocaleString()}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Método de pago:</strong> {order.metodoPago || 'Flow.cl'}</p>
        <p><strong>Estado:</strong> {order.estado}</p>

        <h4>Productos:</h4>
        <ul>
          {order.items.map((item: any, idx: number) => (
            <li key={idx}>
              {item.nombre} - {item.cantidad} x ${item.precio.toLocaleString()} = <strong>${item.subtotal.toLocaleString()}</strong>
            </li>
          ))}
        </ul>

        <p style={{ fontWeight: "bold" }}>Total pagado: ${order.total.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
