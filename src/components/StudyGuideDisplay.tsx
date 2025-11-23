import { StudyGuide } from '../types/studyGuide';

interface StudyGuideDisplayProps {
  studyGuide: StudyGuide;
}

export default function StudyGuideDisplay({ studyGuide }: StudyGuideDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-indigo-100 dark:border-gray-700 p-8">
        <h1 className="text-4xl font-bold gradient-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:to-purple-400 mb-4">
          {studyGuide.title}
        </h1>
        <p className="text-lg text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed font-medium">
          {studyGuide.summary}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {studyGuide.sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-indigo-100 dark:border-gray-700 p-8 hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-6 flex items-center">
              <span className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 rounded-full mr-4"></span>
              {section.header}
            </h2>

            {/* Bullet Points */}
            {section.bullet_points.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Key Points
                </h3>
                <ul className="space-y-3 text-indigo-800 dark:text-indigo-200">
                  {section.bullet_points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <span className="h-2 w-2 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visual Suggestions */}
            {section.visual_suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visual Suggestions
                </h3>
                <ul className="space-y-2 text-indigo-700 dark:text-indigo-300">
                  {section.visual_suggestions.map((suggestion, sugIndex) => (
                    <li key={sugIndex} className="flex items-start italic">
                      <span className="text-purple-500 dark:text-purple-400 mr-3">✨</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reminder Tips */}
            {section.reminder_tips.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-xl p-5 shadow-md">
                <h3 className="text-base font-bold text-indigo-800 dark:text-indigo-200 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Reminder Tips
                </h3>
                <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                  {section.reminder_tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start font-medium">
                      <span className="text-indigo-600 dark:text-indigo-400 mr-2">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 text-center border border-indigo-200 dark:border-gray-700 shadow-md">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          <span className="text-indigo-400 dark:text-indigo-500">Style:</span> {studyGuide.infographic_style}
        </p>
      </div>
    </div>
  );
}

