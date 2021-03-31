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
}
