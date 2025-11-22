import { StudyGuide } from '../types/studyGuide';

interface StudyGuideDisplayProps {
  studyGuide: StudyGuide;
}

export default function StudyGuideDisplay({ studyGuide }: StudyGuideDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {studyGuide.title}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {studyGuide.summary}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {studyGuide.sections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {section.header}
            </h2>

            {/* Bullet Points */}
            {section.bullet_points.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Key Points:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {section.bullet_points.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visual Suggestions */}
            {section.visual_suggestions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Visual Suggestions:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {section.visual_suggestions.map((suggestion, sugIndex) => (
                    <li key={sugIndex} className="italic">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reminder Tips */}
            {section.reminder_tips.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Reminder Tips:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  {section.reminder_tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
        <p>Style: {studyGuide.infographic_style}</p>
      </div>
    </div>
  );
}

