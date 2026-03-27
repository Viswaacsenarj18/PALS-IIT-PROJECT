const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-medium">
            Connecting to ThingSpeak...
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Fetching latest sensor data
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
