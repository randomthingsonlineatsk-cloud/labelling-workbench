// Certificate per region pack: every lesson check passed, a mixed quiz round passed and the
// capstone drill completed. A portfolio exercise, not an accreditation.
import { sha256 } from './sha256.js';
import { moduleOf } from './pack.js';

export const QUIZ_TOPIC = { us: 'all', core: 'core', eu: 'eu', in: 'in' };

export const RULES = { lessonPass: 80, quizPass: 80, quizMin: 10, capstonePass: 100 };

export function certificateStatus({ region = 'us', lessons, drills, attempts, lessonsDone }) {
  const ls = lessons.lessons.filter((l) => moduleOf(l) === region).map((l) => ({ id: l.id, title: l.title, best: lessonsDone?.[`us-${l.id}`]?.best ?? null }));
  const quiz = attempts.filter((a) => a.kind === 'quiz' && (a.region ?? 'us') === 'us' && a.topic === QUIZ_TOPIC[region] && (a.total ?? 0) >= RULES.quizMin).sort((a, b) => b.score - a.score)[0] ?? null;
  const ds = drills.drills.filter((d) => moduleOf(d) === region).map((d) => {
    const a = attempts.filter((x) => x.kind === 'drill' && x.drillId === d.id);
    return { id: d.id, title: d.title, capstone: !!d.capstone, best: a.length ? Math.max(...a.map((x) => x.score)) : null };
  });
  const cap = ds.find((d) => d.capstone);
  const criteria = [
    { id: 'lessons', label: `Every lesson check passed (${RULES.lessonPass}% or more)`, done: ls.filter((l) => l.best >= RULES.lessonPass).length, of: ls.length },
    { id: 'quiz', label: `A mixed quiz round of ${RULES.quizMin} or more questions at ${RULES.quizPass}% or more`, done: quiz && quiz.score >= RULES.quizPass ? 1 : 0, of: 1 },
    { id: 'capstone', label: 'The capstone drill completed (every goal met)', done: cap && cap.best >= RULES.capstonePass ? 1 : 0, of: 1 },
  ];
  return { region, lessons: ls, drills: ds, quiz, criteria, eligible: criteria.every((c) => c.done >= c.of) };
}

export function verificationCode({ name, userId, status, date }) {
  const basis = JSON.stringify({ app: 'labelling-workbench', region: status.region, name: name.trim(), userId, date, lessons: status.lessons.map((l) => [l.id, l.best]), quiz: status.quiz?.score ?? null, drills: status.drills.map((d) => [d.id, d.best]) });
  const h = sha256(basis).toUpperCase();
  return `LW-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`;
}
