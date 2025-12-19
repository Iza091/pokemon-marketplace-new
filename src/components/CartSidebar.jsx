import { ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import Checkout from "./Checkout";

const CartSidebar = () => {
  const { items, removeFromCart, updateItemQuantity, total, itemCount } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const open = !!e?.detail && !!e.detail.open;
      setIsMobileFiltersOpen(open);
      if (open) setIsOpen(false);
    };

    window.addEventListener("mobileFiltersVisibility", handler);

    const openHandler = (e) => {
      const open = e?.detail?.open ?? true;
      setIsOpen(!!open);
    };
    window.addEventListener("openCart", openHandler);

    return () => {
      window.removeEventListener("mobileFiltersVisibility", handler);
      window.removeEventListener("openCart", openHandler);
    };
  }, []);

  if (showCheckout) {
    return <Checkout onClose={() => setShowCheckout(false)} />;
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Caja </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="flex justify-center mb-4">
                      <ShoppingBag size={64} className="text-gray-300" />
                    </div>
                    <p>Tu caja está vacía</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 border rounded-lg"
                      >
                        <img
                          src={item.pokemon.image}
                          alt={item.pokemon.name}
                          className="w-16 h-16 object-contain"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {item.pokemon.name.charAt(0).toUpperCase() +
                              item.pokemon.name.slice(1)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            ${item.unitPrice} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center border rounded"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.pokemon.stock}
                            className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${item.totalPrice}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-bold"
                  >
                    Proceder al Pago
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded"
                  >
                    Seguir Comprando
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;
