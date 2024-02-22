import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ showSpinner, currency, amount, onSuccess }) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                {
                  amount: { currency_code: currency, value: amount },
                },
              ],
            })
            .then((orderId) => orderId)
        }
        onApprove={(data, actions) => {
          actions.order.capture().then(async (response) => {
            if (response.status === "COMPLETED") {
              onSuccess(data, actions);
            }
          });
        }}
      />
    </>
  );
};

export default function Paypal({ amount, onSuccess }) {
  return (
    <div style={{ maxWidth: "750px", minHeight: "200px" }}>
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          currency={"USD"}
          amount={amount}
          showSpinner={false}
          onSuccess={onSuccess}
        />
      </PayPalScriptProvider>
    </div>
  );
}
