const inquirer = require("inquirer");

const main = async () => {
  let numberOfQuestions;
  let numberOfCorrect = 0;
  let numberOfIncorrect = 0;
  let numberOfInvalid = 0;

  const getNumberOfQuestions = () => {
    //ask how many questions are on the worksheet
    inquirer
      .prompt([
        {
          message: "How many questions are there?",
          name: "numberOfQuestions",
          type: "number",
        },
      ])
      .then(async (answers) => {
        //if answer is not a number or isn't greater than 0, ask again via recursion
        if (
          isNaN(answers.numberOfQuestions) ||
          answers.numberOfQuestions == 0
        ) {
          console.log("Please supply a number greater than 0");
          return getNumberOfQuestions();
        }

        numberOfQuestions = answers.numberOfQuestions;
        await askQuestions(numberOfQuestions);
        await results();
      });
  };

  //loop through the amount of questions to ask each question
  //input: int
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

  //determine whether the answer is invalid, incorrect, or correct
  //input: object returned by inquirer
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

  //show results of the worksheet
  const results = async () => {
    console.log(`Number of total correct: ${numberOfCorrect}`);
    console.log(`Number of total incorrect: ${numberOfIncorrect}`);
    console.log(`Number of total invalid: ${numberOfInvalid}`);
    return;
  };

  getNumberOfQuestions();
};

main();
