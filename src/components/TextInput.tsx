import { useState } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function TextInput({ onSubmit, isLoading }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="text-input" 
            className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3"
          >
            Enter your study material
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your notes, textbook content, or any academic material here..."
            className="w-full h-64 px-6 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-indigo-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 resize-none shadow-lg transition-all duration-200 text-gray-700 dark:text-gray-200 placeholder:text-indigo-300 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/50 dark:shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/60 dark:hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Generate Study Guide'
          )}
        </button>
      </form>
    </div>
  );
}

