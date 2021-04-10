//Display all the ballots on the home screen

function displayBallots(){
  $.ajax({
    dataType: "json",
    url: "../php/searchBallot.php",
  }).done(function(obj) {
    for (bal of obj){
      $voting = "Closed";
      if(bal.open=="true") {
        $voting = "Open";
      }
      $("#list").append("<tr><td>"+bal.title+"</td><td>"+bal.promoter+"</td><td>"+Math.round((bal.pr)*100)/100+"%</td><td>"+$voting+"</td><td><button id='checkBtn' value='"+bal.voteID+"' onclick='CreateBallotPageCheck(value)'>Check</button></td></tr>");
    }

  }).fail(function(e) {
    console.log(e);
    $("#message").html("<span class='ko'> Error: network problem </span>");
  });
}

//Set up the page containing the informations of the chosen ballot
function CreateBallotPageCheck (voteID) {
$.ajax({
  method: "POST",
  dataType: "json",
  url: "../php/checkBallots.php",
  data: {
    "voteID": voteID
  }
}).done(function(obj) {
  $(".ballots").empty();
  $(".ballots").append("<h1>"+obj.title+"</h1>");
  $(".ballots").append("<h2>"+obj.question+"</h2>");
  if(obj.open=="true") {
    if(obj.role > 1) {
      $(".ballots").append("<table id ='list'>");
      $("#list").append("<tr><th>Voter</th><th>Made a proxy to</th><th>Proxies of</th></tr>");
      for(voter of obj.voters) {
        $recipient = voter.votedProcuration;
        if($recipient=="NULL") {
          $recipient = "Nobody"
        }
        $proxy = voter.procuration;
        if($proxy.length==0) {
          $proxy = "Nobody";
        }
        $("#list").append("<tr><td>"+voter.userID+"</td><td>"+$recipient+"</td><td>"+$proxy+"</td></tr>");
      }
    }
  } else {
    $(".ballots").append("<table id ='list'>");
    $("#list").append("<tr><th>Response</th><th>In absolute number</th><th>In percentage</th></tr>");
    for(choice of obj.response) {
      $number = 0;
      for(voter of obj.voters) {
        if(voter.voted=="true" && voter.vote==choice) {
          $number = $number + 1;
        }
      }
      $percentage = ($number/obj.voters.length)*100
      $("#list").append("<tr><td>"+choice+"</td><td>"+$number+"</td><td>"+Math.round($percentage*100)/100+"%</td></tr>");
    }
  }

  $('#preMadelistBtn').remove();

  $("#BallotSetUp").remove();

  $(".content .menu").empty();
  $(".content .menu").prepend("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");
  if(obj.role > 1 && obj.open=="true") {
    $(".content .menu").prepend("<button type='button' id='closeBallot' onclick='closeBallot()'>Close Ballot</button>")
  }
  $(".content .menu").prepend("<button type='button' id='goBackBtn' onclick='homePageSetup()'>Go back</button>")

  if(obj.userVote.nbVote > 0 && obj.open=="true") {
    $(".ballots").append("<div class='optionSection'></div>");

    $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");
  
    $(".optionSection").append("<div id='BtnWrapper'></div>");
    $("#BtnWrapper").append("<button type='button' id='vote' value="+voteID+" onclick='CreateVotePage(value)'>Vote</button>");
    if(obj.userVote.votedProcuration=="NULL") {
      $("#BtnWrapper").append("<button type='button' id='makeProxy' onclick='CreateProxyPage()'>Make proxy</button>");
    }
  }
}).fail(function(e) {
  console.log(e);
  $("#message").html("<span class='ko'> Error: network problem </span>");
});
}

