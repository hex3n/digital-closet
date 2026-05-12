import { Trash2, Edit2, CheckCircle } from 'lucide-react';

const CATEGORY_LABELS = {
  bluze: 'Bluzë', pantallona: 'Pantallona', xhup: 'Xhup',
  kemishe: 'Këmishë', fustan: 'Fustan', kepuce: 'Këpucë',
  aksesore: 'Aksesorë', tjeter: 'Tjetër',
};

const OCCASION_COLORS = {
  casual: 'bg-blue-50 text-blue-700',
  pune: 'bg-purple-50 text-purple-700',
  formal: 'bg-gray-100 text-gray-700',
  sport: 'bg-green-50 text-green-700',
  dalje: 'bg-pink-50 text-pink-700',
};

export default function ClothingCard({ item, onDelete, onEdit, selectable, selected, onSelect }) {
  return (
    <div
      className={`card overflow-hidden group transition-all duration-200 hover:shadow-md ${
        selectable ? 'cursor-pointer' : ''
      } ${selected ? 'ring-2 ring-gray-900' : ''}`}
      onClick={selectable ? onSelect : undefined}
    >
      <div className="relative aspect-square bg-beige-50">
        <img
          src={item.thumbnailUrl || item.photoUrl}
          alt={CATEGORY_LABELS[item.category]}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {selected && (
          <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
            <CheckCircle size={32} className="text-white" />
          </div>
        )}
        {!selectable && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-beige-100"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
        {item.colors?.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {item.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-900">{CATEGORY_LABELS[item.category]}</span>
          {item.occasion?.length > 0 && (
            <span className={`badge ${OCCASION_COLORS[item.occasion[0]] || 'bg-beige-100 text-gray-700'}`}>
              {item.occasion[0]}
            </span>
          )}
        </div>
        {item.brand && <p className="text-xs text-gray-500 mt-0.5 truncate">{item.brand}</p>}
        {item.usageCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">Veshur {item.usageCount}×</p>
        )}
      </div>
    </div>
  );
}
