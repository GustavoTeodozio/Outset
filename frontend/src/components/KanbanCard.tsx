import type { Task } from '../types/task';

const priorityColors = {
  LOW: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300',
  MEDIUM: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300',
  HIGH: 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-orange-300',
  URGENT: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300 animate-pulse',
};

const PriorityIcon = ({ priority }: { priority: string }) => {
  const iconClass = "w-3.5 h-3.5";
  
  switch (priority) {
    case 'LOW':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 11h14v2H5z" />
        </svg>
      );
    case 'MEDIUM':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    case 'HIGH':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      );
    case 'URGENT':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    default:
      return null;
  }
};

const CategoryIcon = ({ category }: { category: string }) => {
  const iconClass = "w-5 h-5 text-white";
  
  switch (category) {
    case 'FACEBOOK_ADS':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'INSTAGRAM_ADS':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      );
    case 'GOOGLE_ADS':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'CONTENT':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'LANDING_PAGE':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'EMAIL_MARKETING':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'TRAFFIC':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'SEO':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'SOCIAL_MEDIA':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      );
    case 'COPYWRITING':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case 'DESIGN':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case 'VIDEO':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
};

const categoryColors: Record<string, string> = {
  FACEBOOK_ADS: 'from-blue-500 to-blue-600',
  INSTAGRAM_ADS: 'from-pink-500 to-purple-600',
  GOOGLE_ADS: 'from-red-500 to-yellow-500',
  CONTENT: 'from-green-500 to-emerald-600',
  LANDING_PAGE: 'from-indigo-500 to-purple-600',
  EMAIL_MARKETING: 'from-cyan-500 to-blue-600',
  TRAFFIC: 'from-orange-500 to-red-600',
  SEO: 'from-teal-500 to-green-600',
  SOCIAL_MEDIA: 'from-purple-500 to-pink-600',
  COPYWRITING: 'from-yellow-500 to-orange-600',
  DESIGN: 'from-pink-500 to-rose-600',
  VIDEO: 'from-red-500 to-pink-600',
  OTHER: 'from-gray-500 to-gray-600',
};

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const completedChecklist = task.checklists?.filter(item => item.isCompleted).length || 0;
  const totalChecklist = task.checklists?.length || 0;
  const checklistProgress = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0;

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-md border-2 border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 ${
        isDragging ? 'rotate-6 scale-110 shadow-2xl opacity-80 ring-4 ring-purple-400 ring-opacity-50' : ''
      }`}
    >
      {/* Priority & Category */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1.5 shadow-sm ${priorityColors[task.priority]}`}>
          <PriorityIcon priority={task.priority} />
          {task.priority === 'LOW' && 'Baixa'}
          {task.priority === 'MEDIUM' && 'Média'}
          {task.priority === 'HIGH' && 'Alta'}
          {task.priority === 'URGENT' && 'Urgente'}
        </span>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${categoryColors[task.category] || categoryColors.OTHER} flex items-center justify-center shadow-md`}>
          <CategoryIcon category={task.category} />
        </div>
      </div>

      {/* Title */}
      <h4 className="font-bold text-gray-800 text-sm mb-2 font-outer-sans line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 font-outer-sans">
          {task.description}
        </p>
      )}

      {/* Checklist Progress */}
      {totalChecklist > 0 && (
        <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-700 font-semibold font-outer-sans flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {completedChecklist}/{totalChecklist} tarefas
            </span>
            <span className="text-xs font-bold text-purple-600 bg-white px-2 py-0.5 rounded-full">
              {Math.round(checklistProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${checklistProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.split(',').slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs font-outer-sans">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
        {/* Assignee */}
        {(task.assigneeName || task.assignee) ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg border border-purple-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
              {(task.assigneeName || task.assignee?.name || '?').charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-gray-700 font-outer-sans truncate max-w-[80px]">
              {(task.assigneeName || task.assignee?.name || '').split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-outer-sans italic">👤 Sem responsável</div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-2">
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {task.comments.length}
            </span>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg border border-green-200 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {task.attachments.length}
            </span>
          )}
        </div>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="mt-3 pt-3 border-t-2 border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-amber-700 font-outer-sans">
              {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>
      )}

      {/* Metrics Preview */}
      {task.metrics && task.metrics.spent && (
        <div className="mt-3 pt-3 border-t-2 border-gray-100">
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span className="text-xs font-semibold text-green-700 font-outer-sans flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Investido
            </span>
            <span className="font-bold text-green-600 text-sm">
              R$ {task.metrics.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

