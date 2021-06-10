const inquirer = require("inquirer");

const main = async () => {
  let numberOfQuestions;
  let numberOfCorrect = 0;
  let numberOfIncorrect = 0;
  let numberOfInvalid = 0;

  const getNumberOfQuestions = () => {
    inquirer
      .prompt([
        {
          message: "How many questions are there?",
          name: "numberOfQuestions",
          type: "number",
        },
      ])
      .then(async (answers) => {
        numberOfQuestions = answers.numberOfQuestions;
        await askQuestions(numberOfQuestions);
        await results();
      });
  };

  const askQuestions = async (questions) => {
    for (i = 0; i < questions; i++) {
      await inquirer
        .prompt([
          { message: "Input Temperature", name: "inputTemp", type: "text" },
          {
            message: "Select Target Units",
            name: "targetUnits",
            type: "rawlist",
            choices: ["Kelvin", "Celsius", "Fahrenheit", "Rankine"],
          },
          {
            message: "Student Response",
            name: "studentResponse",
            type: "text",
          },
        ])
        .then((answers) => {
          solveQuestion(answers);
        });
    }
  };

  const solveQuestion = ({ inputTemp, studentResponse }) => {
    const inputTempToFloat = parseFloat(inputTemp);
    const studentResponseToFloat = parseFloat(studentResponse);

    if (isNaN(inputTempToFloat)) {
      numberOfInvalid++;
      return console.log("Input temp is invalid");
    }

    if (isNaN(studentResponseToFloat)) {
      numberOfIncorrect++;
      return console.log("Answer is incorrect");
    }

    if (Math.round(inputTempToFloat) == Math.round(studentResponseToFloat)) {
      numberOfCorrect++;
      return console.log("Answer is correct");
    } else {
      numberOfIncorrect++;
      return console.log("Answer is incorrect");
    }
  };

  const results = async () => {
    console.log(`Number of total correct: ${numberOfCorrect}`);
    console.log(`Number of total incorrect: ${numberOfIncorrect}`);
    console.log(`Number of total invalid: ${numberOfInvalid}`);
    return;
  };

  getNumberOfQuestions();
};

main();
