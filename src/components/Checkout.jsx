import { useState } from "react";
import { useCart } from "../contexts/CartContext";

const Checkout = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [validationFailedOnce, setValidationFailedOnce] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const { clearCart, total, items } = useCart();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const simulatePayment = async () => {
    if (!validationFailedOnce) {
      const card = (formData.cardNumber || "").replace(/\s+/g, "");
      const cvv = (formData.cvv || "").trim();
      const validCard = card.length >= 12;
      const validCvv = cvv.length === 3;

      if (!validCard || !validCvv) {
        setStep(2);
        setPaymentSuccess(false);
        setIsProcessing(false);
        setValidationFailedOnce(true);
        return;
      }
    }

    setStep(2);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const success = Math.random() > 0.15;
    setPaymentSuccess(success);
    setIsProcessing(false);

    if (success) {
      setValidationFailedOnce(false);
      setTimeout(() => {
        clearCart();
        onClose();
      }, 2000);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Información de Pago</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Ash Ketchum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="ash@pokemon.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="MM/YY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="123"
                  maxLength="3"
                />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-lg font-bold mb-2">
                Total a pagar:{" "}
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </p>
              <button
                onClick={simulatePayment}
                disabled={isProcessing}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded font-bold"
              >
                {isProcessing ? "Procesando..." : "Confirmar y Pagar"}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            {isProcessing && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Procesando Pago...</h3>
                <p className="text-gray-600">
                  Estamos verificando tu información
                </p>
              </>
            )}

            {paymentSuccess !== null && !isProcessing && (
              <>
                <div
                  className={`text-6xl mb-4 ${
                    paymentSuccess ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {paymentSuccess ? "✓" : "✗"}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {paymentSuccess ? "¡Pago Exitoso!" : "Pago Fallido"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {paymentSuccess
                    ? "Tu pedido ha sido procesado. Recibirás un correo de confirmación."
                    : "Hubo un problema con tu pago. Por favor, intenta nuevamente."}
                </p>
                <button
                  onClick={() => {
                    if (!paymentSuccess) {
                      setPaymentSuccess(null);
                      setStep(1);
                    } else {
                      onClose();
                    }
                  }}
                  className={`w-full py-3 rounded font-bold ${
                    paymentSuccess
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {paymentSuccess ? "Continuar Comprando" : "Reintentar"}
                </button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Finalizar Compra</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex mt-4">
            <div
              className={`flex-1 text-center py-2 ${
                step >= 1 ? "text-blue-500 font-bold" : "text-gray-400"
              }`}
            >
              1. Información
            </div>
            <div
              className={`flex-1 text-center py-2 ${
                step >= 2 ? "text-blue-500 font-bold" : "text-gray-400"
              }`}
            >
              2. Pago
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && items.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold mb-3">Resumen del Pedido:</h4>
              <div className="space-y-2">
                {items.slice(0, showAllItems ? items.length : 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm bg-white p-2 rounded"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <img
                        src={item.pokemon.image}
                        alt={item.pokemon.name}
                        className="w-8 h-8 object-contain"
                      />
                      <span>
                        {item.pokemon.name} x{item.quantity}
                      </span>
                    </div>
                    <span className="font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {items.length > 3 && (
                <button
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="mt-3 w-full text-blue-600 hover:text-blue-800 font-medium text-sm py-2 border border-blue-300 rounded hover:bg-blue-50"
                >
                  {showAllItems
                    ? `Mostrar menos (${6}/${items.length})`
                    : `Ver más (${3}/${items.length})`}
                </button>
              )}

              <div className="border-t mt-3 pt-3 font-bold">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          )}

          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
