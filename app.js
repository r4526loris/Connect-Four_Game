// $(document).ready(function(){

  // // PLAYER NAMES ARE 'TONY' --> red AND 'PAUL' --> green
  // // Settings - varible declarations
  var columns = 7;
  var rows = 6;
  var playerTonyTurn = true;
  var lastPlayedPawn = {};
  var endMatch = false;


  // // DOM references
  var $gameContainer = $("#game-container");
  var $messageBox = $(".message-box");
  var $inputFieldTonyName = $("#input-tony-name");
  var $inputFieldPaulName = $("#input-paul-name");



  // // Helper functions

  // create 'Cell' function constructor
  function Cell(columnNumber,rowNumber){
    this.col = columnNumber;
    this.row = rowNumber;
    this.filled = false;
    this.tonyPawn = false;
    this.paulPawn = false;
  };

  // when clicking on a 'pawn', get back its corresponding 'Cell' instance
  // P.S. method to be called on the Constructor itself 'Cell.prototype.getCellInstance()'
  Cell.prototype.getCellInstance = function(pawnDOMElement){
    var pawn$Element;
    var row;
    var col;
    // first check if clicked on a pawn itself or on the board
    if($(pawnDOMElement).hasClass("board-cell")){
      pawn$Element = $(pawnDOMElement);
    } else {
      pawn$Element = $(pawnDOMElement).parent();
    };
    // create list of classes related to the clicked element
    var elementClassList = pawn$Element.attr("class").split(" ");
    // retrieve the clicked row and column clicked (as number)
    elementClassList.forEach(function(className){
      if(className.indexOf("row-")===0){
        row = className.substr(-1);
      } else if(className.indexOf("col-")===0) {
        col = className.substr(-1);
      }
    });
    // we retrieved row and column clicked, now return the correct instance back
    return tableCells["c"+col+"r"+row];
  } //end 'getCellInstance'


  // get back the corresponding jQuery DOM element of the instance itself
  Cell.prototype.get$DOMCell = function(){
    var searchedClassName = ".row-" + this.row + ".col-" + this.col;
    return $gameContainer.children(searchedClassName);
  };

  // get back the corresponding pawn jQuery DOM element of the instance itself
  Cell.prototype.get$DOMPawn = function(){
    return this.get$DOMCell().children();
  };


  // add a pawn when clicking on a column of '$gameContainer'
  // arguments are DOMElement(usually 'e.target') and the player (boolean, true if tony playing)
  // function fill the pawn in DOM and update the corresponding 'Cell' instance
  function addPawn(DOMElement,tonyTurn){
    // retrieve correct instance of 'Cell'
    var clickedCell = Cell.prototype.getCellInstance(DOMElement);

    // check for first empty fill starting from below. Then fill it and update its instance.
    // if no empty cells, return false --> so can handle it.
    for(var i=0;i<rows;i++){
      if(!tableCells["c"+clickedCell.col+"r"+i].filled){
        var firstEmptyCell = tableCells["c"+clickedCell.col+"r"+i];

        // fill corresponding DOM element (of 'firstEmptyCell') and update instance with new data
        if(tonyTurn){
          firstEmptyCell.get$DOMPawn().addClass("pawn-tony");
          firstEmptyCell.tonyPawn = true;
        } else {
          firstEmptyCell.get$DOMPawn().addClass("pawn-paul");
          firstEmptyCell.paulPawn = true;
        };
        firstEmptyCell.filled = true;
        // break the loop if an empty cell was found, and exit the function
        return true;
      };
    }
    // if 'for' loop ended without founding an empty cell, means all column is filled, so we return false --> then we can handle it outside
    return false;
  }; // end 'addPawn()'


  // check for 4 pawns in a row
  // 'true' --> checking for player tony
  // 'false' --> checking for player paul
  function rowWin(tonyTurn){
    var player;
    tonyTurn ? player="tonyPawn" : player="paulPawn";
    var counter=0;
    for(var r=0;r<rows;r++){
      for(var c=0;c<columns;c++){
        if(tableCells["c"+c+"r"+r][player]){
          counter += 1;
          if(counter>=4){
            //break the loop and return true
            console.log("row win!");
            return true;
          }
        } else {
          counter = 0;
        }
      }
      // reset the counter for a new row check
      counter = 0;
    }
  } // end 'rowWin()'


  // check for 4 pawns in a column
  // 'true' --> checking for player tony
  // 'false' --> checking for player paul
  function colWin(tonyTurn){
    var player;
    tonyTurn ? player="tonyPawn" : player="paulPawn";
    var counter=0;
    for(var c=0;c<columns;c++){
      for(var r=0;r<rows;r++){
        if(tableCells["c"+c+"r"+r][player]){
          counter += 1;
          if(counter>=4){
            //break the loop and return true
            console.log("column win!");
            return true;
          }
        } else {
          counter = 0;
        }
      }
      // reset the counter for a new row check
      counter = 0;
    }
  } // end 'colWin()'


  // check for 4 pawns in right diagonal
  // 'true' --> checking for player tony
  // 'false' --> checking for player paul
  function rightDiagonalWin(tonyTurn){
    var player;
    tonyTurn ? player="tonyPawn" : player="paulPawn";

    // check for all pawns except last on the table, since starting there will be impossible to make a diagonal
    for(var r=0;r<rows-3;r++){
      for(var c=0;c<columns-3;c++){
        // check for 4 adjacent pawns
        if(tableCells["c"+c+"r"+r][player] && tableCells["c"+(c+1)+"r"+(r+1)][player] && tableCells["c"+(c+2)+"r"+(r+2)][player] && tableCells["c"+(c+3)+"r"+(r+3)][player]){
          //break the loop and return true
          console.log("diagonal win!");
          return true;
        }

      }
    }
  } // 'end rightDiagonalWin()'


  // check for 4 pawns in left diagonal
  // 'true' --> checking for player tony
  // 'false' --> checking for player paul
  function leftDiagonalWin(tonyTurn){
    var player;
    tonyTurn ? player="tonyPawn" : player="paulPawn";

    // check for all pawns except last on the table, since starting there will be impossible to make a diagonal
    for(var r=(rows-1);r>2;r--){
      for(var c=0;c<columns-3;c++){
        // check for 4 adjacent pawns
        if(tableCells["c"+c+"r"+r][player] && tableCells["c"+(c+1)+"r"+(r-1)][player] && tableCells["c"+(c+2)+"r"+(r-2)][player] && tableCells["c"+(c+3)+"r"+(r-3)][player]){
          //break the loop and return true
          console.log("diagonal win!");
          return true;
        }

      }
    }
  } // 'end leftDiagonalWin()'


  // check for Tony win
  function checkTonyWin(){
    if(rowWin(true) || colWin(true) || rightDiagonalWin(true) || leftDiagonalWin(true)){
      // Retrieve player's name from input field, if <input> empty just print 'Red'
      var tonyName;
      $inputFieldTonyName.val() ? tonyName = $inputFieldTonyName.val() : tonyName = "Red";
      // Inform users that Tony won
      $messageBox.html("<h2 class='message'>" + tonyName + " won this match!</h2>");
      // end the game
      endMatch = true;
    }
  }

  // check for Paul win
  function checkPaulWin(){
    if(rowWin(false) || colWin(false) || rightDiagonalWin(false) || leftDiagonalWin(false)){
      // Retrieve player's name from input field, if <input> empty just print 'Green'
      var paulName;
      $inputFieldTonyName.val() ? paulName = $inputFieldPaulName.val() : paulName = "Green";
      // Inform users that Tony won
      $messageBox.html("<h2 class='message'>" + paulName + " won this match!</h2>");
    }
  }


  // as function name said..
  function changePlayerTurn(){
    // invert 'playerTonyTurn' boolean flag
    playerTonyTurn = !playerTonyTurn;
    // visually change CSS classes on <input> fields for player names
    $inputFieldTonyName.toggleClass("player-tony-field");
    $inputFieldPaulName.toggleClass("player-paul-field");
  }


  // // PROGRAM START


  // // Create 'tableCells' object with all properties of cells
  // object containing all instances of 'Cell'
  var tableCells = {};
  for(var c=0;c<columns;c++){
    for(var r=0;r<rows;r++){
      tableCells["c"+c+"r"+r] = new Cell(c,r);
    }
  }


  // // Create board programmatically
  // Add columns
  for(var i=rows-1;i>=0;i--){
    // Add cells
    for(var j=0;j<columns;j++){
      var $newCell = $("<div></div>");
      $newCell.addClass("board-cell row-"+i + " col-"+j);
      var $newInnerCircle = $("<div></div>");
      $newInnerCircle.addClass("pawn");
      $newInnerCircle.appendTo($newCell);
      $newCell.appendTo($gameContainer);
    }
  }



  // // Add 'click' eventListener on entire board to fill the '.pawn'
  $gameContainer.click(function(e){
    // invoke 'addPawn()' to fill first empty cell in column
    addPawn(e.target,playerTonyTurn);

    // check players for winning
    playerTonyTurn ? checkTonyWin() : checkPaulWin();

    // change player's turn if game hasn't ended
    if(!endMatch){
      changePlayerTurn();
    }

    //?? TO IMPLEMENT: if all column filled, 'addPawn()' returns false --> add message <div> elsewhere to inform user

  }); //end '$gameContainer.click()'


// }); //end or '$document.ready()'


//write function for changing turn
