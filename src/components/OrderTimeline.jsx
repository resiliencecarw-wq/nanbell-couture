const ORDER_STEPS = [
  "Pending Confirmation",
  "Not Started",
  "In Progress",
  "Almost Done",
  "Ready for Pickup",
  "Transaction Completed"
];

const statusIndex = (status, transactionCompleted) => {
  if (transactionCompleted) return 5;
  const idx = ORDER_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
};

const getStatusColor = (status, transactionCompleted) => {
  if (status === "Cancelled") return "rose";
  if (transactionCompleted) return "green";
  
  switch (status) {
    case "Pending Confirmation": return "amber";
    case "Not Started": return "slate";
    case "In Progress": return "blue";
    case "Almost Done": return "purple";
    case "Ready for Pickup": return "emerald";
    default: return "slate";
  }
};

const OrderTimeline = ({ status, transactionCompleted = false }) => {
  if (status === "Cancelled") {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M15 9l-6 6M9 9l6 6"/>
        </svg>
        Order Cancelled
      </div>
    );
  }

  const activeIndex = statusIndex(status, transactionCompleted);
  const color = getStatusColor(status, transactionCompleted);
  
  const colorClasses = {
    amber: "from-amber-400 to-amber-500",
    slate: "from-slate-400 to-slate-500",
    blue: "from-blue-400 to-blue-500",
    purple: "from-purple-400 to-purple-500",
    emerald: "from-emerald-400 to-emerald-500",
    green: "from-green-400 to-green-500"
  };

  return (
    <div className="mt-4">
      {/* Progress Bar */}
      <div className="relative mb-3">
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
            style={{ width: `${((activeIndex + 1) / ORDER_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Step Labels - Simplified */}
      <div className="flex items-center justify-between text-[10px] font-medium">
        {ORDER_STEPS.map((step, idx) => {
          const isActive = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          
          return (
            <div 
              key={step} 
              className={`flex flex-col items-center ${isActive ? "text-slate-800" : "text-slate-400"}`}
            >
              <div className={`h-2 w-2 rounded-full mb-1 ${isActive ? (isCurrent ? `bg-gradient-to-r ${colorClasses[color]}` : "bg-slate-400") : "bg-slate-200"}`} />
              <span className={`hidden sm:block ${isCurrent ? "font-semibold" : ""}`}>
                {step.length > 12 ? step.substring(0, 12) + "..." : step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;

