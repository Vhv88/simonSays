let isGameStarted = false;
let buttonColours = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userClickPattern = [];
let currentLevel = 0;

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    counter = 0;
    setTimeout(function () {
      if (counter > 1) {
        showingPattern = true; // Indicar que se está mostrando el patrón
        showGamePattern(); // Muestra los colores del patrón del juego
        setTimeout(function () {
          showingPattern = false; // Indicar que se ha completado la muestra del patrón
          nextSequence(); // Llama a nextSequence después de mostrar los colores
        }, gamePattern.length * 150); // Asegura que nextSequence se llame después de mostrar los colores
      } else {
        nextSequence(); // Llama a nextSequence directamente sin mostrar el patrón en el nivel 1
      }
    }, 400);
  }
}

function startOver() {
  isGameStarted = false;
  currentLevel = 0;
  gamePattern = [];
  userClickPattern = [];
  counter = 1;
  $("#level-title").empty();
  $("#level-title").html(
    "<h1 class='game-over-text'>GAME OVER!</h1><br><br><h2>Press any key to Restart</h2>"
  );
}

function checkAnswer() {
  if (userClickPattern[currentLevel] === gamePattern[currentLevel]) {
    console.log("Success");
    if (currentLevel === gamePattern.length - 1) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    $("body").addClass("game-over");
    setTimeout(() => {
      $("body").removeClass("game-over");
    }, 210);
    startOver();
  }
}

function nextSequence() {
  currentLevel = 0;
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Reproducir el sonido y aplicar la clase .chosen
  playSound(randomChosenColour);
  $("#" + randomChosenColour).addClass("pressedbyMachine");

  // Quitar la clase .chosen después de 150 milisegundos
  setTimeout(function () {
    $("#" + randomChosenColour).removeClass("pressedbyMachine");
  }, 150);

  counter++;
  $("h1").text("Level " + counter);
  userClickPattern = [];
}

let greenAudio = new Audio("./sounds/green.mp3");
let redAudio = new Audio("./sounds/red.mp3");
let yellowAudio = new Audio("./sounds/yellow.mp3");
let blueAudio = new Audio("./sounds/blue.mp3");

let counter = 1;

function typeWriter(text, element, index, interval, callback) {
  if (index < text.length) {
    $(element).append(text[index++]);
    setTimeout(function () {
      typeWriter(text, element, index, interval, callback);
    }, interval);
  } else if (callback) {
    callback();
  }
}

function showGamePattern() {
  let i = 0;
  const interval = 150; // Intervalo entre la visualización de colores en milisegundos
  const duration = 100; // Duración de la iluminación en milisegundos

  function showNextColor() {
    if (i < gamePattern.length) {
      const color = gamePattern[i];
      setTimeout(function () {
        // Ilumina el botón
        $("#" + color).addClass("pressedbyMachine");
        setTimeout(function () {
          // Revierte la iluminación
          $("#" + color).removeClass("pressedbyMachine");
          // Llama recursivamente para mostrar el siguiente color
          showNextColor();
        }, duration); // Revierte la iluminación después de la duración
      }, interval * i); // Aplica el intervalo multiplicado por la posición
      i++;
    } else {
      // Después de mostrar toda la secuencia, llama a nextSequence
      setTimeout(function () {
        nextSequence();
      }, interval);
    }
  }

  showNextColor();
}

function endGame() {
  isGameStarted = false;
  // ... Código para terminar el juego ...
  gamePattern = [];
  $("#level-title").empty();
  typeWriter("Game Over!", "#level-title", 0, 100, function () {
    $("#level-title").append("<br><br>");
    typeWriter("Press any key to Restart", "#level-title", 0, 100, null);
  });
}

// Al cargar la página, se muestra el mensaje inicial
$(document).ready(function () {
  $("#level-title").text("Press any key to Start");

  // Evento al presionar una tecla para iniciar el juego
  $(document).keydown(function () {
    if (!isGameStarted) {
      startGame();
    }
  });

  // Manejo de clics en botones de colores
  $("#green, #red, #yellow, #blue").click(function () {
    if (isGameStarted) {
      let userChosenColour = this.id;
      userClickPattern.push(userChosenColour);
      $(this).addClass("choosen");
      playSound(userChosenColour);
      checkAnswer();
      currentLevel++;
      setTimeout(() => {
        $(this).removeClass("choosen");
      }, 125);
    }
  });

  $("button").click(function (event) {
    if (isGameStarted) {
      let userChosenColour = this.id;
      userClickPattern.push(userChosenColour);
      checkAnswer();
    }
  });
});

function playSound(color) {
  switch (color) {
    case "green":
      greenAudio.play();
      break;
    case "red":
      redAudio.play();
      break;
    case "yellow":
      yellowAudio.play();
      break;
    case "blue":
      blueAudio.play();
      break;
  }
}
