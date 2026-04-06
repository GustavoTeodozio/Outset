import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from '../../components/KanbanCard';
import { TaskModal } from '../../components/TaskModal';

const ColumnIcon = ({ type }: { type: TaskStatus }) => {
  const iconClass = "w-5 h-5 text-white";

  switch (type) {
    case 'BACKLOG':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'IN_PRODUCTION':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'FOR_APPROVAL':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case 'SCHEDULED':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'PUBLISHED':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const columns: { id: TaskStatus; title: string; color: string; gradient: string }[] = [
  {
    id: 'BACKLOG',
    title: 'Backlog',
    color: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300',
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'IN_PRODUCTION',
    title: 'Em Produção',
    color: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'FOR_APPROVAL',
    title: 'Para Aprovação',
    color: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'SCHEDULED',
    title: 'Agendado',
    color: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'PUBLISHED',
    title: 'Publicado',
    color: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300',
    gradient: 'from-green-500 to-emerald-500'
  },
];

// Ghost element shown while dragging on touch devices
let touchGhost: HTMLElement | null = null;

export function KanbanBoard() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState<TaskStatus | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const touchDragTask = useRef<Task | null>(null);
  const columnRefs = useRef<Partial<Record<TaskStatus, HTMLDivElement>>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/admin/tasks?perPage=100');
      return response.data;
    },
  });

  const updatePositionsMutation = useMutation({
    mutationFn: async (updates: { id: string; position: number; status: TaskStatus }[]) => {
      await api.post('/admin/tasks/positions', { updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const groupedTasks = useCallback((): Record<TaskStatus, Task[]> => {
    if (!data?.items) {
      return {
        BACKLOG: [],
        IN_PRODUCTION: [],
        FOR_APPROVAL: [],
        SCHEDULED: [],
        PUBLISHED: [],
      };
    }

    const grouped: Record<TaskStatus, Task[]> = {
      BACKLOG: [],
      IN_PRODUCTION: [],
      FOR_APPROVAL: [],
      SCHEDULED: [],
      PUBLISHED: [],
    };

    data.items.forEach((task: Task) => {
      grouped[task.status].push(task);
    });

    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a: Task, b: Task) => a.position - b.position);
    });

    return grouped;
  }, [data]);

  // ─── Mouse drag handlers ───────────────────────────────────────────────────

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, column: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const moveTask = useCallback((task: Task, targetStatus: TaskStatus) => {
    const allTasks = groupedTasks();
    const sourceColumn = allTasks[task.status];
    const destColumn = allTasks[targetStatus];

    if (task.status === targetStatus) {
      const updates = sourceColumn.map((t, index) => ({
        id: t.id,
        position: index,
        status: t.status,
      }));
      updatePositionsMutation.mutate(updates);
    } else {
      const newSourceColumn = sourceColumn.filter((t: Task) => t.id !== task.id);
      const newDestColumn = [...destColumn, task];

      const sourceUpdates = newSourceColumn.map((t: Task, index: number) => ({
        id: t.id,
        position: index,
        status: t.status,
      }));

      const destUpdates = newDestColumn.map((t: Task, index: number) => ({
        id: t.id,
        position: index,
        status: targetStatus,
      }));

      updatePositionsMutation.mutate([...sourceUpdates, ...destUpdates]);
    }
  }, [groupedTasks, updatePositionsMutation]);

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedTask) return;
    moveTask(draggedTask, targetStatus);
    setDraggedTask(null);
  };

  // ─── Touch drag handlers ───────────────────────────────────────────────────

  const getColumnAtPoint = (x: number, y: number): TaskStatus | null => {
    for (const [status, el] of Object.entries(columnRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return status as TaskStatus;
      }
    }
    return null;
  };

  const handleTouchStart = (e: React.TouchEvent, task: Task) => {
    // Only start if single finger
    if (e.touches.length !== 1) return;
    touchDragTask.current = task;
    setDraggedTask(task);

    // Create ghost element
    const touch = e.touches[0];
    const sourceEl = e.currentTarget as HTMLElement;
    const clone = sourceEl.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = `${touch.clientX - sourceEl.offsetWidth / 2}px`;
    clone.style.top = `${touch.clientY - 30}px`;
    clone.style.width = `${sourceEl.offsetWidth}px`;
    clone.style.opacity = '0.85';
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '9999';
    clone.style.transform = 'rotate(2deg) scale(1.03)';
    clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    clone.style.borderRadius = '12px';
    document.body.appendChild(clone);
    touchGhost = clone;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragTask.current) return;
    e.preventDefault(); // prevent page scroll while dragging

    const touch = e.touches[0];

    // Move ghost
    if (touchGhost) {
      touchGhost.style.left = `${touch.clientX - (touchGhost.offsetWidth / 2)}px`;
      touchGhost.style.top = `${touch.clientY - 30}px`;
    }

    // Highlight column under finger
    const col = getColumnAtPoint(touch.clientX, touch.clientY);
    setDragOverColumn(col);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Remove ghost
    if (touchGhost) {
      document.body.removeChild(touchGhost);
      touchGhost = null;
    }

    const task = touchDragTask.current;
    touchDragTask.current = null;
    setDraggedTask(null);
    setDragOverColumn(null);

    if (!task) return;

    const touch = e.changedTouches[0];
    const targetCol = getColumnAtPoint(touch.clientX, touch.clientY);
    if (targetCol) {
      moveTask(task, targetCol);
    }
  };

  const grouped = groupedTasks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-outer-sans">Carregando Kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 md:mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500 flex items-center justify-center shadow-lg md:shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-orange-400/20 rounded-xl md:rounded-2xl blur-sm"></div>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent font-outer-sans tracking-tight">
                Kanban Outset
              </h1>
            </div>
            <p className="text-gray-600 font-outer-sans text-sm sm:text-base md:text-lg ml-0 sm:ml-1 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="hidden sm:inline">Organize seu fluxo de trabalho de forma visual e intuitiva</span>
              <span className="sm:hidden">Organize seu fluxo de trabalho</span>
            </p>
          </div>
          <button
            onClick={() => setShowNewTaskModal('BACKLOG')}
            className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl font-semibold font-outer-sans shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {columns.map((col) => (
            <div key={col.id} className={`p-2 sm:p-3 md:p-4 rounded-xl ${col.color} border-2 transition-all duration-300 hover:shadow-md`}>
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-gradient-to-br ${col.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <ColumnIcon type={col.id} />
                </div>
                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-700">
                  {grouped[col.id]?.length || 0}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 font-outer-sans truncate">{col.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-6 -mx-3 px-3 sm:-mx-6 sm:px-6 snap-x snap-mandatory">
        {columns.map((column) => (
          <div
            key={column.id}
            ref={(el) => { if (el) columnRefs.current[column.id] = el; }}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`snap-start shrink-0 w-[260px] sm:w-[280px] lg:shrink lg:flex-1 lg:w-auto lg:min-w-0 rounded-2xl border-2 p-3 sm:p-4 min-h-[200px] md:min-h-[400px] transition-all duration-300 backdrop-blur-sm ${
              column.color
            } ${dragOverColumn === column.id ? 'shadow-2xl scale-[1.01] ring-4 ring-purple-400 ring-opacity-50' : 'shadow-sm hover:shadow-md'}`}
          >
            {/* Column Header */}
            <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${column.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <ColumnIcon type={column.id} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 font-outer-sans text-xs sm:text-sm md:text-base truncate">
                    {column.title}
                  </h3>
                  <span className="text-xs text-gray-500 font-outer-sans">
                    {grouped[column.id]?.length || 0} {grouped[column.id]?.length === 1 ? 'tarefa' : 'tarefas'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNewTaskModal(column.id)}
                className={`w-full py-1.5 sm:py-2 rounded-lg bg-white hover:bg-gradient-to-r ${column.gradient} border-2 border-dashed border-gray-300 hover:border-transparent flex items-center justify-center gap-1.5 sm:gap-2 text-gray-600 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-300 group font-outer-sans`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Adicionar Tarefa</span>
                <span className="sm:hidden">+ Add</span>
              </button>
            </div>

            {/* Column Content */}
            <div className="space-y-2 sm:space-y-3">
              {grouped[column.id]?.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onTouchStart={(e) => handleTouchStart(e, task)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setSelectedTask(task)}
                  className={`cursor-move touch-none select-none ${draggedTask?.id === task.id ? 'opacity-40' : ''}`}
                >
                  <TaskCard
                    task={task}
                    isDragging={draggedTask?.id === task.id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {(selectedTask || showNewTaskModal) && (
        <TaskModal
          task={selectedTask}
          initialStatus={showNewTaskModal}
          onClose={() => {
            setSelectedTask(null);
            setShowNewTaskModal(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setSelectedTask(null);
            setShowNewTaskModal(null);
          }}
        />
      )}
    </div>
  );
}
