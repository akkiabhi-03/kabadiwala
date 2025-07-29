import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, CheckCheck } from "lucide-react";
import { useEditOrderMutation } from "../RTK Query/AppApi";
import { toast } from "react-hot-toast";

const FinalSelling = () => {
  const { state } = useLocation();
  const order = state?.order;

  const [edit, setEdit] = useState(false);
  const [arrived, setArrived] = useState(true);
  const [orderId, setId] = useState("");
  const [Products, setProducts] = useState([]);

  const [editOrder] = useEditOrderMutation();

  // Set initial order data from location state
  useEffect(() => {
    if (order) {
      setProducts(order.items || []);
      setId(order._id);
    }
  }, [order]);

  const handleChange = (index, key, value) => {
    const updated = Products.map((item, i) =>
      i === index ? { ...item, [key]: Number(value) } : { ...item }
    );
    setProducts(updated);
  };

  const HandleEdit = async () => {
    if (!edit) {
      setEdit(true);
      return;
    }

    try {
      const payload = { items: Products, orderId };
      await editOrder(payload).unwrap();
      toast.success("Your order has been updated!");
      setEdit(false);
    } catch (err) {
      // console.error(err);
      toast.error("Failed to update order.");
    }
  };

  const navigate = useNavigate();
  const HandleSell = async () => {
    const res = window.confirm("You are selling this Order");
    if (!res) return;

    try {
      const payload = { items: Products, orderId, isSold: true };
      await editOrder(payload).unwrap();
      setArrived(false);
      toast.success("Order marked as sold!");
    } catch (err) {
      // console.error(err);
      toast.error("Failed to mark order as sold.");
    }
  };

  const HandleCancel = async () => {
    const res = window.confirm("Are you want to Cancel this Order");
    if (!res) return;

    try {

      const status = "Cancelled"
      await editOrder({ items: Products ,orderId, status }).unwrap();
      toast.success("Order is Cancelled!");
      navigate(-1)
    } catch (err) {
      // console.error(err);
      toast.error("Failed to mark order as sold.");
    }
  
  }

  return (
    <div className="md:mt-15 p-4 md:px-8 rounded shadow max-w-3xl mx-auto border border-transparent relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between px-1 sm:grid sm:grid-cols-2 gap-4 items-center border-b border-green-500 pb-2 mb-4">
          <div className="font-semibold text-lg sm:text-xl sm:font-bold text-green-900">
            Material
          </div>
          <div className="font-semibold text-lg pr-[5%] sm:text-xl sm:font-bold text-green-900 flex items-center gap-2">
            Weight (kg)
            <button
              onClick={HandleEdit}
              type="button"
              className="text-green-600 hover:text-green-800 ml-2"
            >
              {edit ? (
                <span className="flex items-center sm:text-lg gap-1 text-sm">
                  <CheckCheck size={16} /> Editing...
                </span>
              ) : (
                <span className="flex sm:text-lg items-center gap-1 text-sm">
                  <Pencil size={16} /> Edit
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {Products?.map((item, ind) => (
            <div key={ind} className="grid grid-cols-2 gap-4 items-center">
              <div className="text-green-900 font-medium">{item.material}</div>
              <input
                type="number"
                min={0}
                value={item.weight ?? ""}
                readOnly={!edit}
                onChange={(e) => handleChange(ind, "weight", e.target.value)}
                className={`w-full border rounded p-2 text-green-600 font-medium ${
                  edit
                    ? "border-green-500 text-green-700 focus:outline-green-700"
                    : "cursor-not-allowed border-green-700"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Sell Button */}
        <div className="mt-8 flex justify-between">
          <button onClick={HandleCancel}
            className={`px-[16%] py-2 bg-orange-600 text-lg sm:font-bold rounded font-medium transition text-white`} >
            Cancel
          </button>
          <button
            disabled={!arrived}
            onClick={HandleSell}
            className={`px-[16%] py-2 text-lg sm:font-bold rounded font-medium transition ${
              arrived
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-green-300 text-green-800 cursor-not-allowed"
            }`}
          >
            Sell Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalSelling;

