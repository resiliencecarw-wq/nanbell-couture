const ORDER_STEPS = [
  "Not Started",
  "In Progress",
  "Almost Done",
  "Ready for Pickup",
  "Transaction Completed"
];

const statusIndex = (status, transactionCompleted) => {
  if (transactionCompleted) return 4;
  const idx = ORDER_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
};

const OrderTimeline = ({ status, transactionCompleted = false }) => {
  const activeIndex = statusIndex(status, transactionCompleted);

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
        {ORDER_STEPS.map((step, idx) => (
          <span key={step} className={`${idx <= activeIndex ? "text-[#b8322f]" : ""}`}>
            {step}
          </span>
        ))}
      </div>
      <div className="relative h-2 rounded-full bg-[#f1dfd2]">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[#b8322f] to-[#0f8b6e]"
          style={{ width: `${((activeIndex + 1) / ORDER_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default OrderTimeline;

