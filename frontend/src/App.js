import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setAnimating(false);
    }
  };

  const predictWaste = async () => {
    if (!image) return alert("Please upload an image first!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("https://waste-classification-t2h6.onrender.com/predict", formData, {  
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setAnimating(true);
      
      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      alert("Prediction failed!");
      setLoading(false);
    }
  };

  const getTargetBin = () => {
    if (!result) return null;
    return result.label.toLowerCase().includes('organic') ? 'organic' : 'recyclable';
  };

  const resetApp = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌍</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-gray-800 leading-tight">
            Caring For The Planet<br />We Call Home
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered waste classification to help you make better recycling decisions
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Upload Card */}
          <div className="md:col-span-1">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 h-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h3>
              <label className="block cursor-pointer group">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all duration-300 bg-white/30">
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  ) : (
                    <>
                      <div className="text-6xl mb-4">📁</div>
                      <p className="text-gray-700 font-medium mb-2">Choose an image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {preview && !result && (
                <button
                  onClick={predictWaste}
                  disabled={loading}
                  className="w-full mt-6 bg-gray-800 text-white font-medium px-6 py-4 rounded-2xl hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Classify Waste
                      <span>→</span>
                    </>
                  )}
                </button>
              )}

              {result && (
                <button
                  onClick={resetApp}
                  className="w-full mt-6 bg-white/60 text-gray-800 font-medium px-6 py-4 rounded-2xl hover:bg-white/80 transition-all duration-300"
                >
                  Upload New Image
                </button>
              )}
            </div>
          </div>

          {/* Waste Bins Display */}
          <div className="md:col-span-2">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Classification Result</h3>
                {result && (
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {!result && !loading && (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-50">🗑️</div>
                    <p className="text-lg">Upload an image to get started</p>
                  </div>
                </div>
              )}

              {/* Bins Container */}
              <div className="relative flex justify-center gap-12 min-h-[400px]">
                {/* Organic Bin */}
                <div className="relative">
                  <div className={`transition-all duration-500 ${
                    result && getTargetBin() === 'organic' ? 'scale-110' : 'opacity-70'
                  }`}>
                    <div className="w-40 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-6 shadow-2xl">
                      <div className="text-white text-center">
                        <div className="text-5xl mb-3">🌱</div>
                        <p className="font-semibold text-lg">Organic</p>
                      </div>
                    </div>
                  </div>
                  
                  {result && getTargetBin() === 'organic' && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-white text-xl">✓</span>
                    </div>
                  )}
                </div>

                {/* Floating Image Animation */}
                {preview && loading && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                    <div className="relative animate-pulse">
                      <img
                        src={preview}
                        alt="Analyzing"
                        className="w-32 h-32 object-cover rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>
                )}

                {preview && animating && (
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-1500 ${
                    getTargetBin() === 'organic' ? 'animate-fall-left' : 'animate-fall-right'
                  }`}>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                )}

                {/* Recyclable Bin */}
                <div className="relative">
                  <div className={`transition-all duration-500 ${
                    result && getTargetBin() === 'recyclable' ? 'scale-110' : 'opacity-70'
                  }`}>
                    <div className="w-40 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl p-6 shadow-2xl">
                      <div className="text-white text-center">
                        <div className="text-5xl mb-3">♻️</div>
                        <p className="font-semibold text-lg">Recyclable</p>
                      </div>
                    </div>
                  </div>

                  {result && getTargetBin() === 'recyclable' && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-white text-xl">✓</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        {result && (
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            {/* Classification Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-700 font-medium">Classification</h4>
                <span className="text-2xl"></span>
              </div>
              <p className={`text-3xl font-bold mb-2 ${
                getTargetBin() === 'organic' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {result.label}
              </p>
              <p className="text-sm text-gray-600">
                {getTargetBin() === 'organic' 
                  ? 'Compostable waste material' 
                  : 'Can be recycled and reused'}
              </p>
            </div>

            {/* Confidence Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-700 font-medium">Confidence</h4>
                <span className="text-2xl"></span>
              </div>
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={getTargetBin() === 'organic' ? '#10b981' : '#3b82f6'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * result.confidence} ${2 * Math.PI * 56}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {result.confidence >= 0.9 ? 'Very confident' : result.confidence >= 0.7 ? 'Confident' : 'Moderate confidence'}
              </p>
            </div>

            {/* Action Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-700 font-medium">Next Steps</h4>
                <span className="text-2xl">✨</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {getTargetBin() === 'organic' 
                      ? 'Place in compost or organic waste bin' 
                      : 'Clean and place in recycling bin'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {getTargetBin() === 'organic' 
                      ? 'Remove any plastic or non-organic materials' 
                      : 'Remove any food residue before recycling'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fall-left {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-250%, 100px) scale(0.5); opacity: 0; }
        }

        @keyframes fall-right {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(150%, 100px) scale(0.5); opacity: 0; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fall-left {
          animation: fall-left 1.5s ease-in forwards;
        }

        .animate-fall-right {
          animation: fall-right 1.5s ease-in forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;