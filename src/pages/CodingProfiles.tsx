import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import LeetCodeLogoSvg from '../assets/tech/leetcode.svg'

const GITHUB_USERNAME = "Albiin777"
const LEETCODE_USERNAME = "albiin777"

// Caching & Types Setup
const CACHE_KEY = 'portfolio_coding_profiles_cache_v3'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface GitHubData {
  repos: number
  contributions: number
  stars: number
  prs: number
  languages: Array<{ name: string; percentage: number; color: string }>
  calendar: Array<Array<{ date: string; contributionCount: number; contributionLevel: string }>>
}

interface LeetCodeData {
  solved: number
  easy: number
  medium: number
  hard: number
  ranking: number
  acceptanceRate: number
  contestRating: number | null
  submissionCalendar: Record<string, number>
}

type ContributionDay = { date: string; contributionCount: number; contributionLevel: string }
type SubmissionSummary = { difficulty: string; count: number; submissions: number }

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  C: '#555555',
  Java: '#b07219',
  HTML: '#e34f26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  'C++': '#f34b7d',
  Go: '#00add8',
  Rust: '#dea584'
}

const generateFallbackCalendar = () => {
  const calendar: Array<Array<{ date: string; contributionCount: number; contributionLevel: string }>> = []
  const today = new Date()
  const startDay = new Date(today.getTime() - 23 * 7 * 24 * 60 * 60 * 1000)
  const startDayOfWeek = startDay.getDay()
  startDay.setDate(startDay.getDate() - startDayOfWeek)

  for (let w = 0; w < 24; w++) {
    const week: Array<{ date: string; contributionCount: number; contributionLevel: string }> = []
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDay.getTime() + (w * 7 + d) * 24 * 60 * 60 * 1000)
      const dateStr = currentDate.toISOString().split('T')[0]
      
      const hash = Math.abs(Math.sin((d + 1) * 31.4 + (w + 1) * 87.2))
      const isWeekend = d === 0 || d === 6
      let level = 'NONE'
      let count = 0
      
      if (!(isWeekend && hash > 0.45)) {
        if (hash > 0.88) {
          level = 'FOURTH_QUARTILE'
          count = 4
        } else if (hash > 0.72) {
          level = 'THIRD_QUARTILE'
          count = 3
        } else if (hash > 0.55) {
          level = 'SECOND_QUARTILE'
          count = 2
        } else if (hash > 0.32) {
          level = 'FIRST_QUARTILE'
          count = 1
        }
      }
      
      week.push({ date: dateStr, contributionCount: count, contributionLevel: level })
    }
    calendar.push(week)
  }
  return calendar
}

const DEFAULT_GITHUB_DATA: GitHubData = {
  repos: 25,
  contributions: 328,
  stars: 0,
  prs: 8,
  languages: [
    { name: 'JavaScript', percentage: 26.3, color: '#f7df1e' },
    { name: 'Python', percentage: 21.1, color: '#3776ab' },
    { name: 'C', percentage: 21.1, color: '#555555' },
    { name: 'TypeScript', percentage: 10.5, color: '#3178c6' },
    { name: 'HTML', percentage: 10.5, color: '#e34f26' },
    { name: 'Other', percentage: 10.5, color: '#71717a' },
  ],
  calendar: generateFallbackCalendar()
}

interface StreakStats {
  activeDays: number
  currentStreak: number
  maxStreak: number
}

