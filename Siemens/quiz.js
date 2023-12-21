
console.log('Script loaded')
let currentQuestionNumber = 0;
let score = 0;
let currentQuestionAnswer = null;

// We make a POST request to reset the selected question IDs when the page loads
// We fetch a new question so when we load the page it already shows a question
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/reset', { method: 'POST' })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error resetting selected question IDs:', error));
  fetchNewQuestion();

});


// submitQuiz represents the functionality that is triggered when we press the button
// It checks if the question is out of bounds and returns if it is
// It checks the the answer is correct in order the update the score
// It fetches the next question
function submitQuiz() {

  if (currentQuestionNumber == 50) {
    alert('Quiz completed! You reached the end.');
    return;
}
    // We select the whole radio button and it's attributes

  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    // Checking if the answer is correct
  if (selectedAnswer) {
      const isCorrect = checkAnswer(selectedAnswer.value);
      console.log(selectedAnswer.value);
      
      if (isCorrect) {
          score++;
      }

      
      // We update the score
      const scoreElement = document.getElementById('score');
      scoreElement.textContent = `Score: ${score}`;
      console.log(score);

      fetchNewQuestion();
  } else {
      alert('Please select an answer before submitting.');
  }
}

// Function checking the selected answer against the correct answer
function checkAnswer(selectedAnswer) {
  
  console.log(`${selectedAnswer === currentQuestionAnswer}`);
  if (selectedAnswer === currentQuestionAnswer)
      return true;
  return false; 
}
// Fetches the response from the server
// Updates the html
async function fetchNewQuestion() {
    try {
      
        const response = await fetch('/api/question');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }


        currentQuestionNumber++;
        
        //We update the q number
        
        const counterElement = document.getElementById('question-number');
        counterElement.textContent = `Question ${currentQuestionNumber}/50:`;


        const question = await response.json();
        currentQuestionAnswer = question.correct_option;

        //We update the question text
        const questionElement = document.getElementById('question-container');
        questionElement.textContent = `${question.question}`;
        
        // Here we update just the visual of the answer
        const answer1 = document.getElementById('answer1');
        const answer2 = document.getElementById('answer2');
        const answer3 = document.getElementById('answer3');
        const answer4 = document.getElementById('answer4');
        
        answer1.textContent = question.option1;
        answer2.textContent = question.option2;
        answer3.textContent = question.option3;
        answer4.textContent = question.option4;

        // Here we update the value behind the buttons

        const btnAswer1 = document.getElementById('btnAnswer1');
        const btnAswer2 = document.getElementById('btnAnswer2');
        const btnAswer3 = document.getElementById('btnAnswer3');
        const btnAswer4 = document.getElementById('btnAnswer4');

        btnAswer1.value = question.option1;
        btnAswer2.value = question.option2;
        btnAswer3.value = question.option3;
        btnAswer4.value = question.option4;




    } catch (error) {
        console.error(error);
        alert('Error fetching question. Please check console for details.');
    }
}
