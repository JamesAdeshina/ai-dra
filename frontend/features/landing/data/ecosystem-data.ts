export type EcosystemView = "survivor" | "carer" | "research";

export interface EcosystemViewData {
  title: string;
  description: string;
  items: string[];
  image: string;
  imageAlt: string;
  name: string;
  role: string;
  status: string;
  cards: string;
}

export const ecosystemData: Record<EcosystemView, EcosystemViewData> = {
  survivor: {
    title: "Clear guidance before, during, and after every session.",
    description: "The survivor journey is designed to reduce cognitive load, make exercises easier to follow, and turn progress into something visible and encouraging.",
    items: [
      "Accessible authentication, dashboard, exercise library, and profile settings.",
      "Exercise demonstrations, step-by-step preparation, and live camera guidance.",
      "Repetition counting, hold timing, session history, progress, and reminders.",
      "Optional voice instructions, sound effects, and reduced-motion preferences.",
    ],
    image: "/landing/profiles/william-carter.jpg",
    imageAlt: "William Carter profile",
    name: "William Carter",
    role: "Survivor dashboard",
    status: "Ready for session",
    cards: `<div class="aidra-visual-card"><div class="aidra-visual-label">This week</div><div class="aidra-visual-number">4 / 5</div><div class="aidra-visual-detail">Sessions completed</div><div class="aidra-sparkline" aria-hidden="true"><i style="height:35%"></i><i style="height:54%"></i><i style="height:47%"></i><i style="height:70%"></i><i style="height:82%"></i></div></div><div class="aidra-visual-card aidra-light"><div class="aidra-visual-label">Next exercise</div><div class="aidra-visual-number">Target Touch</div><div class="aidra-visual-detail">10 repetitions</div></div><div class="aidra-visual-card aidra-light aidra-wide"><div class="aidra-visual-label">Recent activity</div><div class="aidra-activity-row"><span class="aidra-activity-name"><span class="aidra-activity-icon">↗</span>Lift &amp; Place</span><span class="aidra-activity-badge">Completed</span></div><div class="aidra-activity-row"><span class="aidra-activity-name"><span class="aidra-activity-icon">↗</span>Grasp &amp; Hold</span><span class="aidra-activity-badge">82% score</span></div></div>`,
  },
  carer: {
    title: "Support progress without taking control away from the survivor.",
    description: "The carer portal focuses on visibility, encouragement, and permission-based connection rather than clinical decision-making.",
    items: [
      "Invite or link a survivor through a clear acceptance workflow.",
      "Review recent activity, consistency, and exercise completion.",
      "Receive relevant notifications and manage communication preferences.",
      "Access profile, password, help, about, and notification settings.",
    ],
    image: "/landing/profiles/priya-sharma.jpg",
    imageAlt: "Priya Sharma profile",
    name: "Priya Sharma",
    role: "Carer portal",
    status: "1 survivor linked",
    cards: `<div class="aidra-visual-card"><div class="aidra-visual-label">Linked survivor</div><div class="aidra-visual-number">William</div><div class="aidra-visual-detail">Active this week</div><div class="aidra-sparkline" aria-hidden="true"><i style="height:52%"></i><i style="height:64%"></i><i style="height:58%"></i><i style="height:76%"></i><i style="height:88%"></i></div></div><div class="aidra-visual-card aidra-light"><div class="aidra-visual-label">Weekly consistency</div><div class="aidra-visual-number">80%</div><div class="aidra-visual-detail">4 of 5 sessions</div></div><div class="aidra-visual-card aidra-light aidra-wide"><div class="aidra-visual-label">Support actions</div><div class="aidra-activity-row"><span class="aidra-activity-name"><span class="aidra-activity-icon">✓</span>Invitation accepted</span><span class="aidra-activity-badge">Connected</span></div><div class="aidra-activity-row"><span class="aidra-activity-name"><span class="aidra-activity-icon">●</span>Session completed today</span><span class="aidra-activity-badge">View progress</span></div></div>`,
  },
  research: {
    title: "See how the prototype is being used and where it needs to improve.",
    description: "The research dashboard is intentionally focused on engagement and evaluation rather than complex commercial administration.",
    items: [
      "Monitor survivors and carers participating in the prototype.",
      "Compare sessions started, completed, paused, or ended early.",
      "Review exercise uptake, repetition outcomes, and movement summaries.",
      "Identify usage consistency, abandonment points, and system issues.",
    ],
    image: "/landing/profiles/research-monitor.jpg",
    imageAlt: "Research monitor profile",
    name: "Dr Maya Roberts",
    role: "Evaluation dashboard",
    status: "Prototype overview",
    cards: `<div class="aidra-visual-card"><div class="aidra-visual-label">Active survivors</div><div class="aidra-visual-number">24</div><div class="aidra-visual-detail">18 active this week</div><div class="aidra-sparkline" aria-hidden="true"><i style="height:42%"></i><i style="height:50%"></i><i style="height:61%"></i><i style="height:73%"></i><i style="height:86%"></i></div></div><div class="aidra-visual-card aidra-light"><div class="aidra-visual-label">Completion rate</div><div class="aidra-visual-number">78%</div><div class="aidra-visual-detail">Across recent sessions</div></div><div class="aidra-visual-card aidra-light aidra-wide"><div class="aidra-visual-label">Research signals</div><div class="aidra-activity-row"><span class="aidra-activity-name"><span class="aidra-activity-icon">↗</span>Target Touch engagement</span><span class="aidra-activity-badge">High</span></div><div class="aidra-activity-row"><span class="aidra-activity-name"><span class="aidra-activity-icon">!</span>Ended early sessions</span><span class="aidra-activity-badge">Review</span></div></div>`,
  },
};