function calculateLeetCodeStreaks(calendar: Record<string, number> | undefined): StreakStats {
  if (!calendar || Object.keys(calendar).length === 0) {
    return { activeDays: 0, currentStreak: 0, maxStreak: 0 }
  }

  const dateStrings = Object.keys(calendar).map(ts => {
    try {
      const val = parseInt(ts)
      if (isNaN(val)) return null
      const date = new Date(val * 1000)
      if (isNaN(date.getTime())) return null
      return date.toISOString().split('T')[0]
    } catch (e) {
      console.error("Error parsing streak timestamp:", ts, e)
      return null
    }
  }).filter((d): d is string => d !== null)

  const uniqueDates = Array.from(new Set(dateStrings)).sort()

  if (uniqueDates.length === 0) {
    return { activeDays: 0, currentStreak: 0, maxStreak: 0 }
  }

  let maxStreak = 1
  const dates = uniqueDates.map(d => new Date(d))
  
  let tempStreak = 1
  for (let i = 1; i < dates.length; i++) {
    const diffTime = dates[i].getTime() - dates[i-1].getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      tempStreak++
    } else if (diffDays > 1) {
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak
      }
      tempStreak = 1
    }
  }
  if (tempStreak > maxStreak) {
    maxStreak = tempStreak
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const lastSubDateStr = uniqueDates[uniqueDates.length - 1]

  if (lastSubDateStr === todayStr || lastSubDateStr === yesterdayStr) {
    let activeStreak = 1
    for (let i = uniqueDates.length - 1; i > 0; i--) {
      const d1 = new Date(uniqueDates[i])
      const d2 = new Date(uniqueDates[i-1])
      const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        activeStreak++
      } else {
        break
      }
    }
    const calculatedCurrentStreak = activeStreak
    return {
      activeDays: uniqueDates.length,
      currentStreak: calculatedCurrentStreak,
      maxStreak: Math.max(maxStreak, calculatedCurrentStreak)
    }
  } else {
    return {
      activeDays: uniqueDates.length,
      currentStreak: 0,
      maxStreak
    }
  }
}

const generateLeetCodeCalendar = (submissionCalendar: Record<string, number> | undefined) => {
  const calendarMap: Record<string, number> = {}
  if (submissionCalendar) {
    Object.entries(submissionCalendar).forEach(([ts, count]) => {
      try {
        const val = parseInt(ts)
        if (isNaN(val)) return
        const date = new Date(val * 1000)
        if (isNaN(date.getTime())) return
        const dateStr = date.toISOString().split('T')[0]
        calendarMap[dateStr] = (calendarMap[dateStr] || 0) + count
      } catch (e) {
        console.error("Error parsing calendar timestamp:", ts, e)
      }
    })
  }

  const calendar: Array<Array<{ date: string; contributionCount: number; contributionLevel: string }>> = []
  const today = new Date()
  const startDay = new Date(today.getTime() - 23 * 7 * 24 * 60 * 60 * 1000)
  const startDayOfWeek = startDay.getDay()
  startDay.setDate(startDay.getDate() - startDayOfWeek)

  for (let w = 0; w < 24; w++) {
    const week: Array<{ date: string; contributionCount: number; contributionLevel: string }> = []
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDay.getTime() + (w * 7 + d) * 24 * 60 * 60 * 1000)
      const dateStr = currentDate.toISOString().split('T')[0]
      const count = calendarMap[dateStr] || 0
      
      let level = 'NONE'
      if (count > 0) {
        if (count >= 4) level = 'FOURTH_QUARTILE'
        else if (count === 3) level = 'THIRD_QUARTILE'
        else if (count === 2) level = 'SECOND_QUARTILE'
        else level = 'FIRST_QUARTILE'
      }
      
      week.push({ date: dateStr, contributionCount: count, contributionLevel: level })
    }
    calendar.push(week)
  }
  return calendar
}

const DEFAULT_LEETCODE_DATA: LeetCodeData = {
  solved: 19,
  easy: 8,
  medium: 8,
  hard: 3,
  ranking: 4240068,
  acceptanceRate: 82.6,
  contestRating: null,
  submissionCalendar: {
    "1767225600": 1,
    "1767312000": 1,
    "1767398400": 1,
    "1767484800": 1,
    "1767571200": 1,
    "1767657600": 1,
    "1767744000": 1,
    "1767830400": 2,
    "1767916800": 1,
    "1768089600": 1,
    "1768176000": 1,
    "1768262400": 1
  }
}

// Custom SVGs for branding
const GitHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="text-white fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LeetCodeLogo = () => (
  <img src={LeetCodeLogoSvg} alt="" aria-hidden="true" className="w-[22px] h-[22px]" />
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
)

