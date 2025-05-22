// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-emerald-500 animate-spin"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-r-4 border-l-4 border-transparent border-r-emerald-300 border-l-emerald-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
  </div>
);

export default LoadingSpinner