// 4 exercises per topic (one of each type: MC, TF, Matching, GapFilling).

const ex = (type, prompt, payload, explanation = '') => ({ type, prompt, payload, explanation });

const mc = (prompt, options, correctIdx, explanation) =>
  ex('multipleChoice', prompt,
    { options: options.map((text, i) => ({ text, isCorrect: i === correctIdx })) },
    explanation);

const tf = (prompt, statement, correct, explanation) =>
  ex('trueFalse', prompt, { statement, correctAnswer: correct }, explanation);

const ma = (prompt, pairs, explanation = '') =>
  ex('matching', prompt, { pairs }, explanation);

const gf = (prompt, text, blanks, explanation = '') =>
  ex('gapFilling', prompt, { text, blanks }, explanation);

module.exports = {
  A1: [
    mc('Which of the following best defines methodology?',
      ['A scientific study of teaching methods', 'A type of textbook', 'A grammar exercise', 'A school subject'],
      0, 'Methodology is the systematic study of how methods are designed and applied.'),
    tf('Decide:', 'Methodology and pedagogy mean exactly the same thing.', false,
      'Pedagogy is the general art of teaching; methodology focuses on specific subject teaching.'),
    ma('Match each term to its definition',
      [
        { left: 'Approach', right: 'Theoretical view of language and learning' },
        { left: 'Method', right: 'Systematic plan for teaching' },
        { left: 'Technique', right: 'Specific classroom activity' },
        { left: 'Pedagogy', right: 'General art of teaching' },
      ]),
    gf('Complete the sentence:',
      'Methodology draws from ___, psychology, sociology, and ___.',
      ['linguistics', 'neuroscience']),
  ],

  A2: [
    mc('Which is NOT typically considered a teaching aid?',
      ['Flashcards', 'Audio recordings', 'A grammar rule', 'Interactive whiteboard'],
      2, 'A grammar rule is content, not a teaching aid.'),
    tf('Decide:', 'A syllabus is the structured plan that sequences content across a course.', true),
    ma('Match aim types to examples',
      [
        { left: 'Practical aim', right: 'Holding a conversation' },
        { left: 'Educational aim', right: 'Broadening worldview' },
        { left: 'Developing aim', right: 'Improving thinking skills' },
        { left: 'Upbringing aim', right: 'Forming values' },
      ]),
    gf('Fill in the blanks:',
      'A lesson is built around three pillars: ___, content, and ___.',
      ['aims', 'aids']),
  ],

  A3: [
    mc('Which method emphasized reading classical texts and translating them?',
      ['Direct Method', 'Grammar-Translation Method', 'Audio-Lingual Method', 'Communicative Approach'],
      1, 'Grammar-Translation focuses on analysing written texts.'),
    tf('Decide:', 'The Direct Method banned use of the learners\' native language in class.', true),
    ma('Match the method to its main feature',
      [
        { left: 'Audio-Lingual', right: 'Drill and pattern practice' },
        { left: 'Communicative', right: 'Real interaction tasks' },
        { left: 'Grammar-Translation', right: 'Translation of literary texts' },
        { left: 'Direct Method', right: 'Use of L2 only' },
      ]),
    gf('Complete the principle:',
      'The principle of ___ means learning by doing; the principle of ___ adapts teaching to each student.',
      ['activity', 'individualisation']),
  ],

  A4: [
    mc('What does CEFR stand for?',
      ['Common European Framework of Reference', 'Centre for English Foreign Reading', 'Council for European Foreign Relations', 'Cambridge English Final Result'],
      0),
    tf('Decide:', 'A learner at CEFR B2 level is considered a complete beginner.', false,
      'B2 is upper-intermediate; A1 is the beginner level.'),
    ma('Match the test to its scoring system',
      [
        { left: 'IELTS', right: 'Band 1–9' },
        { left: 'TOEFL iBT', right: 'Score 0–120' },
        { left: 'Cambridge FCE', right: 'CEFR B2' },
        { left: 'CEFR', right: 'Six levels A1–C2' },
      ]),
    gf('Fill in the blanks:',
      'The CEFR has six levels: A1, A2, B1, B2, ___, and ___.',
      ['C1', 'C2']),
  ],

  A5: [
    mc('Which movement, led by Henry Sweet, argued for primacy of spoken language?',
      ['Cognitive revolution', 'Reform Movement', 'CLIL', 'Audio-lingualism'],
      1),
    tf('Decide:', 'The Audio-Lingual Method was heavily influenced by behaviourist psychology.', true),
    ma('Match the era to its dominant approach',
      [
        { left: '19th century', right: 'Grammar-Translation' },
        { left: 'Early 20th century', right: 'Direct Method' },
        { left: '1960s', right: 'Cognitive Code' },
        { left: '1980s onward', right: 'Communicative Approach' },
      ]),
    gf('Complete the statement:',
      'Noam ___ shifted attention from behaviour to internal ___ processes in language learning.',
      ['Chomsky', 'mental']),
  ],

  A6: [
    mc('Which alternative approach uses commands and physical movement?',
      ['Silent Way', 'Total Physical Response', 'Suggestopedia', 'Community Language Learning'],
      1),
    tf('Decide:', 'In the Silent Way the teacher speaks as much as possible.', false,
      'On the contrary, the teacher speaks as little as possible to make learners more active.'),
    ma('Match the approach to its founder',
      [
        { left: 'TPR', right: 'James Asher' },
        { left: 'Silent Way', right: 'Caleb Gattegno' },
        { left: 'Suggestopedia', right: 'Georgi Lozanov' },
        { left: 'Community Language Learning', right: 'Charles Curran' },
      ]),
    gf('Fill in the blank:',
      'Suggestopedia uses comfortable seating and ___ music to lower learner ___.',
      ['baroque', 'anxiety']),
  ],

  A7: [
    mc('Roughly how many word families do learners need for fluent reading?',
      ['500', '2,000', '8,000', '50,000'],
      2),
    tf('Decide:', 'Receptive vocabulary is what a learner can actively use in speaking and writing.', false,
      'That is productive vocabulary; receptive is what the learner only recognises.'),
    ma('Match the concept to its meaning',
      [
        { left: 'Collocation', right: 'Words that typically appear together' },
        { left: 'Register', right: 'Formal or informal style' },
        { left: 'Lexical set', right: 'Group of words on a theme' },
        { left: 'Connotation', right: 'Implied emotional meaning' },
      ]),
    gf('Complete the sequence:',
      'A common teaching sequence is ___, Practice, and ___.',
      ['Present', 'Produce']),
  ],

  A8: [
    mc('Which approach states the grammar rule first, then gives examples?',
      ['Inductive', 'Deductive', 'Task-based', 'Lexical'],
      1),
    tf('Decide:', 'In task-based language teaching, learners complete a task first and grammar is addressed afterwards.', true),
    ma('Match the stage of PPP to its activity',
      [
        { left: 'Presentation', right: 'Teacher introduces the structure' },
        { left: 'Practice', right: 'Controlled exercises for accuracy' },
        { left: 'Production', right: 'Free use in communicative tasks' },
        { left: 'Review', right: 'Recycling in later lessons' },
      ]),
    gf('Fill in the blank:',
      'Research on ___ suggests learners must consciously perceive a structure before they can ___ it.',
      ['noticing', 'master']),
  ],

  A9: [
    mc('Two words that differ in one sound only, such as ship/sheep, are called?',
      ['Cognates', 'Minimal pairs', 'Homophones', 'Synonyms'],
      1),
    tf('Decide:', 'The modern goal of pronunciation teaching is to achieve a perfect native accent.', false,
      'The modern goal is intelligibility, not native-like accent.'),
    ma('Match the feature to its category',
      [
        { left: 'Phoneme', right: 'Segmental' },
        { left: 'Word stress', right: 'Suprasegmental' },
        { left: 'Intonation', right: 'Suprasegmental' },
        { left: 'Vowel length', right: 'Segmental' },
      ]),
    gf('Fill in the blank:',
      'The ___ Phonetic Alphabet (IPA) helps learners see what they ___.',
      ['International', 'hear']),
  ],

  A10: [
    mc('Building meaning from individual sounds and words is called?',
      ['Top-down processing', 'Bottom-up processing', 'Skim reading', 'Cognitive bias'],
      1),
    tf('Decide:', 'Authentic materials include hesitations and regional accents.', true),
    ma('Match the listening stage to its purpose',
      [
        { left: 'Pre-listening', right: 'Activate background knowledge' },
        { left: 'While-listening', right: 'Complete focused tasks' },
        { left: 'Post-listening', right: 'Exploit the text further' },
        { left: 'Listening for gist', right: 'Get the main idea' },
      ]),
    gf('Complete the sentence:',
      'Skilled listeners switch between ___-up and ___-down processing.',
      ['bottom', 'top']),
  ],

  A11: [
    mc('Which feature is NOT typical of a communicative task?',
      ['Clear purpose', 'Information gap', 'Focus on meaning', 'Memorising rules'],
      3),
    tf('Decide:', 'Correction during fluency activities should be immediate and constant.', false,
      'Correction is usually delayed so as not to interrupt the interaction.'),
    ma('Match the term to its example',
      [
        { left: 'Accuracy', right: 'Correct verb form' },
        { left: 'Fluency', right: 'Smooth flow of speech' },
        { left: 'Pragmatic competence', right: 'Appropriate apology' },
        { left: 'Turn-taking', right: 'Knowing when to speak' },
      ]),
    gf('Fill in the blanks:',
      'To reduce speaking anxiety, teachers use ___ work and give ___ time before performance.',
      ['pair', 'thinking']),
  ],

  A12: [
    mc('Which type of reading is fast and aims to grasp the overall idea?',
      ['Intensive reading', 'Skimming', 'Scanning', 'Extensive reading'],
      1),
    tf('Decide:', 'Extensive reading typically uses long, difficult academic texts.', false,
      'It uses large quantities of easy, often self-selected material to develop fluency.'),
    ma('Match the reading type to its goal',
      [
        { left: 'Skimming', right: 'Get the main idea' },
        { left: 'Scanning', right: 'Find specific information' },
        { left: 'Intensive', right: 'Study language in detail' },
        { left: 'Extensive', right: 'Read for pleasure and fluency' },
      ]),
    gf('Fill in the blanks:',
      'A typical reading lesson follows pre-, ___-, and ___-reading stages.',
      ['while', 'post']),
  ],

  A13: [
    mc('Which approach treats writing as planning, drafting, revising, and editing?',
      ['Product approach', 'Process approach', 'Audio-lingual', 'Cognitive code'],
      1),
    tf('Decide:', 'Cohesion is achieved through linking words, reference, and lexical chains.', true),
    ma('Match the term to its meaning',
      [
        { left: 'Cohesion', right: 'Surface connection between sentences' },
        { left: 'Coherence', right: 'Logical flow of ideas' },
        { left: 'Genre', right: 'Conventions of a text type' },
        { left: 'Drafting', right: 'Producing a first version' },
      ]),
    gf('Complete the sentence:',
      'Selective error ___ targeting a few patterns is usually more effective than marking ___ mistake.',
      ['correction', 'every']),
  ],

  A14: [
    mc('What is the flipped classroom?',
      ['Class is held outdoors',
       'Content is delivered before class, class time is for practice',
       'Teacher and student switch roles for a day',
       'Furniture is rearranged each lesson'],
      1),
    tf('Decide:', 'CLIL teaches a subject (e.g., science) through the foreign language.', true),
    ma('Match the innovation to its description',
      [
        { left: 'Blended learning', right: 'Mix of face-to-face and online' },
        { left: 'Gamification', right: 'Adding game elements' },
        { left: 'AI chatbot', right: 'Automated conversation partner' },
        { left: 'Adaptive learning', right: 'Difficulty adjusts to learner' },
      ]),
    gf('Fill in the blanks:',
      'Teachers must evaluate new ___ critically; they support but do not ___ the human dimension of teaching.',
      ['tools', 'replace']),
  ],

  A15: [
    mc('Which type of assessment is ongoing and informs the next teaching step?',
      ['Summative', 'Formative', 'Standardized', 'High-stakes'],
      1),
    tf('Decide:', 'A test has high validity if it measures what it claims to measure.', true),
    ma('Match the concept to its definition',
      [
        { left: 'Validity', right: 'Measures what it claims to' },
        { left: 'Reliability', right: 'Gives consistent results' },
        { left: 'Practicality', right: 'Time, cost, feasibility' },
        { left: 'Washback', right: 'Impact of test on teaching' },
      ]),
    gf('Fill in the blanks:',
      'A ___ is a collection of learner work over time; ___ assessment helps learners reflect on their own progress.',
      ['portfolio', 'self']),
  ],
};
