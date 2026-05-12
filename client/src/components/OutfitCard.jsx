import { Bookmark, Share2, Star } from 'lucide-react';

export default function OutfitCard({ items, onSave, saved, name, occasion }) {
  const displayItems = items.slice(0, 4);
  const extra = items.length - 4;

  return (
    <div className="card overflow-hidden group animate-slide-up">
      <div className="grid grid-cols-2 gap-0.5 bg-beige-100">
        {displayItems.map((item, i) => (
          <div key={item._id || i} className="aspect-square bg-beige-50 relative overflow-hidden">
            <img
              src={item.thumbnailUrl || item.photoUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
        {extra > 0 && (
          <div className="aspect-square bg-beige-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">+{extra}</span>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <div>
          {name && <p className="text-sm font-medium text-gray-900">{name}</p>}
          {occasion && (
            <p className="text-xs text-gray-500 capitalize mt-0.5">{occasion}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{items.length} cope</p>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              saved ? 'bg-gray-900 text-white' : 'bg-beige-100 text-gray-600 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <Bookmark size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