//Set up the page with all the vote options of the chosen ballot
function CreateVotePage(voteID) {
$.ajax({
  method: "POST",
  dataType: "json",
  url: "../php/checkBallots.php",
  data: {
    "voteID": voteID
  }
}).done(function(obj) {
  $(".ballots").empty();
  $(".ballots").append("<h1>"+obj.title+"</h1>");
  $(".ballots").append("<h2>"+obj.question+"</h2>");

  $(".ballots").append("<table id ='list'>");
  if(obj.userVote.vote=="NULL") {
    $("#list").append("<br><br><td>-Personal vote : <select id='personal'></select></td>");
    for(choice of obj.response) {
      $("#personal").append("<option value="+choice+">"+choice+"</option>");
    }
  }
  if(obj.userVote.procuration.length > 0) {
    $("#list").append("<br><br><td>-Vote for "+obj.userVote.procuration[0]+" : <select id='first'></select></td>");
    for(voter of obj.voters) {
      if(voter.userID==obj.userVote.procuration[0]) {
        if(voter.vote=="NULL") {
          for(choice of obj.response) {
            $("#first").append("<option value="+choice+">"+choice+"</option>");
          }
        } else {
          $("#first").append("<option value="+voter.vote+">"+voter.vote+"</option>");
        }
      }
    }
  }
  if(obj.userVote.procuration.length > 1) {
    $("#list").append("<br><br><td>-Vote for "+obj.userVote.procuration[1]+" : <select id='second'></select></td>");
    for(voter of obj.voters) {
      if(voter.userID==obj.userVote.procuration[1]) {
        if(voter.vote=="NULL") {
          for(choice of obj.response) {
            $("#second").append("<option value="+choice+">"+choice+"</option>");
          }
        } else {
          $("#second").append("<option value="+voter.vote+">"+voter.vote+"</option>");
        }
      }
    }
  }

  $('#preMadelistBtn').remove();

  $("#BallotSetUp").remove();

  $(".content .menu").empty();
  $(".content .menu").prepend("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");
  $(".content .menu").prepend("<button type='button' id='goBackBtn' value='"+voteID+"' onclick='CreateBallotPageCheck(value)'>Go back</button>");

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");
  $("#BtnWrapper").prepend("<button type='button' id='vote' onclick='vote()'>Confirm vote</button>");
}).fail(function(e) {
  console.log(e);
  $("#message").html("<span class='ko'> Error: network problem </span>");
});
}

//Save the vote in the ballots.json file 
function vote() {
$.ajax({
  method: "POST",
  dataType: "json",
  url: "../php/vote.php",
  data: {
    "personal": $('#personal').val(),
    "first": $('#first').val(),
    "second": $('#second').val(),
  }
}).done(function (obj) {
  CreateBallotPageCheck(obj);
}).fail(function(e) {
  console.log(e);
  $("#message").html("<span class='ko'> Error: network problem </span>");
}); 
}

//Setup the page allowing to make a proxy for the chosen ballot
function CreateProxyPage() {
$.ajax({
  method: "POST",
  dataType: "json",
  url: "../php/checkProxyPage.php"
}).done(function(obj) {
  $(".ballots").empty();
  $(".ballots").append("<h1>"+obj.vote.title+"</h1>");
  $(".ballots").append("<h2>"+obj.vote.question+"</h2>");

  $(".ballots").append("<table id ='list'>");
  $("#list").append("<br><br><td>-Choose the recipient of the proxy : <select id='recipient'></select></td>");
  for(voter of obj.vote.voters) {
    if(voter.procuration.length < 2 && voter.userID!=obj.userID) {
      $("#recipient").append("<option value="+voter.userID+">"+voter.userID+"</option>");
    }
  }
  $("#list").append("<br><br><td>-Choose the response of the proxy : <select id='response'></select></td>");
  $("#response").append("<option value='NULL'>The recipient can choose</option>");
  for(choice of obj.vote.response) {
    $("#response").append("<option value="+choice+">"+choice+"</option>");
  }

  $('#preMadelistBtn').remove();

  $("#BallotSetUp").remove();

  $(".content .menu").empty();
  $(".content .menu").prepend("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");
  $(".content .menu").prepend("<button type='button' id='goBackBtn' value="+obj.voteID+" onclick='CreateBallotPageCheck(value)'>Go back</button>");

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");
  $("#BtnWrapper").prepend("<button type='button' id='proxy' onclick='sendProxy()'>Send the proxy</button>");
}).fail(function(e) {
  console.log(e);
  $("#message").html("<span class='ko'> Error: network problem </span>");
});
}

