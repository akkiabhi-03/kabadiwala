import { useMemo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLazyGetMaterialRateQuery } from "../RTK Query/AppApi";
import { selectGetMaterialRateResult } from "../RTK Query/Selectors";

const SellingDetails = () => {
  const { state } = useLocation();
  const items = state?.order?.items || [];

  const storedRates = useSelector(
    (state) => selectGetMaterialRateResult(state)?.data
  );
  const [triggerPrice, { data: fetchedRates }] = useLazyGetMaterialRateQuery();
  const [priceArr, setPriceArr] = useState([]);

  useEffect(() => {
    const rates = storedRates || fetchedRates;
    if (!rates?.length) {
      ;(async () => {
        try {
          const res = await triggerPrice().unwrap();
          if (res?.pricePerKg) {
            setPriceArr(res.pricePerKg);
          }
        } catch (err) {
          // console.error("Failed to fetch material rate:", err);
        }
      })();
    } else {
      setPriceArr(rates.pricePerKg || rates); // handles both shape
    }
  }, [storedRates, fetchedRates]);

  const { details, total } = useMemo(() => {
    let total = 0;
    const details = items.map((item) => {
      const rateObj = priceArr.find((p) => p.material === item.material);
      const rate = rateObj?.rate || rateObj?.price || 0;
      const price = rate * item.weight;
      total += price;
      return { ...item, rate, price };
    });
    return { details, total };
  }, [items, priceArr]);

  if (!details.length) return null;

  return (
    <div className="p-4 md:p-8 rounded shadow max-w-3xl mx-auto mt-6">
      <h2 className="text-green-700 font-semibold mb-4 text-base">
        Price Details:
      </h2>

      <div className="grid grid-cols-3 gap-4 text-green-800 font-semibold px-2 py-2 rounded">
        <div>Material</div>
        <div>Weight × Rate (₹)</div>
        <div>Price</div>
      </div>

      <div className="space-y-2 mt-2">
        {details.map((item, ind) => (
          <div
            key={ind}
            className="grid grid-cols-3 gap-4 items-center px-2 py-1 border-b border-green-200"
          >
            <div className="text-green-900">{item.material}</div>
            <div className="text-green-800">
              {item.weight} × {item.rate}
            </div>
            <div className="text-green-800 font-medium">
              ₹{item.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 items-center px-2 py-3 border-t border-green-300 mt-4 font-semibold text-green-900">
        <div className="col-span-2 text-right">Total</div>
        <div className="text-green-700">₹{total.toFixed(2)}</div>
      </div>
      <div className="h-8"></div>
    </div>
  );
};

export default SellingDetails;
