import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectGetMaterialRateResult } from "../RTK Query/Selectors";
import { useLazyGetMaterialRateQuery } from "../RTK Query/AppApi";

export  const staticMaterials = [
  {
    name: "Raddi (Old news paper)",
    image:
      "https://imgs.search.brave.com/8xoVWlcdh9wtVtYFVQxsUkCSRibrfvtl9d6pBcw5Mec/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE0/MDQwMDY4MC9waG90/by9uZXdzcGFwZXIt/YnVuZGxlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1NWmNG/SEdoX1NxQTBPSnlX/NThsWURDZ2ZYd1dZ/aXd1NFRqR3I0c3Rq/MVVjPQ",
  },
  {
    name: "Carton (Gatta)",
    image:
      "https://imgs.search.brave.com/wnWNjt7F7cwTFMB64ToDYAzmto-gWhm845pHGPXDxJw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFWZncrVnhZVEwu/anBn",
  },
  {
    name: "Mixed paper",
    image:
      "https://imgs.search.brave.com/j5Y0fxIOxNNbF2rXyGUav29rjcVcmpoRgfC8B8skk7I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzE4LzE2Lzc5/LzM2MF9GXzExODE2/NzkyNl9veG8zTkJK/SHlkNTU2ZEVKbndZ/ekltSkJ1d2dlZFIz/SS5qcGc",
  },
  {
    name: "Plastic",
    image:
      "https://imgs.search.brave.com/6eg44FBTuDcIlJBCcXl4aiQvLH_b6QtAw2C_G59ejgo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzQyLzk3LzE5/LzM2MF9GXzEwNDI5/NzE5NTBfTEw3cTUy/YjlPUWRSRkhjU1N1/MG52SENJZldZNDEx/cWcuanBn",
  },
  {
    name: "Iron",
    image:
      "https://imgs.search.brave.com/OiIlPkC7c3rnXdzLfBM7PJ0X-AjWuxoTgEscCE8ZHaE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9pcm9uLXJv/ZC13aGl0ZS1iYWNr/Z3JvdW5kLTI2MG53/LTU4MTU4Nzg3MC5q/cGc",
  },
  {
    name: "Aluminium",
    image:
      "https://imgs.search.brave.com/HGzOAon2Nblus5ejmNUnNOId9MrSwa1BbKhV3bpQ9a0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzk0LzI3LzM0/LzM2MF9GXzM5NDI3/MzQ1Ml92eXJlVEVx/WDlIVEJvSWFkblpR/UFFlandtM1kxWVlm/Sy5qcGc",
  },
  {
    name: "Copper",
    image:
      "https://imgs.search.brave.com/CwvhdxJ_XohsleVkh6c159ISGXmaQPkcu-S-F1iOjuk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDUu/ZGVwb3NpdHBob3Rv/cy5jb20vMTAwODI3/Mi82NjQzNy9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzY2NDM3MjE3/Mi1zdG9jay1waG90/by1zY3JhcC1jb3Bw/ZXItd2lyZS1jYWJs/ZS1saW5lLmpwZw",
  },
];

const ScrapMaterialList = () => {
  const storedRates = useSelector((state) => selectGetMaterialRateResult(state)?.data);
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
      setPriceArr(rates.pricePerKg || rates);
    }
  }, [storedRates, fetchedRates]);

  const getPriceForMaterial = (material) => {
    const rateObj = priceArr.find((r) => r.material === material);
    return rateObj ? `₹${rateObj.rate}/kg` : "₹--/kg";
  };

  return (
    <div className="w-full md:pt-16 px-1 sm:px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        What We Purchase
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {staticMaterials.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-3 flex flex-col items-center hover:shadow-lg transition duration-200"
          >
            <img
              loading="lazy"
              src={item.image}
              alt={item.name}
              className="max-w-60 sm:h-[80%] sm:w-[70%] w-[90%] h-[75%] max-h-48 object-cover rounded mb-2"
            />
            <p className="text-center text-sm font-medium text-gray-700">
              {item.name}
            </p>
            <p className="text-green-600 font-semibold text-sm mt-1">
              {getPriceForMaterial(item.name)}
            </p>
          </div>
        ))}
      </div>
      <div className="h-12"></div>
    </div>
  );
};

export default ScrapMaterialList;