//Save the informations of the proxy in the ballots.json file
function sendProxy() {
  $.ajax({
    method: "POST",
    dataType: "json",
    url: "../php/sendProxy.php",
    data: {
      "recipient": $('#recipient').val(),
      "response": $('#response').val(),
    }
  }).done(function (obj) {
    CreateBallotPageCheck(obj);
  }).fail(function(e) {
    console.log(e);
    $("#message").html("<span class='ko'> Error: network problem </span>");
  });
}

function closeBallot() {
  $.ajax({
    method: "POST",
    dataType: "json",
    url: "../php/closeBallot.php",
  }).done(function (obj) {
    CreateBallotPageCheck(obj);
  }).fail(function(e) {
    console.log(e);
    $("#message").html("<span class='ko'> Error: network problem </span>");
  });
}

//Begin the vote creation

function CreateBallotPageSetup () {
$(".ballots").empty();
$(".ballots").append("<h1>Create Ballot :</h1>");

$('#preMadelistBtn').remove();
$("#supprPreMadeList").remove();

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

if(nbChoice < 8){
  $(".optionItem").append("<div id='optionWrapper"+ nbChoice +"'></div>");
  $("#optionWrapper"+ nbChoice +"").append("<label>Choice " + nbChoice + " : </label> <input type='text' id='optionItem"+ nbChoice +"' placeholder='Choice "+ nbChoice +"'>");
}
if(nbChoice == 8){
  $(".optionItem").append("<div id='optionWrapper"+ nbChoice+"'></div>");
  $("#optionWrapper"+ nbChoice +"").append("<label>Choice " + nbChoice + ": </label> <input type='text' id='optionItem"+ nbChoice +"' placeholder='Choice "+ nbChoice +"'>");

  //Disabeling button
  $('#addChoiceBtn').prop('disabled', true);
}
}

//Go back to the home page from the vote creation screen

function homePageSetup() {
  $(".content").empty();

  $(".content").append("<div class='menu'></div>");
  $(".menu").append("<button id='BallotSetUp' type='button' onclick='CreateBallotPageSetup()'>Create ballot</button>");
  $(".menu").append("<button id='preMadelistBtn' type='button' onclick='listMakerPageSetup()'>Make a list</button>");
  $(".menu").append("<button id='supprPreMadeList' type='button' onclick='deleteListPageSetup()'>Delete a list</button>");
  $(".menu").append("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");

  $(".content").append("<div class='ballots'></div>");
  $('.ballots').append("<h1>Ballots</h1>");
  $('.ballots').append(" <table id ='list'></table>");
  $('#list').append("<tr><th>Title</th><th>Promoter</th><th>Participation rate</th><th>Voting</th><th></th></tr>");
  displayBallots();
}

function logOut() {
console.log("You've logged out !");
window.location = "./login.html";
}



function nextStepPopup() {
let confirmed = confirm("If you click OK you will not be able to stop the creation of the vote anymore. Are you sure you want to continue ?");
if(confirmed == true){
  firstStepSaveInfoVote();
}
}

//Register and save all the infos on the create ballot first page

