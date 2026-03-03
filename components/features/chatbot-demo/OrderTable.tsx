import OrdersContent from '../order';
import { FaChevronDown } from "react-icons/fa";

interface OrdersTableProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OrderTable({ isExpanded, onToggle }: OrdersTableProps) {

  return (
    <div className="border-t border-[#E5E5E5] bg-white">
      <button
        onClick={onToggle}
        className="w-full px-8 py-5 text-left text-sm font-medium text-black hover:bg-gray-50 transition-colors flex justify-between items-center"
      >
        <span>View Live Orders</span>
        <FaChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && <OrdersContent />}
    </div>
  );
}
