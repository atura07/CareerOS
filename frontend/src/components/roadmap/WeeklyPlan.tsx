import { motion } from 'framer-motion'
import { CalendarDays, Code2, FolderGit2, FileText } from 'lucide-react'
import type { WeekPlan } from '../../data/roadmap'

function TaskList({
  title,
  icon,
  tasks,
}: {
  title: string
  icon: React.ReactNode
  tasks: string[]
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-white/40">
        {icon}
        {title}
      </p>
      <ul className="space-y-1">
        {tasks.map((task) => (
          <li key={task} className="flex items-start gap-1.5 text-sm text-white/70">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function WeeklyPlan({ plan }: { plan: WeekPlan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-colors duration-300 hover:border-white/[0.12]"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/14 ring-1 ring-blue-500/20">
          <CalendarDays className="h-4 w-4 text-blue-400" />
        </div>
        <h4 className="text-sm font-semibold text-white/90">Week {plan.weekNumber}</h4>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TaskList
          title="DSA Tasks"
          icon={<Code2 className="h-3 w-3" />}
          tasks={plan.dsaTasks}
        />
        <TaskList
          title="Development Tasks"
          icon={<Code2 className="h-3 w-3" />}
          tasks={plan.developmentTasks}
        />
        <TaskList
          title="Projects"
          icon={<FolderGit2 className="h-3 w-3" />}
          tasks={plan.projects}
        />
        <TaskList
          title="Resume Tasks"
          icon={<FileText className="h-3 w-3" />}
          tasks={plan.resumeTasks}
        />
      </div>
    </motion.div>
  )
}
