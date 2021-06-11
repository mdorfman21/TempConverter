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
            choices: ["Kelvin", "Celsius", "Fahrenheit", "Rankine"],
          },
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
    let concatUnits = inputUnits + targetUnits;
    "Kelvin", "Celsius", "Fahrenheit", "Rankine";
    switch (concatUnits) {
      case "FahrenheitKelvin":
        isCorrect(fToK(inputTempToFloat), studentResponseToFloat);
        break;
      case "CelsiusKelvin":
        isCorrect(cToK(inputTempToFloat), studentResponseToFloat);
        break;
      case "RankineKelvin":
        isCorrect(rToK(inputTempToFloat), studentResponseToFloat);
        break;
      case "KelvinCelsius":
        isCorrect(kToC(inputTempToFloat), studentResponseToFloat);
        break;
      case "KelvinFahrenheit":
        isCorrect(kToF(inputTempToFloat), studentResponseToFloat);
        break;
      case "KelvinRankine":
        isCorrect(kToR(inputTempToFloat), studentResponseToFloat);
        break;
      case "FahrenheitCelsius":
        isCorrect(kToC(fToK(inputTempToFloat)), studentResponseToFloat);
        break;
      case "FahrenheitRankine":
        isCorrect(kToR(fToK(inputTempToFloat)), studentResponseToFloat);
        break;
      case "CelsiusFahrenheit":
        isCorrect(kToF(cToK(inputTempToFloat)), studentResponseToFloat);
        break;
      case "CelsiusRankine":
        isCorrect(kToR(cToK(inputTempToFloat)), studentResponseToFloat);
      case "RankineFahrenheit":
        isCorrect(kToF(rToK(inputTempToFloat)), studentResponseToFloat);
      case "RankineCelsius":
        isCorrect(kToC(rToK(inputTempToFloat)), studentResponseToFloat);
    }
  };

  const isCorrect = (result, studentResponseToFloat) => {
    if (Math.round(result) == Math.round(studentResponseToFloat)) {
      numberOfCorrect++;
      return console.log("Answer is correct");
    } else {
      numberOfIncorrect++;
      return console.log("Answer is incorrect");
    }
  };

  const fToK = (inputTemp) => {
    const result = ((inputTemp - 32) * 5) / 9 + 273.15;
    console.log(result);
    return result;
  };

  const cToK = (inputTemp) => {
    console.log(inputTemp);
    const result = inputTemp + 273.15;
    console.log(result);
    return result;
  };

  const rToK = (inputTemp) => {
    const result = inputTemp / 1.8;
    console.log(result);
    return result;
  };

  const kToF = (inputTemp) => {
    const result = ((inputTemp - 273.15) * 9) / 5 + 32;
    console.log(result);
    return result;
  };

  const kToC = (inputTemp) => {
    const result = inputTemp - 273.15;
    console.log(result);
    return result;
  };

  const kToR = (inputTemp) => {
    const result = inputTemp * 1.8;
    console.log(result);
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
  // fToK(32);
};

main();
