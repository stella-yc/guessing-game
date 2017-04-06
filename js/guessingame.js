function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function newGame() {
  return new Game();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
  if(num < 1 || num > 100 || typeof num !== "number") {
    throw "That is an invalid guess.";
  }
  this.playersGuess = num;
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
  if(this.playersGuess === this.winningNumber) {
    $('#subtitle').text('Hit Reset to play again');
    $('#submit, #hint').prop({disabled: true});
    return "You Win!";
  } else {

      if(this.isLower()) {
        $('#subtitle').text('Guess Higher!');
      } else {
        $('#subtitle').text('Guess Lower!');
      }

      if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return "You have already guessed that number.";
      }
    else {
      this.pastGuesses.push(this.playersGuess);
      if(this.pastGuesses.length === 5) {
        $('#subtitle').text('Hit Reset to play again');
        $('#submit, #hint').prop({disabled: true});
        return "You Lose, the number was " + this.winningNumber;
      }
      else {
          var diff = this.difference();
          if(diff < 10) return "You\'re burning up!";
          else if(diff < 25) return "You\'re lukewarm.";
          else if(diff < 50) return "You\'re a bit chilly.";
          else if(diff < 100) return "You\'re ice cold!";

      }
    }
  }
}

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}

function shuffle(array) {
  var m = array.length, i, t;
  while(m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

$(document).ready(function() {
  var game = newGame();

  function submitGuess() {
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    var verdict = game.playersGuessSubmission(guess);
    $('#title').text(verdict);
    if(verdict !== "You have already guessed that number.") {
      $('.guess-list li:nth-child('+ game.pastGuesses.length +')').text(guess);
      // $(".guess:contains('-')").first().text(guess);
    }
  }

  $('#submit').click(submitGuess);
  $('#player-input').keypress(function(e) {
    var key = e.which;
    if(key === 13) {
      submitGuess();
    }
  });

  $('#reset').click(function() {
    game = newGame();
    $('#title').text("Guessing Game");
    $('#subtitle').text("Guess the number between 1 and 100");
    $('.guess').text('-');
    $('#submit, #hint').prop({disabled: false});
  });

  $('#hint').click(function() {
    var hints = game.provideHint();
    $('#title').text("The winning number is " + hints[0] + ", " + hints[1] + ", " + hints[2]);
  });


});
