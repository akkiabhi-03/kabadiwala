import { useNavigate } from "react-router-dom";
import { staticMaterials } from "../Components/Material.jsx";

const MyOrder = ({ orders }) => {
  const navigate = useNavigate();

  const getImageByName = (name) => {
    const found = staticMaterials.find((item) =>
      name.toLowerCase().includes(item.name.toLowerCase())
    );
    return found?.image || "https://via.placeholder.com/150";
  };

  const handleOrderClick = (order) => {
    navigate("/order-details", { state: { order } });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto md:pt-16 text-green-500">
      <h1 className="text-2xl font-bold text-center mb-4 text-orange-400">MY Orders</h1>
      {orders?.map((order, index) => {
        const firstItem = order?.items?.[0];
        const itemName = firstItem?.material || "Unknown Material";
        const itemWeight = firstItem?.weight || "";
        const itemImage = getImageByName(itemName);

        return (
          <div className="mb-6" key={index}>
            <h2 className="text-lg font-semibold sm:text-xl sm:font-bold my-1 mx-4">Order {index + 1}</h2>
            <div
              onClick={() => handleOrderClick(order)}
              className="cursor-pointer flex justify-between px-4 border rounded-2xl shadow hover:shadow-lg p-2 transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{itemName}</h2>
                <h2 className="text-lg font-semibold text-orange-400">{itemWeight} ( Kg )</h2>
                <h2 className="text-lg font-semibold text-orange-400">..........</h2>
              </div>
              <img
                src={itemImage}
                alt={itemName}
                className="w-24 h-16 object-cover rounded-xl mb-3"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrder;
