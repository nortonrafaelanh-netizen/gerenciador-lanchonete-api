// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../app/context/CartContext";
import { useAuth } from "../app/context/AuthContext";
import orderService from "../services/orderService";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle,
  Clock,
  Bike,
  Home,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────
type OrderStatus = "preparing" | "ontheway" | "delivered";

interface Order {
  id: string;
  items: any[];
  total: number;
  status: OrderStatus;
  trackingUrl: string;
  createdAt: string;
}

// ── Dados dos status ─────────────────────────────────────────────
const STATUS_STEPS = [
  {
    key: "preparing",
    label: "Em Preparo",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    description: "Seu pedido está sendo preparado com carinho!",
  },
  {
    key: "ontheway",
    label: "Saiu para Entrega",
    icon: Bike,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description: "O entregador está a caminho!",
  },
  {
    key: "delivered",
    label: "Entregue",
    icon: Home,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
    description: "Pedido entregue! Bom apetite!",
  },
];

const STATUS_ORDER: OrderStatus[] = ["preparing", "ontheway", "delivered"];

// ── Componente principal ─────────────────────────────────────────
export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, clearCart, unidade } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFranchisee = user?.role === "FRANQUEADO";

  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(
    {},
  );
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const mapBackendStatus = (status: string): OrderStatus => {
    const normalized = String(status).toUpperCase();
    if (normalized === "ENTREGUE") return "delivered";
    if (normalized === "PRONTO") return "ontheway";
    return "preparing";
  };

  const normalizeOrder = (order: any): Order => {
    const items = Array.isArray(order.products)
      ? order.products.map((product: any) => ({
          id: String(
            product.id ??
              product.product_id ??
              product.pivot?.product_id ??
              product._id ??
              Math.random(),
          ),
          name: product.nome ?? product.name ?? "Produto",
          description: product.descricao ?? product.description ?? "",
          price: Number(
            product.preco ??
              product.price ??
              product.pivot?.preco_unitario ??
              0,
          ),
          image:
            product.image ??
            product.foto ??
            product.photo ??
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100",
          quantity: Number(
            product.pivot?.quantidade ?? product.quantidade ?? 1,
          ),
        }))
      : [];

    return {
      id: String(
        order.numero_pedido ?? order.id ?? order._id ?? `PED-${Date.now()}`,
      ),
      items,
      total: Number(order.total ?? 0),
      status: mapBackendStatus(order.status ?? "PENDENTE"),
      trackingUrl: String(order.tracking_url ?? order.trackingUrl ?? ""),
      createdAt: String(
        order.created_at ??
          order.createdAt ??
          new Date().toLocaleString("pt-BR"),
      ),
    };
  };

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (cart.length === 0) return;

    const franchiseIds = Array.from(
      new Set(cart.map((item) => item.franchiseId ?? "")),
    ).filter(Boolean);

    if (franchiseIds.length > 1) {
      setCheckoutError(
        "O carrinho contém produtos de mais de uma unidade. Separe os pedidos por unidade.",
      );
      return;
    }

    const franchiseId = Number(franchiseIds[0] || 1);

    const orderPayload = {
      franchise_id: franchiseId,
      numero_pedido: `PED-${Date.now()}`,
      products: cart.map((item) => ({
        product_id: item.id,
        quantidade: item.quantity || 1,
      })),
    };

    setCreatingOrder(true);

    try {
      const createdOrder = await orderService.create(orderPayload);
      const normalizedOrder = normalizeOrder(createdOrder);
      setOrders((prev) => [normalizedOrder, ...prev]);
      clearCart();
      setExpandedOrder(normalizedOrder.id);
    } catch (error) {
      console.error("Erro criando pedido:", error);
      setCheckoutError(
        error?.message ||
          "Não foi possível finalizar o pedido. Tente novamente.",
      );
    } finally {
      setCreatingOrder(false);
    }
  };

  // Franqueado avança status
  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = STATUS_ORDER.indexOf(o.status);
        if (idx < STATUS_ORDER.length - 1) {
          return { ...o, status: STATUS_ORDER[idx + 1] };
        }
        return o;
      }),
    );
  };

  // Franqueado salva link de rastreio
  const saveTracking = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, trackingUrl: trackingInputs[orderId] ?? o.trackingUrl }
          : o,
      ),
    );
  };

  // ── Carrinho vazio ───────────────────────────────────────────
  if (cart.length === 0 && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2 text-gray-800">
              Carrinho vazio
            </h2>
            <p className="text-gray-500 mb-6">
              Adicione produtos para começar seu pedido
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
            >
              Ver Produtos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-black mb-8 text-gray-900 uppercase italic tracking-tighter">
          {cart.length > 0 ? "Seu Pedido" : "Acompanhar Pedidos"}
        </h1>

        {/* ── CARRINHO ATIVO ── */}
        {cart.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg text-gray-800 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {item.description}
                    </p>
                    <p className="text-orange-600 font-bold mt-1">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        className="p-2 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-black text-gray-800">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                        className="p-2 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-black text-gray-800">
                      R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-black text-gray-800 mb-4">
                  Resumo
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxa de entrega</span>
                    <span className="font-bold">R$ 5,00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-black text-gray-800">Total</span>
                    <span className="font-black text-orange-600">
                      R$ {(total + 5).toFixed(2)}
                    </span>
                  </div>
                </div>
                {checkoutError && (
                  <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {checkoutError}
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={creatingOrder}
                  className={`w-full py-4 rounded-xl font-black transition-colors shadow-lg shadow-orange-100 uppercase tracking-widest italic ${
                    creatingOrder
                      ? "bg-orange-300 text-white cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  {creatingOrder ? "Processando Pedido..." : "Finalizar Pedido"}
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PEDIDOS EM ANDAMENTO ── */}
        {orders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-2">
              <Package size={24} className="text-orange-500" />
              Pedidos em Andamento
            </h2>

            {orders.map((order) => {
              const currentStep = STATUS_STEPS.find(
                (s) => s.key === order.status,
              )!;
              const currentIdx = STATUS_ORDER.indexOf(order.status);
              const isExpanded = expandedOrder === order.id;
              const isDelivered = order.status === "delivered";

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${currentStep.border}`}
                >
                  {/* Header do pedido */}
                  <div
                    className={`flex items-center justify-between p-5 cursor-pointer ${currentStep.bg}`}
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                        <currentStep.icon
                          size={22}
                          className={currentStep.color}
                        />
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm">
                          {order.id}
                        </p>
                        <p className={`text-sm font-bold ${currentStep.color}`}>
                          {currentStep.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-gray-700 text-sm hidden sm:block">
                        R$ {order.total.toFixed(2)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 space-y-6">
                      {/* Linha de progresso */}
                      <div className="flex items-center gap-2">
                        {STATUS_STEPS.map((step, idx) => {
                          const done = idx <= currentIdx;
                          const StepIcon = step.icon;
                          return (
                            <div
                              key={step.key}
                              className="flex items-center flex-1"
                            >
                              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                    done
                                      ? `${step.bg} ${step.border}`
                                      : "bg-gray-100 border-gray-200"
                                  }`}
                                >
                                  {done ? (
                                    <StepIcon
                                      size={18}
                                      className={step.color}
                                    />
                                  ) : (
                                    <StepIcon
                                      size={18}
                                      className="text-gray-300"
                                    />
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-bold text-center leading-tight ${
                                    done ? step.color : "text-gray-300"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                              {idx < STATUS_STEPS.length - 1 && (
                                <div
                                  className={`flex-1 h-0.5 mx-1 rounded transition-all ${
                                    idx < currentIdx
                                      ? "bg-orange-400"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Mensagem de status */}
                      <div
                        className={`rounded-xl px-4 py-3 ${currentStep.bg} border ${currentStep.border}`}
                      >
                        <p className={`text-sm font-bold ${currentStep.color}`}>
                          {isDelivered ? "✅ " : "⏳ "}
                          {currentStep.description}
                        </p>
                      </div>

                      {/* Link de rastreio (cliente vê, franqueado edita) */}
                      {order.trackingUrl && !isFranchisee && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline"
                        >
                          <LinkIcon size={16} />
                          Rastrear entrega
                        </a>
                      )}

                      {/* Itens do pedido */}
                      <div>
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                          Itens
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100";
                                }}
                              />
                              <span className="text-sm text-gray-700 flex-1">
                                {item.name}{" "}
                                <span className="text-gray-400">
                                  x{item.quantity || 1}
                                </span>
                              </span>
                              <span className="text-sm font-bold text-gray-700">
                                R${" "}
                                {(item.price * (item.quantity || 1)).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── PAINEL DO FRANQUEADO ── */}
                      {isFranchisee && (
                        <div className="border-t border-dashed border-gray-200 pt-5 space-y-4">
                          <p className="text-xs font-black uppercase text-orange-500 tracking-widest">
                            Controle do Franqueado
                          </p>

                          {/* Link de rastreio */}
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">
                              Link de rastreio
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="https://rastreio.transportadora.com/..."
                                value={
                                  trackingInputs[order.id] ?? order.trackingUrl
                                }
                                onChange={(e) =>
                                  setTrackingInputs((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                              />
                              <button
                                onClick={() => saveTracking(order.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                              >
                                Salvar
                              </button>
                            </div>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline mt-1 flex items-center gap-1"
                              >
                                <LinkIcon size={11} /> {order.trackingUrl}
                              </a>
                            )}
                          </div>

                          {/* Avançar status */}
                          {!isDelivered && (
                            <button
                              onClick={() => advanceStatus(order.id)}
                              className="w-full py-3 bg-orange-600 text-white rounded-xl font-black hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={18} />
                              Avançar para:{" "}
                              {STATUS_STEPS[currentIdx + 1]?.label}
                            </button>
                          )}

                          {isDelivered && (
                            <div className="text-center py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 font-bold text-sm">
                              ✅ Pedido concluído
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
