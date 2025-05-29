const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      {/* Main Animation Container */}
      <div className="relative w-24 h-24 mb-6">
        {/* Circular Path */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin"></div>
        
        {/* Delivery Person with Box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative animate-bounce">
            {/* Person Body */}
            <div className="w-6 h-8 relative">
              {/* Head */}
              <div className="w-3 h-3 bg-orange-400 rounded-full mx-auto mb-1"></div>
              
              {/* Body */}
              <div className="w-4 h-4 bg-blue-500 rounded-sm mx-auto relative">
                {/* Arms */}
                <div className="absolute -left-1 top-1 w-2 h-1 bg-orange-300 rounded-full transform -rotate-45"></div>
                <div className="absolute -right-1 top-1 w-2 h-1 bg-orange-300 rounded-full transform rotate-45"></div>
              </div>
              
              {/* Legs */}
              <div className="flex justify-center space-x-1 mt-1">
                <div className="w-1 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            {/* Delivery Box */}
            <div className="absolute -top-1 -right-2 w-3 h-3 bg-emerald-500 border border-emerald-600 rounded-sm">
              <div className="absolute top-0.5 left-0.5 w-2 h-0.5 bg-emerald-300 rounded-full"></div>
              <div className="absolute top-1.5 left-0.5 w-1 h-0.5 bg-emerald-300 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Moving Dots on Path */}
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping transform -translate-x-1/2" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-0 top-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping transform -translate-y-1/2" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute right-0 top-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping transform -translate-y-1/2" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Bike Delivery Animation Alternative
const BikeLoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      {/* Bike Animation Container */}
      <div className="relative w-28 h-20 mb-6">
        {/* Road Line */}
        <div className="absolute bottom-2 left-0 w-full h-0.5 bg-gray-300 overflow-hidden">
          <div className="w-4 h-full bg-emerald-500 animate-pulse absolute left-0 transform translate-x-full"></div>
        </div>
        
        {/* Bike with Rider */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          {/* Rider */}
          <div className="relative">
            {/* Head */}
            <div className="w-3 h-3 bg-orange-400 rounded-full absolute -top-2 left-2"></div>
            
            {/* Body */}
            <div className="w-4 h-3 bg-blue-500 rounded-sm relative">
              {/* Arms to handlebar */}
              <div className="absolute -left-1 top-0 w-2 h-1 bg-orange-300 rounded-full"></div>
            </div>
            
            {/* Bike Frame */}
            <div className="w-8 h-4 relative mt-1">
              {/* Frame lines */}
              <div className="absolute top-1 left-1 w-6 h-0.5 bg-gray-600 transform rotate-12"></div>
              <div className="absolute top-0 left-2 w-4 h-0.5 bg-gray-600 transform -rotate-12"></div>
              
              {/* Wheels */}
              <div className="absolute bottom-0 left-0 w-3 h-3 border-2 border-gray-700 rounded-full animate-spin">
                <div className="absolute inset-1 border border-gray-500 rounded-full"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-gray-700 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}>
                <div className="absolute inset-1 border border-gray-500 rounded-full"></div>
              </div>
              
              {/* Delivery Box on Back */}
              <div className="absolute -top-1 right-1 w-3 h-2 bg-emerald-500 border border-emerald-600 rounded-sm">
                <div className="absolute top-0 left-0.5 w-2 h-0.5 bg-emerald-300"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Speed Lines */}
        <div className="absolute left-2 top-8 space-y-1 opacity-60">
          <div className="w-4 h-0.5 bg-gray-400 animate-pulse"></div>
          <div className="w-3 h-0.5 bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-5 h-0.5 bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Walking Person Animation
const WalkingLoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      <div className="relative w-32 h-16 mb-6 overflow-hidden">
        {/* Ground/Path */}
        <div className="absolute bottom-2 w-full h-0.5 bg-gray-300">
          <div className="w-8 h-full bg-emerald-500 animate-pulse absolute"></div>
        </div>
        
        {/* Walking Person */}
        <div className="absolute bottom-4 animate-bounce" style={{ animation: 'walk 2s linear infinite' }}>
          {/* Person */}
          <div className="relative">
            {/* Head */}
            <div className="w-3 h-3 bg-orange-400 rounded-full mx-auto mb-1"></div>
            
            {/* Body */}
            <div className="w-4 h-5 bg-blue-500 rounded-t-lg mx-auto relative">
              {/* Walking Arms */}
              <div className="absolute -left-1 top-1 w-1 h-3 bg-orange-300 rounded-full animate-pulse transform origin-top"></div>
              <div className="absolute -right-1 top-1 w-1 h-3 bg-orange-300 rounded-full animate-pulse transform origin-top" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Walking Legs */}
            <div className="flex justify-center space-x-1">
              <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse transform origin-top"></div>
              <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse transform origin-top" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Delivery Box */}
            <div className="absolute top-0 -right-3 w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-md">
              <div className="absolute top-1 left-1 w-2 h-0.5 bg-emerald-300"></div>
              <div className="absolute top-2 left-1 w-1 h-0.5 bg-emerald-300"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes walk {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(120px); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
export { BikeLoadingSpinner, WalkingLoadingSpinner };