// 20-question entry diagnostic: 5 per direction (attention, memory, logic, criticalThinking).
// Final diagnostic uses the same set so progress can be compared.

const q = (text, direction, options) => ({
  text,
  direction,
  options: options.map((o, i) => ({ text: o, isCorrect: i === 0 })),
});

const ENTRY_QUESTIONS = [
  // ─── ATTENTION (5) ───
  q('Spot the odd one out: cat, dog, bird, table',
    'attention',
    ['table', 'cat', 'dog', 'bird']),
  q('How many times does the letter "a" appear in: "A banana and an apple"?',
    'attention',
    ['Six', 'Four', 'Five', 'Seven']),
  q('Which word is misspelled?',
    'attention',
    ['recieve', 'achieve', 'believe', 'relieve']),
  q('Find the difference: 123456789 vs 123456798',
    'attention',
    ['Last two digits swapped', 'A digit is missing', 'No difference', 'A digit is added']),
  q('Which sequence is in alphabetical order?',
    'attention',
    ['apple, banana, cherry, date', 'banana, apple, date, cherry', 'cherry, date, apple, banana', 'date, banana, cherry, apple']),

  // ─── MEMORY (5) ───
  q('You see this sequence for 3 seconds: 7, 3, 9, 1, 5. What is the third number?',
    'memory',
    ['9', '7', '1', '3']),
  q('Read once: "Red, blue, green, yellow." Which color appeared second?',
    'memory',
    ['Blue', 'Red', 'Green', 'Yellow']),
  q('You hear: "Mary went to the store on Wednesday." On which day did Mary go?',
    'memory',
    ['Wednesday', 'Monday', 'Friday', 'Sunday']),
  q('Memorise: cat, lamp, book, key. Which item was NOT in the list?',
    'memory',
    ['Door', 'Lamp', 'Key', 'Cat']),
  q('Read: "John has 3 apples, 2 oranges, 5 pears." How many pears?',
    'memory',
    ['5', '3', '2', '7']),

  // ─── LOGIC (5) ───
  q('If all roses are flowers, then:',
    'logic',
    ['Some flowers are roses', 'All flowers are roses', 'No flowers are roses', 'Roses are not flowers']),
  q('Complete the sequence: 2, 4, 8, 16, ?',
    'logic',
    ['32', '20', '24', '18']),
  q('If A > B and B > C, then:',
    'logic',
    ['A > C', 'A < C', 'A = C', 'Cannot tell']),
  q('Find the next letter: A, C, E, G, ?',
    'logic',
    ['I', 'H', 'J', 'K']),
  q('Five friends sit in a row. Anna is to the left of Ben. Ben is to the left of Carl. Who is on the far right?',
    'logic',
    ['Carl, if only three friends', 'Anna', 'Ben', 'Cannot tell from given info']),

  // ─── CRITICAL THINKING (5) ───
  q('Which argument contains a flaw?',
    'criticalThinking',
    ['Everyone agrees, so it must be true', 'Studies show X is effective', 'Data confirms the pattern', 'Logic dictates the result']),
  q('A claim says "Eat this food and live to 120." What should you ask first?',
    'criticalThinking',
    ['What evidence supports this?', 'How does it taste?', 'How much does it cost?', 'Where is it sold?']),
  q('Which statement is an opinion, not a fact?',
    'criticalThinking',
    ['Chocolate cake is the best dessert.', 'Water freezes at 0°C.', 'The Earth orbits the Sun.', 'Humans need oxygen to breathe.']),
  q('A study with only 5 participants claims a new diet cures all diseases. The biggest problem is:',
    'criticalThinking',
    ['Sample size is too small', 'Participants were too tall', 'The diet was too cheap', 'The colour of the food']),
  q('"Correlation does not imply causation" means:',
    'criticalThinking',
    ['Two things happening together does not prove one causes the other',
     'Causation and correlation are exactly the same',
     'No statistical claim can ever be true',
     'Correlation is always wrong']),
];

module.exports = { ENTRY_QUESTIONS };
