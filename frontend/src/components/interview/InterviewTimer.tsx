import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer as TimerIcon } from 'lucide-react'

interface InterviewTimerProps {
  durationMinutes: number
  onResetSignal: number
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function InterviewTimer({ durationMinutes, onResetSignal }: InterviewTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60)
  }, [durationMinutes, onResetSignal])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  const total = durationMinutes * 60
  const ratio = total > 0 ? secondsLeft / total : 0
  const low = ratio <= 0.2

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${
            low
              ? 'bg-rose-500/14 text-rose-400 ring-rose-500/20'
              : 'bg-blue-500/14 text-blue-400 ring-blue-500/20'
          }`}
        >
          <TimerIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-white/40">Time Remaining</p>
          <p
            className={`font-mono text-2xl font-semibold tabular-nums ${
              low ? 'text-rose-400' : 'text-white/90'
            }`}
          >
            {formatTime(secondsLeft)}
          </p>
        </div>
      </div>
      <div className="hidden w-28 sm:block">
        <div className="mb-1 flex justify-between text-[10px] text-white/40">
          <span>{durationMinutes} min</span>
          <span>{Math.round(ratio * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className={`h-full rounded-full ${low ? 'bg-rose-500' : 'bg-blue-500'}`}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
