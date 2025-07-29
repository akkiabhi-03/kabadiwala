import React, { useState } from "react";
import { useNewOrderMutation } from "../RTK Query/AppApi.jsx";
import { toast } from "react-hot-toast";

const recyclingLogo =
  "https://www.recycling.com/wp-content/uploads/2016/06/recycling-symbol-icon-twotone-dark-green.png";

const materialOptions = [
  "Raddi (Old news paper)",
  "Plastic",
  "Mixed paper",
  "Iron",
  "Carton (Gatta)",
  "Copper",
  "Aluminium",
];

const DynamicTable = () => {
  const [items, setItems] = useState([{ material: "", w: "" }]);
  const [bookOrder] = useNewOrderMutation();

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    const allFilled = updatedItems[index].material && updatedItems[index].w;
    if (index === items.length - 1 && allFilled) {
      setItems([...updatedItems, { material: "", w: "" }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedItems = items
      .filter((item) => item.material.trim() && item.w.trim())
      .map((item) => ({
        material: item.material.trim(),
        weight: Number(item.w.trim()),
      }));

    if (trimmedItems.length === 0) {
      toast.error("Please add at least one valid item");
      return;
    }

    try {
      const response = await bookOrder({ items: trimmedItems }).unwrap();
      // console.log("Ordered Successfully:", response);
      setItems([{ material: "", w: "" }]);
      toast.success("Ordered!");
    } catch (err) {
      // console.error(err);
      toast.error("Failed to submit order");
    }

    // console.log("Submitted Data:", trimmedItems);
  };

  const selectedMaterials = items.map((r) => r.material).filter(Boolean);

  return (
    <div className="px-2 py-6 md:pt-16 sm:p-6 md:p-8 ">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={recyclingLogo}
          alt="Recycle Logo"
          className="w-12 h-12 sm:w-16 sm:h-16"
        />
        <h1 className="ml-3 text-green-500 text-xl sm:text-3xl font-bold drop-shadow-lg">
          <span>Promote Recycling.</span> <span className="whitespace-nowrap">Protect Nature.</span>
        </h1>
      </div>

      <h2 className="text-orange-600 font-semibold mb-4 text-sm md:text-base">
        ♻️ Note: If total weight exceeds 50Kg, you'll get ₹3 extra per kg!
      </h2>

      <form
        onSubmit={handleSubmit}
        className="border border-green-500 rounded-md px-1 sm:p-4 py-4 space-y-4 transition"
      >
        {/* Header */}
        <div className="text-lg sm:text-xl sm:font-bold grid grid-cols-2 gap-4 bg-green-600 text-white px-1 sm:px-2 py-2 rounded">
          <div>Material</div>
          <div>Approx Weight</div>
        </div>

        {/* items */}
        {items.map((row, idx) => {
          const availableOptions = materialOptions.filter(
            (mat) =>
              !selectedMaterials.includes(mat) || row.material === mat
          );

          return (
            <div
              key={idx}
              className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-16 items-center px-1"
            >
              <select
                value={row.material || ""}
                onChange={(e) => handleChange(idx, "material", e.target.value)}
                className="w-full sm:text-lg border border-green-400 rounded p-2 text-green-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option value="">Select Material</option>
                {availableOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={row.w || ""}
                min={0}
                onChange={(e) => handleChange(idx, "w", e.target.value)}
                placeholder="Weight in kg"
                className="w-full sm:text-lg border border-green-400 rounded p-2 text-green-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
          );
        })}

        {/* Submit Button */}
        <div className="text-right pt-4">
          <button
            type="submit"
            className="bg-green-600 text-lg font-semibold hover:bg-emerald-700 text-white sm:font-bold px-8 py-2 rounded transition"
          >
            Order Pickup
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicTable;
