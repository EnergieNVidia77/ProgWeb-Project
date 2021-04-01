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
  $("main").empty();
  $("main").append("<h1>Create Ballot :</h1>");

  $("main").append("<div class='voteTitle'></div>");
  $(".voteTitle").append("<label>Titre du vote : </label>");
  $(".voteTitle").append("<input type='text' id='voteTitle' placeholder='Titre du vote'>");

  $("main").append("<div class='voteQuestion'></div>");
  $(".voteQuestion").append("<label>Question : </label>");
  $(".voteQuestion").append("<input type='text' id='voteQuestion' placeholder='Question ?'>");

}

function addOptionItem(nbChoice){
  $("main").append("<div class='optionItem'></div> <label>Choix " + nbChoice+1 + ": </label> <input type='text' id='optionItem' placeholder='Choix "+ nbChoice+1 +"'>");
}