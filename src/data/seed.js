// Starter content so the app is usable on first launch.
export const SEED_RESOURCES = [
  {
    id: 'seed-1',
    title: 'Photosynthesis Basics',
    subject: 'Science',
    description: 'How plants turn sunlight, water and carbon dioxide into food and oxygen.',
    author: 'Ms. Rao',
    createdAt: '2026-01-10T09:00:00.000Z',
    file: null,
    quiz: [
      { q: 'Which gas do plants absorb for photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 1 },
      { q: 'Where does photosynthesis mainly happen?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], answer: 2 },
      { q: 'Which pigment captures sunlight?', options: ['Chlorophyll', 'Melanin', 'Keratin', 'Haemoglobin'], answer: 0 },
      { q: 'What do plants release as a by-product?', options: ['Carbon dioxide', 'Methane', 'Oxygen', 'Steam'], answer: 2 },
    ],
    terms: [
      { term: 'Chlorophyll', definition: 'Green pigment that absorbs light' },
      { term: 'Stomata', definition: 'Tiny leaf pores for gas exchange' },
      { term: 'Glucose', definition: 'Sugar made by the plant as food' },
      { term: 'Chloroplast', definition: 'Cell part where photosynthesis occurs' },
    ],
  },
  {
    id: 'seed-2',
    title: 'Personal Finance 101',
    subject: 'Life Skills',
    description: 'Budgeting, saving and avoiding debt traps - practical money habits for students.',
    author: 'Mr. Khan',
    createdAt: '2026-01-14T09:00:00.000Z',
    file: null,
    quiz: [
      { q: 'In the 50/30/20 rule, what does the 20% represent?', options: ['Wants', 'Needs', 'Savings and debt repayment', 'Taxes'], answer: 2 },
      { q: 'What is an emergency fund for?', options: ['Shopping sales', 'Unexpected expenses', 'Holidays', 'Gifts'], answer: 1 },
      { q: 'Which usually costs more over time?', options: ['Paying full balance', 'Paying only the minimum on a credit card', 'Saving monthly', 'Budgeting'], answer: 1 },
      { q: 'A budget is best described as...', options: ['A plan for your money', 'A bank account', 'A loan type', 'A tax form'], answer: 0 },
    ],
    terms: [
      { term: 'Budget', definition: 'A plan for income and spending' },
      { term: 'Interest', definition: 'Cost of borrowing or reward for saving' },
      { term: 'Asset', definition: 'Something you own that has value' },
      { term: 'Inflation', definition: 'General rise in prices over time' },
    ],
  },
  {
    id: 'seed-3',
    title: 'First Aid Essentials',
    subject: 'Health',
    description: 'Quick, practical responses to common minor injuries and when to call for help.',
    author: 'Dr. Nair',
    createdAt: '2026-01-20T09:00:00.000Z',
    file: null,
    quiz: [
      { q: 'First step for a minor burn?', options: ['Apply butter', 'Cool under running water', 'Pop blisters', 'Cover with ice directly'], answer: 1 },
      { q: 'What does "R" in RICE stand for?', options: ['Run', 'Rest', 'Rub', 'Repeat'], answer: 1 },
      { q: 'Heavy bleeding should be treated by...', options: ['Washing repeatedly', 'Applying firm direct pressure', 'Leaving it open', 'Applying heat'], answer: 1 },
      { q: 'Which number do you call for an emergency in India?', options: ['100 / 112', '411', '999', '000'], answer: 0 },
    ],
    terms: [
      { term: 'CPR', definition: 'Chest compressions and breaths to restart circulation' },
      { term: 'Sprain', definition: 'Stretched or torn ligament' },
      { term: 'Antiseptic', definition: 'Substance that prevents infection' },
      { term: 'Triage', definition: 'Sorting patients by urgency' },
    ],
  },
];

// Demo-only players for the leaderboard (replace with a backend later).
export const DEMO_PLAYERS = [
  { name: 'Aarav', points: 420 },
  { name: 'Diya', points: 310 },
  { name: 'Kabir', points: 205 },
  { name: 'Meera', points: 120 },
];
