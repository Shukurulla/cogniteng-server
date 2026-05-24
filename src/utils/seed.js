require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Topic = require('../models/Topic');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Test = require('../models/Test');
const DiagnosticTest = require('../models/DiagnosticTest');

const TOPIC_TITLES = [
  { code: 'A1', order: 1, title: 'Introduction to the methodology of teaching foreign languages' },
  { code: 'A2', order: 2, title: 'Aims, content and aids of teaching foreign languages' },
  { code: 'A3', order: 3, title: 'Methods and principles of teaching foreign languages' },
  { code: 'A4', order: 4, title: 'Standardized controls. International language standards' },
  { code: 'A5', order: 5, title: 'History of trends in foreign language teaching' },
  { code: 'A6', order: 6, title: 'Alternative approaches and methods' },
  { code: 'A7', order: 7, title: 'Teaching vocabulary' },
  { code: 'A8', order: 8, title: 'Teaching grammar' },
  { code: 'A9', order: 9, title: 'Teaching pronunciation' },
  { code: 'A10', order: 10, title: 'Teaching listening' },
  { code: 'A11', order: 11, title: 'Teaching speaking' },
  { code: 'A12', order: 12, title: 'Teaching reading' },
  { code: 'A13', order: 13, title: 'Teaching writing' },
  { code: 'A14', order: 14, title: 'Innovative Approaches to English Language Teaching' },
  { code: 'A15', order: 15, title: 'Assessment Strategies in English Language Education' },
];

const TOPICS_CONTENT = require('../seeds/topics-content');
const EXERCISES_CONTENT = require('../seeds/exercises-content');
const TESTS_CONTENT = require('../seeds/tests-content');
const { ENTRY_QUESTIONS } = require('../seeds/diagnostics-content');

const seedTopics = async () => {
  const contentByCode = new Map(TOPICS_CONTENT.map((c) => [c.code, c]));

  for (const t of TOPIC_TITLES) {
    const extra = contentByCode.get(t.code) || {};
    await Topic.findOneAndUpdate(
      { code: t.code },
      {
        code: t.code,
        order: t.order,
        title: t.title,
        goal: extra.goal || '',
        keyTerms: extra.keyTerms || [],
        theory: extra.theory || { text: '', youtubeUrl: '', images: [] },
        isPublished: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`  Topics: ${TOPIC_TITLES.length} seeded`);
};

const seedExercises = async () => {
  let count = 0;
  for (const t of TOPIC_TITLES) {
    const topic = await Topic.findOne({ code: t.code });
    const items = EXERCISES_CONTENT[t.code] || [];

    // Wipe existing exercises for this topic so seed is idempotent
    await Exercise.deleteMany({ topic: topic._id });

    for (const [i, item] of items.entries()) {
      await Exercise.create({
        topic: topic._id,
        order: i + 1,
        ...item,
      });
      count += 1;
    }
  }
  console.log(`  Exercises: ${count} seeded across ${TOPIC_TITLES.length} topics`);
};

const seedTests = async () => {
  let count = 0;
  for (const t of TOPIC_TITLES) {
    const topic = await Topic.findOne({ code: t.code });
    const questions = TESTS_CONTENT[t.code] || [];
    if (questions.length === 0) continue;

    await Test.findOneAndUpdate(
      { topic: topic._id },
      {
        topic: topic._id,
        title: `${t.code} — yakuniy test`,
        passingScore: 60,
        questions,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    count += 1;
  }
  console.log(`  Tests: ${count} seeded (10 questions each)`);
};

const seedDiagnostics = async () => {
  for (const kind of ['entry', 'final']) {
    await DiagnosticTest.findOneAndUpdate(
      { kind },
      {
        kind,
        title: kind === 'entry' ? 'Kirish diagnostikasi' : 'Yakuniy diagnostika',
        description:
          kind === 'entry'
            ? 'Boshlang\'ich darajangizni 4 yo\'nalish bo\'yicha baholaydi: diqqat, xotira, mantiq, tanqidiy fikrlash.'
            : 'Yakuniy diagnostika — kursdan keyingi natijalaringizni ko\'rsatadi.',
        questions: ENTRY_QUESTIONS,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`  Diagnostics: entry + final (${ENTRY_QUESTIONS.length} questions each)`);
};

const seedTeacher = async () => {
  const teacherEmail = 'teacher@cogniteng.local';
  let teacher = await User.findOne({ email: teacherEmail });
  if (!teacher) {
    teacher = await User.create({
      fullName: 'Default Teacher',
      email: teacherEmail,
      password: 'teacher123',
      role: 'teacher',
    });
    console.log(`  Teacher: created (${teacherEmail} / teacher123)`);
  } else {
    console.log(`  Teacher: already exists (${teacherEmail})`);
  }
};

const seed = async () => {
  await connectDB();
  console.log('Seeding...');

  await seedTopics();
  await seedExercises();
  await seedTests();
  await seedDiagnostics();
  await seedTeacher();

  await mongoose.disconnect();
  console.log('Done.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
