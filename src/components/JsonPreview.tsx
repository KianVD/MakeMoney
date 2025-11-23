import { useState } from 'react';
import { StudyGuide } from '../types/studyGuide';

interface JsonPreviewProps {
  studyGuide: StudyGuide;
}

export default function JsonPreview({ studyGuide }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(studyGuide, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-indigo-100 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:to-purple-400">
            Daisy-Ready JSON Output
          </h2>
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all duration-200 transform ${
              copied
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white shadow-lg scale-105'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
            }`}
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 overflow-x-auto shadow-inner border-2 border-gray-700">
          <pre className="text-sm text-gray-100 font-mono leading-relaxed">
            <code>{jsonString}</code>
          </pre>
        </div>
        
        <p className="mt-6 text-sm font-medium text-indigo-700 dark:text-indigo-300 text-center">
          This JSON is ready to be consumed by the Daisy API at{' '}
          <a
            href="https://app.daisy.so/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold underline decoration-2 underline-offset-2"
          >
            app.daisy.so
          </a>
        </p>
      </div>
    </div>
  );
}

