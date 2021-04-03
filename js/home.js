function displayBallots(){
    $.ajax({
      dataType: "json",
      url: "../php/searchBallot.php",
    }).done(function(obj) {
      for (bal of obj){
          $("#list").append("<tr><td>"+bal.title+"</td><td>"+bal.promoter+"</td><td>"+bal.pr+"</td><td><button id='checkBtn' value='"+ bal.voteID +"' >Check</button></td></tr>");
      }

    }).fail(function(e) {
      console.log(e);
      $("#message").html("<span class='ko'> Error: network problem </span>");
    });
}

//Begin the vote creation

function CreateBallotPageSetup () {
  $(".ballots").empty();
  $(".ballots").append("<h1>Create Ballot :</h1>");

  $("#BallotSetUp").remove();
  $(".content .menu").prepend("<button type='button' id='goBackBtn' onclick='homePageSetup()'>Go back</button>")

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div class='voteTitle'></div>");
  $(".voteTitle").append("<label>Title of the vote : </label>");
  $(".voteTitle").append("<input type='text' id='voteTitle' placeholder='Title of the vote'>");

  $(".optionSection").append("<div class='voteQuestion'></div>");
  $(".voteQuestion").append("<label>Question : </label>");
  $(".voteQuestion").append("<input type='text' id='voteQuestion' placeholder='Question ?'>");

  $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");

  $("#BtnWrapper").append("<button type='button' id='nextStepBtn' onclick='nextStepPopup()'>Next step</button>");
  $("#BtnWrapper").append("<button type='button' id='addChoiceBtn' onclick='addOptionItem()'>Add choice</button>");

}

//Add choices to the vote

function addOptionItem(){
  let nbChoice = document.getElementById('optionItem').children.length + 1;
  if(nbChoice > 1){
    nbChoice = Math.round(nbChoice / 2);
  }
  if(nbChoice < 8){
    $(".optionItem").append("<label>Choice " + nbChoice + ": </label> <input type='text' id='optionItem"+ nbChoice +"' placeholder='Choice "+ nbChoice +"'>");
  }
  if(nbChoice == 8){
    $(".optionItem").append("<label>Choice " + nbChoice + ": </label> <input type='text' id='optionItem"+ nbChoice +"' placeholder='Choice "+ nbChoice +"'>");

    //Disabeling button
    $('#addChoiceBtn').prop('disabled', true);
  }
}

//Go back to the home page from the vote creation screen

function homePageSetup() {
    $(".content").empty();

    $(".content").append("<div class='menu'></div>");
    $(".menu").append("<button id='BallotSetUp' type='button' onclick='CreateBallotPageSetup()'>Create ballot</button>");
    $(".menu").append("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");

    $(".content").append("<div class='ballots'></div>");
    $('.ballots').append("<h1>Ballots</h1>");
    $('.ballots').append(" <table id ='list'></table>");
    $('#list').append("<tr><th>Title</th><th>Promoter</th><th>Participation rate</th></tr>");
    displayBallots();
}

function logOut() {
  console.log("You've logged out !");
  window.location = "./login.html";
}


 // ---------> Don't forget to add onclick='firstStepSaveInfoVote()' <---------

function nextStepPopup() {
  let confirmed = confirm("If you click OK you will not be able to stop the creation of the vote anymore. Are you sure to continue ?");
  if(confirmed == true){
    firstStepSaveInfoVote()
  }
}

//Register and save all the infos on the create ballot first page

function firstStepSaveInfoVote() {
  let nbChoice = document.getElementById('optionItem').children.length + 1;
  if(nbChoice > 1){
    nbChoice = Math.round(nbChoice / 2) - 1;
  }
  let allOptionItem = document.getElementById('optionItem').children;

  let arrayOfChoice = [];

  for (input of allOptionItem){
    if(input.tagName === "INPUT"){
      let hTag = "#";
      let id_raw = String(input.id);
      let id = hTag.concat(id_raw);
      let val = $(id).val();
      arrayOfChoice.push(val);
    }
  }

  let voteTitle = $('#voteTitle').val();
  let voteQuestion = $('#voteQuestion').val();

  $.ajax({
    method: "POST",
    dataType: "json",
    url: "../php/createBallot.php",
    data: {
      "voteTitle": voteTitle,
      "voteQuestion": voteQuestion,
      "arrayOfChoice": arrayOfChoice
    }
  }).done(function (e) {
    if(e == '1'){
      console.log("Everything went fine");
      linkListToLastVotePageSetup();
    }
  }).fail(function (e) {
    console.log("Error");
  });
}

function linkListToLastVotePageSetup() {

  $('#goBackBtn').prop('disabled', true);
  $('.logout-btn').prop('disabled', true);

  $('.optionSection').empty();

  $('.optionSection').append("<div class='optionItem'></div>");
  $('.optionItem').append("<label>Name of the person : </label>");
  $('.optionItem').append("<input type='text' id='personName' placeholder='User ID' onchange='checkPersonUsrID()'>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");
  $("#BtnWrapper").append("<button type='button' id='confirmVote' onclick='homePageSetup()'>Confirm</button>");
  $("#BtnWrapper").append("<button type='button' id='addPerson' onclick='linkPersonToLastVote()' disabled>Add person</button>");

}

function checkPersonUsrID() {
  let personID = $("#personName").val();
  $.ajax({
    method: "POST",
    url: "../php/checkUsrID.php",
    data: {
      "usrID": personID
    }
  }).done(function (e) {
    if(e == 0){
      $("#personName").css("background", "lightgreen");
      $('#addPerson').prop('disabled', false);
    }else{
      $("#personName").css("background", "red");
      $('#addPerson').prop('disabled', true);
    }
  }).fail(function (e) {
    console.log(e);
  });
}

//Link the list of voters to the last vote registered in the logs directory

function linkPersonToLastVote() {
  $.ajax({
    dataType: "json",
    url: "../php/linkListWithVote.php"
  }).done(function (e) {
    console.log(e);
  }).fail(function (e) {
    console.log(e);
  });
}