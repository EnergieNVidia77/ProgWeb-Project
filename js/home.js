function displayBallots(){
    $.ajax({
      dataType: "json",
      url: "../php/searchBallot.php",
    }).done(function(obj) {
      //console.log(obj)
      for (bal of obj)
          $("#list").append("<tr><td>"+bal.title+"</td><td>"+bal.promoter+"</td><td>"+bal.pr+"%</td><td><button type='button'>Check</button></td></tr>");

    }).fail(function(e) {
      console.log(e);
      $("#message").html("<span class='ko'> Error: network problem </span>");
    });
}

function CreateBallotPageSetup () {
  $(".ballots").empty();
  $(".ballots").append("<h1>Create Ballot :</h1>");

  $("#BallotSetUp").remove();
  $(".content .menu").prepend("<button type='button' id='goBackBtn'>Go back</button>")

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div class='voteTitle'></div>");
  $(".voteTitle").append("<label>Titre du vote : </label>");
  $(".voteTitle").append("<input type='text' id='voteTitle' placeholder='Titre du vote'>");

  $(".optionSection").append("<div class='voteQuestion'></div>");
  $(".voteQuestion").append("<label>Question : </label>");
  $(".voteQuestion").append("<input type='text' id='voteQuestion' placeholder='Question ?'>");

  $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");

  $("#BtnWrapper").append("<button type='button' id='confirmVoteBtn'>Confirm</button>");
  $("#BtnWrapper").append("<button type='button' id='addChoiceBtn' onclick='addOptionItem()'>Add choice</button>");

}

function addOptionItem(){
  let nbChoice = document.getElementById('optionItem').children.length + 1;
  if(nbChoice > 1){
    nbChoice = Math.round(nbChoice / 2);
  }
  if(nbChoice < 8){
    $(".optionItem").append("<label>Choix " + nbChoice + ": </label> <input type='text' id='optionItem"+ nbChoice +"' placeholder='Choix "+ nbChoice +"'>");
  }
  if(nbChoice == 8){
    $(".optionItem").append("<label>Choix " + nbChoice + ": </label> <input type='text' id='optionItem"+ nbChoice +"' placeholder='Choix "+ nbChoice +"'>");
    $('#addChoiceBtn').prop('disabled', true);
  }
}