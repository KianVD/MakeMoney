import { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Academic Study Guide Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Transform your documents into clean study tools, reminders, and tutoring-style guides
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!studyGuide ? (
          <>
            {/* Input Mode Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => {
                      setInputMode('text');
                      handleReset();
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      inputMode === 'text'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Text Input
                  </button>
                  <button
                    onClick={() => {
                      setInputMode('file');
                      handleReset();
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      inputMode === 'file'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <div className="mt-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Processing your content...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
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
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Results */}
            <div className="mb-6">
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
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
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Making academic life smoother through simplified study tools, reminders, and tutoring-style explanations.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

