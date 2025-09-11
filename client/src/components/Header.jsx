import TagIcon from "../assets/icons/tags.png";

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 h-12 flex items-center">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img src={TagIcon} alt="Tag Icon" className="w-5 h-5" />
          </div>
        </div>
        <div className="text-sm text-gray-400">Prebuilt analyze</div>
      </div>
    </header>
  );
}
