interface InfographicDisplayProps {
  imageUrl: string;
}

export default function InfographicDisplay({ imageUrl }: InfographicDisplayProps) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Generated Infographic
        </h2>

        <div className="rounded-xl overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt="Generated infographic"
            className="w-full h-auto"
          />
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={imageUrl}
            download="infographic.png"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700"
          >
            Download Infographic
          </a>
        </div>
      </div>
    </div>
  );
}
