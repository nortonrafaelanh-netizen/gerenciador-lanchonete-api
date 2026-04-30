import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../app/context/CartContext";
import { CheckCircle, Clock, ChefHat, Bike, Package } from "lucide-react";

type OrderStatus =
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered";

export function OrderComplete() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderNumber] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [status, setStatus] = useState<OrderStatus>("confirmed");

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
      return;
    }

    const statusFlow: OrderStatus[] = [
      "confirmed",
      "preparing",
      "ready",
      "delivering",
      "delivered",
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statusFlow.length) {
        setStatus(statusFlow[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [cart.length, navigate]);

  const statusConfig = {
    confirmed: {
      icon: CheckCircle,
      text: "Pedido Confirmado",
      color: "text-green-600",
    },
    preparing: {
      icon: ChefHat,
      text: "Preparando seu Pedido",
      color: "text-orange-600",
    },
    ready: { icon: Package, text: "Pedido Pronto", color: "text-blue-600" },
    delivering: {
      icon: Bike,
      text: "Saiu para Entrega",
      color: "text-purple-600",
    },
    delivered: {
      icon: CheckCircle,
      text: "Pedido Entregue",
      color: "text-green-600",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const handleNewOrder = () => {
    clearCart();
    navigate("/");
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4`}
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Pedido Realizado com Sucesso!
            </h1>
            <p className="text-gray-600">Número do pedido: #{orderNumber}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <StatusIcon className={`w-8 h-8 ${currentStatus.color}`} />
              <h2 className={`text-2xl font-bold ${currentStatus.color}`}>
                {currentStatus.text}
              </h2>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Clock size={16} />
              <span>Tempo estimado: 35-45 minutos</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {[
              { status: "confirmed", label: "Pedido Confirmado" },
              { status: "preparing", label: "Em Preparo" },
              { status: "ready", label: "Pronto" },
              { status: "delivering", label: "Em Entrega" },
              { status: "delivered", label: "Entregue" },
            ].map((step, index) => {
              const isCompleted =
                [
                  "confirmed",
                  "preparing",
                  "ready",
                  "delivering",
                  "delivered",
                ].indexOf(status) >= index;
              const isCurrent =
                ["confirmed", "preparing", "ready", "delivering", "delivered"][
                  index
                ] === status;

              return (
                <div key={step.status} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span
                    className={`font-medium ${isCompleted ? "text-orange-600" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Itens do Pedido</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de entrega</span>
              <span className="font-bold">R$ 5.00</span>
            </div>
            <div className="flex justify-between text-xl pt-2 border-t">
              <span className="font-bold">Total</span>
              <span className="font-bold text-orange-600">
                R$ {(total + 5).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewOrder}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
        >
          Fazer Novo Pedido
        </button>
      </div>
    </div>
  );
}

export default OrderComplete;
