import { PhoneCall } from "lucide-react";

const whatsappIcon =
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

const ContactActions = ({ phoneNumber = "+91 9876543210" }) => {
  return (
    <div className="w-full flex flex-col  md:mt-20 px-4 sm:px-10">
      <h2 className="text-green-700 text-4xl sm:text-6xl font-extrabold text-center mb-2">
        ♻️ Online Kabadiwala
      </h2>

      <p className="text-green-600 text-base sm:text-lg text-center max-w-2xl mx-auto mb-6">
        Recycle the smart way with B Tech Kabadiwala — offering flexible, door-to-door scrap pickup and instant payment at your doorstep. No waiting, no worries — just tap, schedule, and earn while helping the planet!
      </p>


      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        {/* Call Box */}
        <a
          href={`tel:${phoneNumber}`}
          className="w-full sm:w-[320px] flex flex-col items-center gap-4 border border-green-500 rounded-xl p-6 bg-white shadow hover:shadow-lg transition"
        >
          <PhoneCall size={40} strokeWidth={2.2} className="text-green-600 my-1" />
          <span className="text-2xl md:text-3xl font-bold text-green-700 tracking-wide">
            {phoneNumber}
          </span>
          <p className="text-green-600 font-medium text-sm text-center">
            Tap to Call for Instant Pickup or Help and Inquiry
          </p>
        </a>

        {/* WhatsApp Box */}
        <a
          href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-[320px] flex flex-col items-center gap-4 border border-green-500 rounded-xl p-6 bg-white shadow hover:shadow-lg transition"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="w-12 h-12" />
          <span className="text-2xl md:text-3xl font-bold text-green-700 tracking-wide">
            {phoneNumber}
          </span>
          <p className="text-green-600 font-medium text-sm text-center">
            Chat on WhatsApp — Quick Replies, Easy Booking
          </p>
        </a>
      </div>

      <p className="text-center text-green-700 mt-6 font-semibold">
        ♻️ Sell smarter. Recycle greener. Get paid faster.
      </p>
    </div>
  );
};

export default ContactActions;
