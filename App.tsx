
import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, Download, User, Briefcase, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { generateProfessionalPortrait } from './services/geminiService';
import { DEFAULT_PROFESSIONAL_PROMPT } from './constants';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROFESSIONAL_PROMPT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateProfessionalPortrait(originalImage, prompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate professional portrait.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'professional-headshot.png';
    link.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setPrompt(DEFAULT_PROFESSIONAL_PROMPT);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ProProfile AI
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500" /> LinkedIn Ready</span>
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-blue-500" /> Corporate Style</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Face Preserving</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {!originalImage ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Create your perfect professional portrait
            </h2>
            <p className="text-gray-500 max-w-md mb-10 text-lg">
              Upload a clear casual photo. Our AI will transform it into a high-quality studio headshot while preserving your unique facial features.
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Upload Your Photo
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Image Previews */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Source Image</h3>
                  <button 
                    onClick={reset}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Change Photo
                  </button>
                </div>
                <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative group">
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              </div>

              {generatedImage && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm ring-2 ring-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Professional Portrait
                    </h3>
                    <button 
                      onClick={downloadImage}
                      className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                  <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                    />
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-spin" />
                    <h3 className="font-semibold text-gray-400">Generating Masterpiece...</h3>
                  </div>
                  <div className="aspect-[4/5] bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-4 text-center px-8">
                     <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-amber-500 animate-bounce" />
                     </div>
                     <p className="text-gray-500 text-sm font-medium">
                        Crafting your professional look, enhancing lighting, and preserving your features...
                     </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Controls */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" /> Refine Generation
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Style Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={8}
                      className="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Describe the professional look you want..."
                    />
                    <p className="mt-2 text-xs text-gray-400 italic">
                      The current prompt is optimized to maintain facial integrity while adding professional attire.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold">Generation Failed</p>
                        <p className="text-xs">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                      isGenerating 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200 hover:-translate-y-1'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        {generatedImage ? 'Regenerate Portrait' : 'Generate Portrait'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" /> Pro Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use a clear, well-lit photo for best facial feature retention.</li>
                  <li>• Front-facing photos work better than side profiles.</li>
                  <li>• Gemini will automatically handle background removal and studio lighting.</li>
                  <li>• You can modify the prompt to change blazer color (e.g., "charcoal grey", "black").</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by Google Gemini 2.5 Flash Image. All processing is private and temporary.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