// GitHub stat SVGs
const RepositoriesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const ContributionsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
)

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const PullRequestsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    <line x1="6" y1="9" x2="6" y2="21" />
  </svg>
)


const getMonthsFromCalendar = (calendarData: ContributionDay[][]) => {
  const monthsList: Array<{ name: string; col: number }> = []
  if (!Array.isArray(calendarData)) return monthsList
  let lastMonth = ''
  
  calendarData.forEach((week, colIdx) => {
    if (!Array.isArray(week)) return
    const dayObj = week[3] || week[0]
    if (dayObj && dayObj.date) {
      try {
        const date = new Date(dayObj.date)
        if (!isNaN(date.getTime())) {
          const monthName = date.toLocaleString('default', { month: 'short' })
          if (monthName !== lastMonth) {
            const lastAdded = monthsList[monthsList.length - 1]
            if (!lastAdded || (colIdx - lastAdded.col >= 2)) {
              monthsList.push({ name: monthName, col: colIdx })
              lastMonth = monthName
            }
          }
        }
      } catch (e) {
        console.error("Error formatting month name:", e)
      }
    }
  })
  return monthsList
}

export default function CodingProfiles() {
  const rows = [0, 1, 2, 3, 4, 5, 6]
  const cols = Array.from({ length: 24 }, (_, i) => i)

  const [githubData, setGithubData] = useState<GitHubData>(DEFAULT_GITHUB_DATA)
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData>(DEFAULT_LEETCODE_DATA)
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'live' | 'cached' | 'offline'>('syncing')

  const streakStats = useMemo(() => {
    return calculateLeetCodeStreaks(leetcodeData.submissionCalendar)
  }, [leetcodeData.submissionCalendar])

  const leetCodeCalendar = useMemo(() => {
    return generateLeetCodeCalendar(leetcodeData.submissionCalendar)
  }, [leetcodeData.submissionCalendar])

  const leetCodeMonths = useMemo(() => {
    return getMonthsFromCalendar(leetCodeCalendar)
  }, [leetCodeCalendar])

  useEffect(() => {
    let active = true

    async function loadData() {
      // 1. Try reading from cache
      const cached = localStorage.getItem(CACHE_KEY)
      let parsedCache: { timestamp: number; github: GitHubData; leetcode: LeetCodeData } | null = null

      if (cached) {
        try {
          parsedCache = JSON.parse(cached)
        } catch (e) {
          console.error('Failed to parse portfolio cache:', e)
        }
      }

      const isCacheValid = parsedCache && (Date.now() - parsedCache.timestamp < CACHE_TTL)

      if (parsedCache) {
        setGithubData(parsedCache.github)
        setLeetcodeData(parsedCache.leetcode)
        if (isCacheValid) {
          setSyncStatus('cached')
          return
        }
      }

      // 2. Fetch fresh data
      try {
        setSyncStatus('syncing')
        
        // GitHub Profile, Repos, PRs & Calendar fetches
        const ghProfilePromise = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
          .then(r => r.ok ? r.json() : null)
        const ghReposPromise = fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
          .then(r => r.ok ? r.json() : null)
        const ghPrsPromise = fetch(`https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr`)
          .then(r => r.ok ? r.json() : null)
        const ghCalendarPromise = fetch(`https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`)
          .then(r => r.ok ? r.json() : null)

        // LeetCode fetches
        const lcProfilePromise = fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/profile`)
          .then(r => r.ok ? r.json() : null)
        const lcContestPromise = fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/contest`)
          .then(r => r.ok ? r.json() : null)

        const [ghProfile, ghRepos, ghPrs, ghCalendar, lcProfile, lcContest] = await Promise.all([
          ghProfilePromise.catch(() => null),
          ghReposPromise.catch(() => null),
          ghPrsPromise.catch(() => null),
          ghCalendarPromise.catch(() => null),
          lcProfilePromise.catch(() => null),
          lcContestPromise.catch(() => null)
        ])

        if (!active) return

        // Process GitHub data
        const nextGithub: GitHubData = { ...DEFAULT_GITHUB_DATA }
        if (ghProfile && typeof ghProfile.public_repos === 'number') {
          nextGithub.repos = ghProfile.public_repos
        }
        if (ghPrs && typeof ghPrs.total_count === 'number') {
          nextGithub.prs = ghPrs.total_count
        }
        if (ghCalendar) {
          if (typeof ghCalendar.totalContributions === 'number') {
            nextGithub.contributions = ghCalendar.totalContributions
          }
          if (Array.isArray(ghCalendar.contributions) && ghCalendar.contributions.length > 0) {
            nextGithub.calendar = ghCalendar.contributions.slice(-24)
          }
        }
        if (Array.isArray(ghRepos) && ghRepos.length > 0) {
          let stars = 0
          const langCounts: Record<string, number> = {}
          ghRepos.forEach(repo => {
            stars += repo.stargazers_count || 0
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
            }
          })
          nextGithub.stars = stars

          const totalReposWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0)
          if (totalReposWithLang > 0) {
            const sortedLangs = Object.entries(langCounts)
              .map(([name, count]) => ({
                name,
                percentage: parseFloat(((count / totalReposWithLang) * 100).toFixed(1)),
                color: LANGUAGE_COLORS[name] || '#71717a'
              }))
              .sort((a, b) => b.percentage - a.percentage)

            if (sortedLangs.length > 5) {
              const top5 = sortedLangs.slice(0, 5)
              const others = sortedLangs.slice(5)
              const othersPercent = parseFloat(others.reduce((acc, curr) => acc + curr.percentage, 0).toFixed(1))
              if (othersPercent > 0) {
                top5.push({ name: 'Other', percentage: othersPercent, color: '#71717a' })
              }
              nextGithub.languages = top5
            } else {
              nextGithub.languages = sortedLangs
            }
          }
        }

        // Process LeetCode data
        const nextLeetcode: LeetCodeData = { ...DEFAULT_LEETCODE_DATA }
        if (lcProfile) {
          nextLeetcode.solved = lcProfile.totalSolved || 0
          nextLeetcode.easy = lcProfile.easySolved || 0
          nextLeetcode.medium = lcProfile.mediumSolved || 0
          nextLeetcode.hard = lcProfile.hardSolved || 0
          nextLeetcode.ranking = lcProfile.ranking || 0
          
          if (lcProfile.submissionCalendar) {
            if (typeof lcProfile.submissionCalendar === 'string') {
              try {
                nextLeetcode.submissionCalendar = JSON.parse(lcProfile.submissionCalendar)
              } catch (e) {
                console.error("Failed to parse LeetCode calendar string:", e)
              }
            } else if (typeof lcProfile.submissionCalendar === 'object') {
              nextLeetcode.submissionCalendar = lcProfile.submissionCalendar
            }
          }

          if (Array.isArray(lcProfile.totalSubmissions)) {
            const allSub = (lcProfile.totalSubmissions as SubmissionSummary[]).find((s) => s.difficulty === 'All')
            if (allSub && allSub.submissions > 0) {
              nextLeetcode.acceptanceRate = parseFloat(((allSub.count / allSub.submissions) * 100).toFixed(1))
            }
          }
        }
        if (lcContest) {
          if (lcContest.contestRating) {
            nextLeetcode.contestRating = Math.round(lcContest.contestRating)
          } else if (lcContest.contestParticipation && lcContest.contestParticipation.length > 0) {
            const latest = lcContest.contestParticipation[lcContest.contestParticipation.length - 1]
            if (latest && latest.rating) {
              nextLeetcode.contestRating = Math.round(latest.rating)
            }
          }
        }

        setGithubData(nextGithub)
        setLeetcodeData(nextLeetcode)
        setSyncStatus('live')

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            github: nextGithub,
            leetcode: nextLeetcode
          }))
        } catch (e) {
          console.error('Failed to write portfolio cache:', e)
        }
      } catch (err) {
        console.error('Failed background sync of profiles:', err)
        if (active) {
          setSyncStatus(parsedCache ? 'cached' : 'offline')
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const dynamicMonths = getMonthsFromCalendar(githubData.calendar)

  const githubStatsList = [
    { label: 'Repositories', value: String(githubData.repos), icon: <RepositoriesIcon /> },
    { label: 'Contributions', value: String(githubData.contributions), icon: <ContributionsIcon /> },
    { label: 'Stars Earned', value: String(githubData.stars), icon: <StarIcon /> },
    { label: 'Pull Requests', value: String(githubData.prs), icon: <PullRequestsIcon /> },
  ]

  const totalSolved = leetcodeData.solved
  const easyPercent = totalSolved > 0 ? (leetcodeData.easy / totalSolved) * 100 : 0
  const mediumPercent = totalSolved > 0 ? (leetcodeData.medium / totalSolved) * 100 : 0
  const hardPercent = totalSolved > 0 ? (leetcodeData.hard / totalSolved) * 100 : 0

  return (
    <div className="relative w-full py-16 md:py-20 bg-bg-dark text-white font-sans overflow-hidden border-t border-white/[0.02]">
      {/* Background glow effects */}
      <div className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute left-[-10%] bottom-[20%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-14 text-left max-w-3xl">
          <div className="font-mono text-white/40 text-xs mb-4 tracking-[0.2em] uppercase flex items-center gap-3">
            <span>04 // CODING</span>
            {/* Sync Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider transition-all duration-500 ${
              syncStatus === 'syncing' ? 'border-amber-500/25 bg-amber-500/5 text-amber-500' :
              syncStatus === 'live' ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-500' :
              syncStatus === 'cached' ? 'border-blue-500/25 bg-blue-500/5 text-blue-400' :
              'border-zinc-500/25 bg-zinc-500/5 text-zinc-400'
            }`}>
              <span className={`w-1 h-1 rounded-full ${
                syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' :
                syncStatus === 'live' ? 'bg-emerald-500 animate-ping' :
                syncStatus === 'cached' ? 'bg-blue-500' :
                'bg-zinc-400'
              }`} />
              <span>{
                syncStatus === 'syncing' ? 'Syncing...' :
                syncStatus === 'live' ? 'Live Synced' :
                syncStatus === 'cached' ? 'Cached' :
                'Offline'
              }</span>
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-white">Coding </span>
            <span className="text-accent">Profiles</span>
          </h2>
          <p className="text-white/45 text-sm md:text-base font-mono leading-relaxed">
            A snapshot of my coding journey on GitHub and LeetCode.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
          
          {/* GitHub Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-emerald-500/15 transition-all duration-300 group overflow-hidden"
          >
            {/* Subtle glow border effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute left-0 top-[20%] w-[2px] h-[40px] bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.8)] rounded-r pointer-events-none" />

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors duration-300">
                <GitHubLogo />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">GitHub</h3>
                <span className="text-xs text-white/40 font-mono"><span className="font-sans">@</span>{GITHUB_USERNAME}</span>
              </div>
              
              <a 
                href={`https://github.com/${GITHUB_USERNAME}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/5 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase transition-all duration-300 ml-auto cursor-pointer"
              >
                <span>View Profile</span>
                <ExternalLinkIcon />
              </a>
            </div>

            {/* Contributions Grid */}
            <div className="mb-6 bg-white/[0.01] border border-white/5 rounded-xl p-4 md:p-5">
              <div className="text-[10px] md:text-[11px] font-mono text-white/50 mb-4 tracking-wider uppercase">
                Contributions (Last 24 Weeks)
              </div>
              
              <div className="flex flex-col gap-1 overflow-x-auto no-scrollbar pb-2">
                {/* Months Header Row */}
                <div className="relative h-4 w-full text-[9px] font-mono text-white/30 flex mb-1" style={{ minWidth: '380px' }}>
                  {dynamicMonths.map((m, idx) => (
                    <span 
                      key={`${m.name}-${idx}`} 
                      className="absolute" 
                      style={{ left: `${(m.col * 15.5) + 26}px` }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Day Rows with Grid */}
                <div className="flex gap-2" style={{ minWidth: '380px' }}>
                  {/* Day Labels */}
                  <div className="flex flex-col justify-between text-[9px] font-mono text-white/20 w-5 py-0.5 h-[98px]">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  {/* Grid cells */}
                  <div className="flex flex-col gap-[4px] flex-1">
                    {rows.map((row) => (
                      <div key={row} className="flex gap-[4px]">
                        {cols.map((col) => {
                          const dayData = githubData.calendar[col]?.[row]
                          const level = dayData?.contributionLevel || 'NONE'
                          const count = dayData?.contributionCount || 0
                          const date = dayData?.date || ''
                          
                          let bgClass = "bg-white/[0.04]"
                          if (level === 'FIRST_QUARTILE') bgClass = "bg-emerald-500/25"
                          else if (level === 'SECOND_QUARTILE') bgClass = "bg-emerald-500/50"
                          else if (level === 'THIRD_QUARTILE') bgClass = "bg-emerald-500/75"
                          else if (level === 'FOURTH_QUARTILE') bgClass = "bg-emerald-500"
                          
                          return (
                            <div 
                              key={col} 
                              className={`w-[12px] h-[10px] rounded-[1.5px] ${bgClass} transition-colors hover:scale-110 duration-200`}
                              title={`${count} commits on ${date || 'N/A'}`}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend Row */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-white/30 ml-auto">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-white/[0.04]" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500/25" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500/50" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500/75" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500" />
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {githubStatsList.map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-white/[0.015] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-emerald-500/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 text-emerald-400 mb-1">
                    <span className="shrink-0 scale-90">{stat.icon}</span>
                    <span className="text-sm md:text-base font-bold tracking-tight text-emerald-400">{stat.value}</span>
                  </div>
                  <span className="text-[9px] text-white/40 font-mono tracking-wider uppercase leading-tight">{stat.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Languages Section */}
            <div>
              <div className="text-[10px] md:text-[11px] font-mono text-white/50 mb-2 tracking-wider uppercase">
                Most Used Languages
              </div>
              <div className="grid grid-cols-2 gap-3">
                {githubData.languages.map((lang) => (
                  <div 
                    key={lang.name}
                    className="bg-white/[0.015] border border-white/5 rounded-xl px-4 py-3 flex flex-col justify-between h-[64px] relative overflow-hidden group/lang hover:border-emerald-500/10 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                        <span className="text-[12px] md:text-[13px] font-mono font-medium text-white/80">{lang.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-white/45">{lang.percentage}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: lang.color, width: `${lang.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* LeetCode Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-20 bg-[#111113]/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-accent/15 transition-all duration-300 group overflow-hidden"
          >
            {/* Subtle glow border effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute right-0 top-0 w-[45px] h-[2px] bg-accent/80 shadow-[0_0_12px_rgba(255,75,31,0.8)] rounded-l pointer-events-none" />

            <div>
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors duration-300">
                  <LeetCodeLogo />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">LeetCode</h3>
                  <span className="text-xs text-white/40 font-mono"><span className="font-sans">@</span>{LEETCODE_USERNAME}</span>
                </div>
                
                <a 
                  href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-accent/40 hover:bg-accent/5 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase transition-all duration-300 ml-auto cursor-pointer"
                >
                  <span>View Profile</span>
                  <ExternalLinkIcon />
                </a>
              </div>

              {/* LeetCode Submissions Calendar (Aligned with GitHub Calendar) */}
              <div className="mb-6 bg-white/[0.01] border border-white/5 rounded-xl p-4 md:p-5">
                <div className="text-[10px] md:text-[11px] font-mono text-white/50 mb-4 tracking-wider uppercase">
                  Submissions (Last 24 Weeks)
                </div>
                
                <div className="flex flex-col gap-1 overflow-x-auto no-scrollbar pb-2">
                  {/* Months Header Row */}
                  <div className="relative h-4 w-full text-[9px] font-mono text-white/30 flex mb-1" style={{ minWidth: '380px' }}>
                    {leetCodeMonths.map((m, idx) => (
                      <span 
                        key={`${m.name}-${idx}`} 
                        className="absolute" 
                        style={{ left: `${(m.col * 15.5) + 26}px` }}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>

                  {/* Day Rows with Grid */}
                  <div className="flex gap-2" style={{ minWidth: '380px' }}>
                    {/* Day Labels */}
                    <div className="flex flex-col justify-between text-[9px] font-mono text-white/20 w-5 py-0.5 h-[98px]">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>

                    {/* Grid cells */}
                    <div className="flex flex-col gap-[4px] flex-1">
                      {rows.map((row) => (
                        <div key={row} className="flex gap-[4px]">
                          {cols.map((col) => {
                            const dayData = leetCodeCalendar[col]?.[row]
                            const level = dayData?.contributionLevel || 'NONE'
                            const count = dayData?.contributionCount || 0
                            const date = dayData?.date || ''
                            
                            let bgClass = "bg-white/[0.04]"
                            if (level === 'FIRST_QUARTILE') bgClass = "bg-[#f89f1b]/25"
                            else if (level === 'SECOND_QUARTILE') bgClass = "bg-[#f89f1b]/50"
                            else if (level === 'THIRD_QUARTILE') bgClass = "bg-[#f89f1b]/75"
                            else if (level === 'FOURTH_QUARTILE') bgClass = "bg-[#f89f1b]"
                            
                            return (
                              <div 
                                key={col} 
                                className={`w-[12px] h-[10px] rounded-[1.5px] ${bgClass} transition-colors hover:scale-110 duration-200`}
                                title={`${count} submissions on ${date || 'N/A'}`}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend Row */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-[9px] font-mono text-white/30 ml-auto">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-[1.5px] bg-white/[0.04]" />
                    <div className="w-2.5 h-2.5 rounded-[1.5px] bg-[#f89f1b]/25" />
                    <div className="w-2.5 h-2.5 rounded-[1.5px] bg-[#f89f1b]/50" />
                    <div className="w-2.5 h-2.5 rounded-[1.5px] bg-[#f89f1b]/75" />
                    <div className="w-2.5 h-2.5 rounded-[1.5px] bg-[#f89f1b]" />
                    <span>More</span>
                  </div>
                </div>
              </div>

              {/* Problem Stats Ring Chart Container */}
              <div className="mb-6 bg-white/[0.01] border border-white/5 rounded-xl p-4 md:p-6 flex flex-wrap items-center justify-center lg:justify-between gap-6 w-full overflow-hidden">
                
                {/* Group: Left Stats & Center Chart (Keeps them side-by-side) */}
                <div className="flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-8 w-full md:w-auto">
                  {/* Left side: Total Solved & Global Ranking */}
                  <div className="flex flex-col items-start text-left justify-center py-1 min-w-[100px]">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] font-mono text-white/40 uppercase tracking-wider">Total Solved</span>
                      <span className="text-3xl sm:text-5xl font-bold text-accent tracking-tight mt-1">{leetcodeData.solved}</span>
                    </div>
                    <div className="flex flex-col mt-4 sm:mt-5">
                      <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider leading-none mb-1">Global Ranking</span>
                      <span className="text-base sm:text-xl font-bold text-accent tracking-tight leading-tight">
                        {leetcodeData.ranking > 0 ? leetcodeData.ranking.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Center SVG Ring Chart */}
                  <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex items-center justify-center shrink-0">
                    <svg width="100%" height="100%" viewBox="0 0 120 120" className="transform -rotate-90">
                      {/* Background Track Circle */}
                      <circle cx="60" cy="60" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
                      
                      {totalSolved > 0 ? (
                        <>
                          {/* Easy Segment (Green) */}
                          <circle 
                            cx="60" cy="60" r="42" 
                            stroke="#10b981" strokeWidth="8" 
                            strokeDasharray="263.89" 
                            strokeDashoffset={263.89 - (easyPercent / 100) * 263.89} 
                            fill="none" strokeLinecap="round"
                          />
                          {/* Medium Segment (Yellow) */}
                          <circle 
                            cx="60" cy="60" r="42" 
                            stroke="#f59e0b" strokeWidth="8" 
                            strokeDasharray="263.89" 
                            strokeDashoffset={263.89 - (mediumPercent / 100) * 263.89}
                            transform={`rotate(${easyPercent * 3.6} 60 60)`}
                            fill="none" strokeLinecap="round"
                          />
                          {/* Hard Segment (Red) */}
                          <circle 
                            cx="60" cy="60" r="42" 
                            stroke="#ef4444" strokeWidth="8" 
                            strokeDasharray="263.89" 
                            strokeDashoffset={263.89 - (hardPercent / 100) * 263.89}
                            transform={`rotate(${(easyPercent + mediumPercent) * 3.6} 60 60)`}
                            fill="none" strokeLinecap="round"
                          />
                        </>
                      ) : (
                        <circle cx="60" cy="60" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                      )}
                    </svg>
                    
                    {/* Centered Ring Text */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-white tracking-tight">{leetcodeData.solved}</span>
                      <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">Total</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Easy/Med/Hard Breakdown list */}
                <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 w-full md:w-auto md:flex-1 max-w-full lg:max-w-[260px] shrink-0">
                  {/* Easy */}
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-3 bg-white/[0.015] border border-white/5 rounded-xl px-1 sm:px-4 py-2 sm:py-2.5 text-center sm:text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0" />
                      <span className="text-[10px] sm:text-xs font-mono text-white/50">Easy</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[12px] sm:text-[13px] font-bold text-[#10b981]">{leetcodeData.easy}</span>
                      <span className="text-[9px] sm:text-[10.5px] text-white/30 hidden sm:inline">{easyPercent.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-3 bg-white/[0.015] border border-white/5 rounded-xl px-1 sm:px-4 py-2 sm:py-2.5 text-center sm:text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />
                      <span className="text-[10px] sm:text-xs font-mono text-white/50">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[12px] sm:text-[13px] font-bold text-[#f59e0b]">{leetcodeData.medium}</span>
                      <span className="text-[9px] sm:text-[10.5px] text-white/30 hidden sm:inline">{mediumPercent.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-3 bg-white/[0.015] border border-white/5 rounded-xl px-1 sm:px-4 py-2 sm:py-2.5 text-center sm:text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shrink-0" />
                      <span className="text-[10px] sm:text-xs font-mono text-white/50">Hard</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[12px] sm:text-[13px] font-bold text-[#ef4444]">{leetcodeData.hard}</span>
                      <span className="text-[9px] sm:text-[10.5px] text-white/30 hidden sm:inline">{hardPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* LeetCode Streak & Activity section */}
              <div className="mb-6 bg-white/[0.01] border border-white/5 rounded-xl p-4 md:p-5">
                <div className="text-[10px] md:text-[11px] font-mono text-white/50 mb-3 tracking-wider uppercase">
                  Streak & Activity Stats
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-white/[0.015] border border-white/5 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-start text-center hover:border-[#f89f1b]/15 transition-all duration-300">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#f89f1b] mb-1">
                      {streakStats.activeDays} <span className="text-[10px] sm:text-xs font-normal text-white/50">Days</span>
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-white/40 font-mono tracking-wider uppercase leading-tight">Active Days</span>
                  </div>
                  <div className="bg-white/[0.015] border border-white/5 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-start text-center hover:border-[#f89f1b]/15 transition-all duration-300">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#f89f1b] mb-1">
                      {streakStats.currentStreak} <span className="text-[10px] sm:text-xs font-normal text-white/50">Days</span>
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-white/40 font-mono tracking-wider uppercase leading-tight">Current Streak</span>
                  </div>
                  <div className="bg-white/[0.015] border border-white/5 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-start text-center hover:border-[#f89f1b]/15 transition-all duration-300">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#f89f1b] mb-1">
                      {streakStats.maxStreak} <span className="text-[10px] sm:text-xs font-normal text-white/50">Days</span>
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-white/40 font-mono tracking-wider uppercase leading-tight">Max Streak</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  )
}
