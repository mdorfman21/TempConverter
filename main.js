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
            message: "Select Input Units",
            name: "inputUnits",
            type: "rawlist",
            choices: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"],
          },
          {
            message: "Select Target Units",
            name: "targetUnits",
            type: "rawlist",
            choices: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"],
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
  const solveQuestion = ({
    inputTemp,
    studentResponse,
    inputUnits,
    targetUnits,
  }) => {
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

    if (inputUnits == targetUnits) {
      isCorrect(inputTempToFloat, studentResponseToFloat);
    }

    //determines which formula to use based on the input units(type: string) and target units(type: string)
    switch (inputUnits) {
      case "Fahrenheit":
        switch (targetUnits) {
          case "Celsius":
            isCorrect(kToC(fToK(inputTempToFloat)), studentResponseToFloat);
            break;
          case "Kelvin":
            isCorrect(fToK(inputTempToFloat), studentResponseToFloat);
            break;
          case "Rankine":
            isCorrect(kToR(fToK(inputTempToFloat)), studentResponseToFloat);
            break;
        }
        break;
      case "Celsius":
        switch (targetUnits) {
          case "Fahrenheit":
            isCorrect(kToF(cToK(inputTempToFloat)), studentResponseToFloat);
            break;
          case "Kelvin":
            isCorrect(cToK(inputTempToFloat), studentResponseToFloat);
            break;
          case "Rankine":
            isCorrect(kToR(cToK(inputTempToFloat)), studentResponseToFloat);
            break;
        }
        break;
      case "Kelvin":
        switch (targetUnits) {
          case "Celsius":
            isCorrect(kToC(inputTempToFloat), studentResponseToFloat);
            break;
          case "Fahrenheit":
            isCorrect(kToF(inputTempToFloat), studentResponseToFloat);
            break;
          case "Rankine":
            isCorrect(kToR(inputTempToFloat), studentResponseToFloat);
            break;
        }
        break;
      case "Rankine":
        switch (targetUnits) {
          case "Celsius":
            isCorrect(kToC(rToK(inputTempToFloat)), studentResponseToFloat);
            break;
          case "Kelvin":
            isCorrect(rToK(inputTempToFloat), studentResponseToFloat);
            break;
          case "Fahrenheit":
            isCorrect(kToF(rToK(inputTempToFloat)), studentResponseToFloat);
            break;
        }
        break;
      default:
        numberOfInvalid++;
        return console.log("There was an error with the program");
    }
  };

  //compares the calculated answer to the student response
  //input: int
  const isCorrect = (result, studentResponseToFloat) => {
    if (Math.round(result) == Math.round(studentResponseToFloat)) {
      numberOfCorrect++;
      return console.log("Answer is correct");
    } else {
      numberOfIncorrect++;
      return console.log("Answer is incorrect");
    }
  };

  //fahrenheit to kelvin
  //input: int
  const fToK = (inputTemp) => {
    const result = ((inputTemp - 32) * 5) / 9 + 273.15;
    console.log(result, "should be the result before rounding");
    return result;
  };

  //celsius to kelvin
  //input: int
  const cToK = (inputTemp) => {
    const result = inputTemp + 273.15;
    console.log(result, "should be the result before rounding");
    return result;
  };

  //rankine to kelvin
  //input: int
  const rToK = (inputTemp) => {
    const result = inputTemp / 1.8;
    console.log(result, "should be the result before rounding");
    return result;
  };

  //kelvin to fahrenheit
  //input: int
  const kToF = (inputTemp) => {
    const result = ((inputTemp - 273.15) * 9) / 5 + 32;
    console.log(result, "should be the result before rounding");
    return result;
  };

  //kelvin to celsius
  //input: int
  const kToC = (inputTemp) => {
    const result = inputTemp - 273.15;
    console.log(result, "should be the result before rounding");
    return result;
  };

  //kelvin to rankine
  //input: int
  const kToR = (inputTemp) => {
    const result = inputTemp * 1.8;
    console.log(result, "should be the result before rounding");
    return result;
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