function firstStepSaveInfoVote() {
let nbChoice = document.getElementById('optionItem').children.length;

let arrayOfChoice = [];

for(let i = 1; i <= nbChoice; i++){
    let hTag = "#";
    let number = i.toString(); 
    let id_raw = "optionItem";
    let tmp_id = id_raw.concat(number);
    let id = hTag.concat(tmp_id);
    let val = $(id).val();
    arrayOfChoice.push(val);
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
  if(e == 1){
    linkListToLastVotePageSetup();
  }else{
    if(e == 2){
      alert("Please enter a vote title");
    }

    if(e == 3){
      alert("Please enter a vote question");
    }

    if(e == 4){
      alert("A vote without choices is not a vote");
    }

    if(e == 99){
      alert("Oh we have a dictator, good comrade but not here, put at least two choices even if they're the same 😈");
    }
  }
}).fail(function (e) {
  console.log("Error");
});
}

//Set up the HTML for adding persons to the current vote 

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

$(".optionSection").append("<table id='listPerson'></table>")
$("#listPerson").append("<tr><th>Person ID :</th></tr>")

}

//Verify if the user entered in the adding person to vote screen exist on the plaforme

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
let personID = $("#personName").val();
$.ajax({
  method: "POST",
  dataType: "json",
  url: "../php/linkListWithVote.php",
  data: {"personID": personID}
}).done(function (e) {
  if(e == 1){
    let personAdded = $("#personName").val();
    $("#listPerson").append("<tr id='row"+ personAdded +"'><td>"+ personAdded +"</td> <td> <button type='button' id='supprPerson' value='"+ personAdded +"' onclick='supprPerson(value)' >❌</td></tr>");
    $("#personName").val('');
    $("#personName").css("background", "");
    $('#addPerson').prop('disabled', true);
  }else{
    $("#personName").css("background", "");
    alert("That person is already on the list");
  }
}).fail(function (e) {
  console.log(e);
});
}

//Suppression of person in the list of the vote just created

function supprPerson(personID) {
let personID2 = personID;
$.ajax({
  method: "POST",
  url: "../php/supprPersonFromVote.php",
  data: {"personID": personID2}
}).done(function (e) {
  $("#row"+ personID2 +"").remove();
}).fail(function (e) {
  console.log(e);
});
}

//Setup the contructor of pre made list with

function listMakerPageSetup() {
$('#BallotSetUp').remove();
$('#preMadelistBtn').remove();
$("#supprPreMadeList").remove();

$('.menu').prepend("<button type='button' id='goBackBtn' onclick='homePageSetup()'>Go back</button>");

$('.ballots').empty();

$('.ballots').append("<h1>Make your list</h1>");

$('.ballots').append("<div class='listMakerName' style='margin:15px'><div>");
$('.listMakerName').append("<label>Name of the list : </label>");
$('.listMakerName').append("<input type='text' id='listMakerTitle' placeholder='Name of the list' onchange='checkNameOfThelist()'>");

$('.ballots').append("<div class='listMakerUsrID' style='margin:15px'><div>");
$('.listMakerUsrID').append("<label>User ID : </label>");
$('.listMakerUsrID').append("<input type='text' id='listMakerUsrID' placeholder='User ID' onchange='checkNameList()' disabled>");

$('.ballots').append("<div id='BtnWrapperListMaker' style='padding: 3px 3px;border-radius: 5px;margin: 5px;'><div>");
$("#BtnWrapperListMaker").append("<button type='button' id='confirmListBtn' onclick='confirmeList()' disabled>Confirm</button>");
$("#BtnWrapperListMaker").append("<button type='button' id='addPersonTolistBtn' onclick='addPersonTolist()' disabled>Add person</button>");

$(".ballots").append("<div id='upload_zone'></div>");
$("#upload_zone").append("<h3>Choose your json file : </h3>")
$("#upload_zone").append("<input id='file' name='file' type='file'>");
$("#upload_zone").append("<button type='button' id='uploadBtn' onclick='uploadFile()'>Upload</button>");





//$(".ballots").append("<div id='drop_zone' ondragover='dragoverHandler(event);' ondragleave='dragleaveHandler(event);' ondrop='dropHandler(event);'></div>");
//$("#drop_zone").append("<img src='../img/cloud_icon.svg' alt='Cloud icon'>");
//$("#drop_zone").append("<header>Drop your list in json here</header>");

}


