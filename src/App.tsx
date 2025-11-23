import { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import FileUpload from './components/FileUpload';
import StudyGuideDisplay from './components/StudyGuideDisplay';
import JsonPreview from './components/JsonPreview';
import { StudyGuide } from './types/studyGuide';
import { generateStudyGuide } from './services/geminiService';

type InputMode = 'text' | 'file';

function App() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved) {
        try {
          const isDark = JSON.parse(saved);
          // Apply class immediately
          const html = document.documentElement;
          if (isDark) {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
          return isDark;
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  });

  useEffect(() => {
    // This effect ensures the class is applied on mount and state changes
    // But the toggle function handles immediate updates
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      
      // Immediately update the DOM
      const html = document.documentElement;
      if (newValue) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      // Save to localStorage
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      
      return newValue;
    });
  };

  const handleTextSubmit = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setInputText(text);

    try {
      const result = await generateStudyGuide(text);
      setStudyGuide(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while generating the study guide.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setInputText(`Processing file: ${file.name}`);

    try {
      // For now, we'll read text files directly
      // For PDFs and images, you would need additional processing
      if (file.type === 'text/plain') {
        const text = await file.text();
        const result = await generateStudyGuide(text);
        setStudyGuide(result);
      } else {
        // For PDFs and images, you would need to extract text first
        // This is a placeholder - in production, you'd use a library like pdf.js or OCR
        throw new Error(
          'File type not yet supported. Please use text input or upload a .txt file. PDF and image processing coming soon!'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while processing the file.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStudyGuide(null);
    setError(null);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="glass-effect dark:bg-gray-900/95 dark:border-gray-700 shadow-lg border-b border-indigo-100/50 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold gradient-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:to-purple-400 mb-3">
                Academic Study Guide Generator
              </h1>
              <p className="text-lg text-indigo-700/80 dark:text-indigo-300/80 font-medium">
                Transform your documents into clean study tools, reminders, and tutoring-style guides
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              onMouseDown={(e) => e.preventDefault()}
              className="ml-4 p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Toggle dark mode"
              type="button"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!studyGuide ? (
          <>
            {/* Input Mode Tabs */}
            <div className="mb-10">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-indigo-100/50 dark:border-gray-700 inline-flex">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => {
                      setInputMode('text');
                      handleReset();
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      inputMode === 'text'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-lg shadow-indigo-500/50'
                        : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Text Input
                  </button>
                  <button
                    onClick={() => {
                      setInputMode('file');
                      handleReset();
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      inputMode === 'file'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-lg shadow-indigo-500/50'
                        : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    File Upload
                  </button>
                </nav>
              </div>
            </div>

            {/* Input Component */}
            {inputMode === 'text' ? (
              <TextInput onSubmit={handleTextSubmit} isLoading={isLoading} />
            ) : (
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-12 text-center">
                <div className="inline-block relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="mt-6 text-lg font-semibold text-indigo-700 dark:text-indigo-300">Processing your content...</p>
                <p className="mt-2 text-sm text-indigo-500 dark:text-indigo-400">This may take a few moments</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-red-600 dark:text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">Error</h3>
                    <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Results */}
            <div className="mb-8">
              <button
                onClick={handleReset}
                className="group inline-flex items-center space-x-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold rounded-xl shadow-md hover:shadow-lg border border-indigo-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Create New Study Guide</span>
              </button>
            </div>

            <div className="space-y-8">
              <StudyGuideDisplay studyGuide={studyGuide} />
              <JsonPreview studyGuide={studyGuide} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 glass-effect dark:bg-gray-900/95 dark:border-gray-800 border-t border-indigo-100/50 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm font-medium text-indigo-700/70 dark:text-indigo-300/70">
            Making academic life smoother through simplified study tools, reminders, and tutoring-style explanations.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

