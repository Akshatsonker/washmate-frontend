'use client';

const statusSteps = [
  { status: 'placed',     label: 'Order Placed', icon: '📦' },
  { status: 'accepted',   label: 'Accepted',     icon: '✅' },
  { status: 'processing', label: 'Processing',   icon: '⚙️' },
  { status: 'ready',      label: 'Ready',        icon: '🎉' },
  { status: 'delivered',  label: 'Delivered',    icon: '🏁' },
];

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
};

const formatTime = (dateStr: string | Date | undefined) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDeliveryDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString();
};

export function OrderTracker({ order }) {
  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order.status
  );

  const isRejected = order.status === 'rejected';

  const progressWidth =
    currentStepIndex >= 0
      ? (currentStepIndex / (statusSteps.length - 1)) * 100
      : 0;

  return (
    <div className="w-full">
      {isRejected ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-lg font-semibold text-red-900">Order Rejected</h3>
          <p className="text-red-700 mt-2">
            This order was rejected by the vendor. You can create a new order.
          </p>
        </div>
      ) : (
        <div>

          {/* ── Progress Tracker ── */}
          <div className="relative mb-8">

            {/* Background line — vertically centered on the circles */}
            {/* On mobile circles are 8 (2rem), on desktop 12 (3rem)     */}
            {/* Line sits at top-4 (mobile) / top-6 (desktop)            */}
            <div className="absolute top-4 md:top-6 left-0 right-0 h-0.5 bg-gray-200" />

            {/* Active progress line */}
            <div
              className="absolute top-4 md:top-6 left-0 h-0.5 bg-blue-500 transition-all duration-500"
              style={{ width: `${progressWidth}%` }}
            />

            {/* Steps */}
            <div className="flex justify-between relative z-10">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center"
                    // Each step takes equal width so the line aligns perfectly
                    style={{ width: `${100 / statusSteps.length}%` }}
                  >
                    {/* Circle — small on mobile, larger on desktop */}
                    <div
                      className={`
                        w-8 h-8 md:w-12 md:h-12
                        rounded-full flex items-center justify-center
                        text-sm md:text-xl
                        transition-all duration-300 shrink-0
                        ${isActive
                          ? 'bg-blue-500 text-white ring-2 md:ring-4 ring-blue-200'
                          : 'bg-gray-200 text-gray-400'}
                      `}
                    >
                      {step.icon}
                    </div>

                    {/* Label — hidden on very small screens, shown from xs up */}
                    <span
                      className={`
                        mt-1 md:mt-2
                        text-center leading-tight
                        text-[9px] sm:text-[10px] md:text-xs
                        font-medium
                        max-w-full px-0.5
                        ${isActive ? 'text-blue-600' : 'text-gray-400'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Status Card ── */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 md:p-6 border border-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-blue-900">
                  {statusSteps[currentStepIndex]?.label || order.status}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {getStatusMessage(order.status)}
                </p>
                {order.deliveryDate && (
                  <p className="text-xs text-blue-600 mt-2">
                    📅 Expected delivery:{' '}
                    {formatDeliveryDate(order.pickupDate)}
                  </p>
                )}
              </div>
              <div className="text-3xl md:text-4xl shrink-0">
                {statusSteps[currentStepIndex]?.icon || '❓'}
              </div>
            </div>
          </div>

          {/* ── Timeline Info ── */}
          <div className="mt-4 space-y-0 text-sm">

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500">Ordered</span>
              <span className="font-medium text-gray-900 text-right">
                {formatDate(order.createdAt)}{' '}
                <span className="text-gray-500 text-xs">
                  {formatTime(order.createdAt)}
                </span>
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500">Pickup Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(order.pickupDate)}
              </span>
            </div>

            {order.deliveryDate && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-500">Estimated Delivery</span>
                <span className="font-medium text-gray-900">
                  {formatDeliveryDate(order.pickupDate)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium text-gray-900">
                ₹{order.price.toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function getStatusMessage(status: string) {
  switch (status) {
    case 'placed':
      return 'Your order has been placed. Waiting for vendor confirmation.';
    case 'accepted':
      return 'Your order has been accepted! The vendor will pick up soon.';
    case 'processing':
      return 'Your laundry is being processed. We\'re taking great care of it!';
    case 'ready':
      return 'Your order is ready for delivery!';
    case 'delivered':
      return 'Your order has been delivered successfully. Thank you!';
    case 'rejected':
      return 'Your order was rejected. Please contact the vendor.';
    default:
      return 'Your order status is being updated.';
  }
}
