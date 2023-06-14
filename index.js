import inquirer from 'inquirer';
import {
  initFunctionsToStreamTypes,
  streamTypes,
  writableConsumerTypes,
  writableImplementorTypes,
  writableStreamQuestionsKeys
} from './prompt/options.js';

const writableStreamQuestions = [
  {
    type: 'list',
    name: writableStreamQuestionsKeys.Consumer,
    message: 'What type of consumer do you want to demo?',
    choices: [
      ...Object.entries(writableConsumerTypes)
        .map(([name, value]) => ({ name, value })),
    ],
    default: writableConsumerTypes.regular,
  },
  {
    type: 'list',
    name: writableStreamQuestionsKeys.Implementor,
    message: 'What type of implementor do you want to demo?',
    choices: [
      ...Object.entries(writableImplementorTypes)
        .map(([name, value]) => ({ name, value }))
    ],
    default: writableImplementorTypes['all-good'],
  },
  {
    type: 'number',
    name:  writableStreamQuestionsKeys.HighWaterMark,
    message: 'What highWaterMark do you want to set?',
    default: 20,
    validate: (value) => {
      if (!Number.isInteger(value)) {
        return 'Please enter an integer';
      }
      if (value < 1) {
        return 'Please enter a number greater than 0';
      }
      return true;
    }
  }
]

const questionsKeys = {
  StreamType: 'streamType',
}

const questions = [
  {
    type: 'list',
    name: questionsKeys.StreamType,
    message: 'What type of stream do you want to demo?',
    choices: Object.entries(streamTypes)
      .map(
        ([name, value]) => ({
          name, value, disabled: initFunctionsToStreamTypes[value] === null
        })
      ),
    default: streamTypes.Writable,
  },
  ...writableStreamQuestions.map(
    (question) => ({
      ...question,
      when: (answers) => answers.streamType === streamTypes.Writable,
    })
  ),
]

try {
  const answers = await inquirer.prompt(questions, {});

  [ ' ---------- ', 'answers:', answers, ' ---------- ' ]
    .forEach((value) => console.log(value));

  const initFunction = initFunctionsToStreamTypes[answers.streamType];

  await initFunction(
    answers[writableStreamQuestionsKeys.Implementor].streamConstructor,
    answers[writableStreamQuestionsKeys.Consumer].controller,
    {
      writableOptions: {
        highWaterMark: answers[writableStreamQuestionsKeys.HighWaterMark]
      }
    }
  );

} catch (error) {
  console.error(error);
}

