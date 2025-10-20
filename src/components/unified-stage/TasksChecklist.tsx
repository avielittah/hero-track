import { CheckCircle2 } from 'lucide-react';

interface TaskItem {
  type: 'text' | 'numbered-list' | 'bullet-list';
  content: string | string[];
}

interface TasksChecklistProps {
  tasks: TaskItem[];
  completedTasks: Record<number, boolean>;
  onTaskToggle: (taskIndex: number, itemIndex: number) => void;
}

export function TasksChecklist({ tasks, completedTasks, onTaskToggle }: TasksChecklistProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task, taskIndex) => (
        <div key={taskIndex}>
          {task.type === 'text' && (
            <p className="text-sm">{task.content as string}</p>
          )}
          {(task.type === 'numbered-list' || task.type === 'bullet-list') && (
            <div className="space-y-2">
              {(task.content as string[]).map((item, itemIndex) => {
                const key = taskIndex * 1000 + itemIndex;
                const isCompleted = completedTasks[key] || false;
                return (
                  <div key={itemIndex} className="flex items-start gap-3 group">
                    <button
                      onClick={() => onTaskToggle(taskIndex, itemIndex)}
                      className={`
                        mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
                        ${isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                        }
                        hover:scale-110
                      `}
                    >
                      {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                    <span className={`text-sm leading-relaxed ${isCompleted ? 'line-through opacity-60' : ''}`}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