function uploadFile() {
console.log("Hello");

let file = document.getElementById('file').files[0];
let filename = file.name;
let extension = filename.split('.').pop().toLowerCase();
if(jQuery.inArray(extension, ['json']) == -1){
  alert("Your file is not a json file");
  $('#file').val('');
}else{
  let formData = new FormData();
  formData.append("file", file);

  $.ajax({
    url:"../php/uploadList.php",
    method: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function(){
      console.log("Success !!");
    }
  })
}
}

//Check if a list has already the name entered

function checkNameOfThelist() {
let listName_raw = $('#listMakerTitle').val();

let listName = listName_raw.toLowerCase();
let json = ".json";

let listName_json = listName.concat(json);

$.ajax({
  method: "POST",
  url: "../php/checkListName.php",
  data: {
    "fileName": listName_json
  }

}).done(function (e) {
  if(e == 1){
    $('#listMakerUsrID').prop('disabled', false);
    $('#confirmListBtn').prop('disabled', false);
    $('#listMakerTitle').css("background", "lightgreen");
    $('.listMakerName').append("<span> List created </span>");
    $('#listMakerTitle').prop('disabled', true);
    $('#goBackBtn').prop('disabled', true);
  }else{
    $('#listMakerUsrID').prop('disabled', true);
    $('#listMakerTitle').css("background", "red");
    $('.listMakerName span').remove();
  }

}).fail(function (e) {
    console.log(e);
});

}

//Check person exist on the platforme and is not already on the list

function checkNameList(){
let listName_raw = $('#listMakerTitle').val();

let listName = listName_raw.toLowerCase();
let json = ".json";

let listName_json = listName.concat(json);

let name = $('#listMakerUsrID').val();

$.ajax({
  method: "POST",
  url: "../php/checkPersonNameListMaker.php",
  data: {
    'personName': name,
    'listName': listName_json
  }
}).done(function (e) {
  if(e == 1){
    $("#listMakerUsrID").css("background", "lightgreen");
    $('#addPersonTolistBtn').prop('disabled', false);
  }else{
    $("#listMakerUsrID").css("background", "red");
    $('#addPersonTolistBtn').prop('disabled', true);
  }
}).fail(function (e) {
  console.log(e);
});
}


function addPersonTolist() {
let listName_raw = $('#listMakerTitle').val();

let listName = listName_raw.toLowerCase();
let json = ".json";

let listName_json = listName.concat(json);

let name = $('#listMakerUsrID').val();

$.ajax({
  method: "POST",
  url: "../php/addPersonToPreMadeList.php",
  data: {
    'personName': name,
    'listName': listName_json
  }
}).done(function (e) {
  $('#addPersonTolistBtn').prop('disabled', true);
  $('#listMakerUsrID').val("");
  $("#listMakerUsrID").css("background", "");
}).fail(function (e) {
  console.log(e);
});
}

function confirmeList() {
let test = confirm("Are you sure ? You won't be able to modify this list anymore");
if(test){
  homePageSetup();
}
}

function deleteListPageSetup() {
$(".ballots").empty();
$(".ballots").append("<h1>Delete list :</h1>");

$('#preMadelistBtn').remove();
$("#supprPreMadeList").remove();
$("#BallotSetUp").remove();
$(".content .menu").prepend("<button type='button' id='goBackBtn' onclick='homePageSetup()'>Go back</button>");

$(".ballots").append("<div class='optionSection'></div>");

$(".optionSection").append("<div id='PreMadeListDelete'></div>");
$("#PreMadeListDelete").append("<label>Name of the list : </label>");
$("#PreMadeListDelete").append("<input type='text' id='listDeleteTitle' placeholder='Name of the list'>");

$(".optionSection").append("<div id='BtnWrapper'></div>");

$("#BtnWrapper").append("<button type='button' id='deleteBtn' onclick='deletePopup()'>Delete</button>");
}