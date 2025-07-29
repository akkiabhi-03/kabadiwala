import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetMaterialRateQuery } from "../RTK Query/AppApi";
import { selectGetMaterialRateResult } from "../RTK Query/Selectors";

const PriceTable = () => {
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
      setPriceArr(rates.pricePerKg || rates); // handles both structure types
    }
  }, [storedRates, fetchedRates]);

  return (
    <div className="mt-8 p-4 md:p-8 rounded shadow mx-auto">
      <h2 className="text-red-600 font-medium mb-4 text-sm md:text-base">
        The selling price will be considered for that day's current rate on which the sale is made.
      </h2>

      {/* Table Header */}
      <div className="grid grid-cols-2 sm:gap-x-16 gap-4 font-semibold bg-green-600 text-white rounded px-2 py-2 mb-2">
        <div>Material</div>
        <div>Price Per Kg</div>
      </div>

      {/* Table Body */}
      <div className="space-y-2">
        {priceArr?.map((row, ind) => (
          <div
            key={ind}
            className="grid grid-cols-2 sm:gap-x-16 gap-4 items-center px-2 py-1 border-b border-green-500"
          >
            <div className="text-green-900">{row?.material}</div>
            <div className="text-green-800 font-medium">₹ {row?.rate}</div>
          </div>
        ))}
      </div>
      <div className="h-8 md:hidden"></div>
    </div>
  );
};

export default PriceTable;
