//Display all the ballots on the home screen

function displayBallots(){
  $.ajax({
    dataType: "json",
    url: "../php/searchBallot.php",
  }).done(function(obj) {
    for (bal of obj){
      //Each bal contains the title, the promoter, the participation rate, the status and the ID of a ballot
      $voting = "Closed";
      if(bal.open=="true") {
        $voting = "Open";
      }
      //Completes the table on the home screen with the corresponding informations
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
  //Empty the home page
  $(".ballots").empty();
  //Write title of the the selected ballot as a headline
  $(".ballots").append("<h1>"+obj.title+"</h1>");
  //Write the question of the ballot under the title
  $(".ballots").append("<h2>"+obj.question+"</h2>");
  if(obj.open=="true") {
    if(obj.role > 1) {
      //Create a new table only visible by the promoter of the ballot
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
        //Fill the table with the ID of each voters and the proxies that they received or sent
        $("#list").append("<tr><td>"+voter.userID+"</td><td>"+$recipient+"</td><td>"+$proxy+"</td></tr>");
      }
    } else {
      if(obj.userVote.nbVote==0) {
        $(".ballots").append("<br><br><br><br><h3>Come back later when the vote is closed.</h3>");
      }
    }
  } else {
    //If the vote is closed, write a table containing the results of the vote
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
      //Fill the table with the number of votes in abslute number and percentage corresponding to its choice
      $("#list").append("<tr><td>"+choice+"</td><td>"+$number+"</td><td>"+Math.round($percentage*100)/100+"%</td></tr>");
    }
  }

  $('#preMadelistBtn').remove();

  $("#BallotSetUp").remove();

  $(".content .menu").empty();
  //Add a button to log out on the side of the side menu
  $(".content .menu").prepend("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");
  //If the user is the promoter of the ballot and the ballot is still open, add a button on the side menu to close the ballot
  if(obj.role > 1 && obj.open=="true") {
    $(".content .menu").prepend("<button type='button' id='closeBallot' onclick='closeBallot()'>Close Ballot</button>")
  }
  //Add a button to go back to the home page on the side of the side menu
  $(".content .menu").prepend("<button type='button' id='goBackBtn' onclick='homePageSetup()'>Go back</button>")

  if(obj.userVote.nbVote > 0 && obj.open=="true") {
    //If the current user can still vote, add a button at the bottom of the page to let him access the voting page
    $(".ballots").append("<div class='optionSection'></div>");

    $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");
  
    $(".optionSection").append("<div id='BtnWrapper'></div>");
    $("#BtnWrapper").append("<button type='button' id='vote' value="+voteID+" onclick='CreateVotePage(value)'>Vote</button>");
    if(obj.userVote.votedProcuration=="NULL" && obj.userVote.procuration.length==0) {
      ///If the current user can still proxy, add a button at the bottom of the page to let him access the proxy page
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
  //Empty the page
  $(".ballots").empty();
  //Write title of the the selected ballot as a headline
  $(".ballots").append("<h1>"+obj.title+"</h1>");
  //Write the question of the ballot under the title
  $(".ballots").append("<h2>"+obj.question+"</h2>");

  $(".ballots").append("<table id ='list'>");
  //If the user has not voted yet, write a line with the different options that he can select
  if(obj.userVote.vote=="NULL") {
    $("#list").append("<br><br><td>-Personal vote : <select id='personal'></select></td>");
    for(choice of obj.response) {
      $("#personal").append("<option value="+choice+">"+choice+"</option>");
    }
  }
  //If the user has one or two proxies, write the appropriate number of lines with with the different options that he can select
  if(obj.userVote.procuration.length > 0) {
    for(voter of obj.voters) {
      if(voter.userID==obj.userVote.procuration[0] && voter.voted=="false") {
        $("#list").append("<br><br><td>-Vote for "+obj.userVote.procuration[0]+" : <select id='first'></select></td>");
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
    for(voter of obj.voters) {
      if(voter.userID==obj.userVote.procuration[1] && voter.voted=="false") {
        $("#list").append("<br><br><td>-Vote for "+obj.userVote.procuration[1]+" : <select id='second'></select></td>");
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
  //Add a button on the side menu, to allow the user to log out
  $(".content .menu").prepend("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");
  //Add a button on the side menu, to allow the user to go back to the previous page
  $(".content .menu").prepend("<button type='button' id='goBackBtn' value='"+voteID+"' onclick='CreateBallotPageCheck(value)'>Go back</button>");

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");
  //Add a button at the bottom of the screen to save the choices of the user
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
  //Make the user go back to the page of the selected ballot
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
  //Empty the page
  $(".ballots").empty();
  //Write title of the the selected ballot as a headline
  $(".ballots").append("<h1>"+obj.vote.title+"</h1>");
  //Write the question of the ballot under the title
  $(".ballots").append("<h2>"+obj.vote.question+"</h2>");

  $(".ballots").append("<table id ='list'>");
  //Write a line to allow the user to select a possible recipient for its proxy
  $("#list").append("<br><br><td>-Choose the recipient of the proxy : <select id='recipient'></select></td>");
  for(voter of obj.vote.voters) {
    if(voter.procuration.length < 2 && voter.userID!=obj.userID && voter.votedProcuration=="NULL") {
      $("#recipient").append("<option value="+voter.userID+">"+voter.userID+"</option>");
    }
  }
  //Write a line to allow the user to select a voting  option for the recipient of the proxy
  $("#list").append("<br><br><td>-Choose the response of the proxy : <select id='response'></select></td>");
  $("#response").append("<option value='NULL'>The recipient can choose</option>");
  for(choice of obj.vote.response) {
    $("#response").append("<option value="+choice+">"+choice+"</option>");
  }

  $('#preMadelistBtn').remove();

  $("#BallotSetUp").remove();

  $(".content .menu").empty();
  //Add a button on the side menu, to allow the user to log out
  $(".content .menu").prepend("<button class='logout-btn' onclick='logOut()'>LOGOUT</button>");
  //Add a button on the side menu, to allow the user to go back to the previous page
  $(".content .menu").prepend("<button type='button' id='goBackBtn' value="+obj.voteID+" onclick='CreateBallotPageCheck(value)'>Go back</button>");

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div class='optionItem' id='optionItem'></div>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");
  //Add a button at the bottom of the page to allow the user to save his choices in the ballots.json file
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
    //Make the user go back to the page of the selected ballot
    CreateBallotPageCheck(obj);
  }).fail(function(e) {
    console.log(e);
    $("#message").html("<span class='ko'> Error: network problem </span>");
  });
}

//Close the selected ballot
function closeBallot() {
  $.ajax({
    method: "POST",
    dataType: "json",
    url: "../php/closeBallot.php",
  }).done(function (obj) {
    //Make the user go back to the page of the selected ballot
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
    $(".optionItem").append("<div id='optionWrapper"+ nbChoice +"'></div>");
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

//Set up the HTML for adding persons to the vote created just before 

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

  $(".optionSection").append("<table id='listPerson'></table>");
  $("#listPerson").append("<tr id='listHeader'><th>List ID :</th></tr>");

  checkListExistence();
}

//Create buttons for the pre made lists if they exist

function checkListExistence() {
  $.ajax({
    dataType: "json",
    url: "../php/checkListExistence.php"
  }).done(function(e) {
    for(let i = 0; i < e.length; i++){
      let filename = e[i].split(".");
      $('#listHeader').append("<th><button type='button' id="+ filename[0] +" value="+ filename[0] +" onclick='addListToVote(value)'>"+ filename[0] +"</button></th>");
    }
  }).fail(function (e) {
    console.log(e);
  });
}

//Put all the people in the list in the vote

function addListToVote(listName) {
  let extension = ".json";
  let listNameFull = listName.concat(extension);

  $.ajax({
    method: "POST",
    dataType: "json",
    url: "../php/addListToVote.php",
    data: {"fileName": listNameFull}
  }).done(function (e) {
    linkListToLastVotePageSetup();
    for(let i = 0; i < e.length; i++){
      let personAdded = e[i];
      $("#listPerson").append("<tr id='row"+ personAdded +"'><td>"+ personAdded +"</td> <td> <button type='button' id='supprPerson' value='"+ personAdded +"' onclick='supprPerson(value)' >❌</td></tr>");
    }
  }).fail(function (e) {
    console.log(e);
  });
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


  $('.ballots').append("<table id='listPerson'></table>");
  $("#listPerson").append("<tr id='listHeader'><th>Person ID :</th></tr>");

/*$(".ballots").append("<div id='upload_zone'></div>");
$("#upload_zone").append("<h3>Choose your json file : </h3>")
$("#upload_zone").append("<input id='file' name='file' type='file'>");
$("#upload_zone").append("<button type='button' id='uploadBtn' onclick='uploadFile()'>Upload</button>");*/

}


/*function uploadFile() {
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
      success: function(e){
        if(e == 0){
          alert("A list with this name already exist.")
        }else{
          console.log("Success !!");
        }
      }
    })
  }
}*/

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
    $('#listPerson').append("<tr id='row"+ name +"'><td>"+ name +"</td><td><button type='button' value="+ name +" onclick='supprPersonList(value)'>❌</button></td></tr>");
    $('#addPersonTolistBtn').prop('disabled', true);
    $('#listMakerUsrID').val("");
    $("#listMakerUsrID").css("background", "");
  }).fail(function (e) {
    console.log(e);
  });
}

function supprPersonList(name) {
  let listName_raw = $('#listMakerTitle').val();

  let listName = listName_raw.toLowerCase();
  let json = ".json";

  let listName_json = listName.concat(json);

  $.ajax({
    method: "POST",
    url: "../php/supprPersonFromList.php",
    data: {
      "listName": listName_json,
      "personName": name
    }
  }).done(function (e) {
    $("#row"+ name +"").remove();
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
  $("#goBackBtn").remove();
  $(".content .menu").prepend("<button type='button' id='goBackBtn' onclick='homePageSetup()'>Go back</button>");

  $(".ballots").append("<div class='optionSection'></div>");

  $(".optionSection").append("<div id='PreMadeListDelete'></div>");
  $("#PreMadeListDelete").append("<label>Name of the list : </label>");
  $("#PreMadeListDelete").append("<input type='text' id='listDeleteTitle' onchange='checkListNameForDeletion()' placeholder='Name of the list'>");

  $(".optionSection").append("<div id='BtnWrapper'></div>");

  $("#BtnWrapper").append("<button type='button' id='deleteBtn' onclick='deletePopup()' disabled>Delete</button>");

  $('.optionSection').append("<table id='listPerson'></table>");
  $("#listPerson").append("<tr id='listHeader'><th>Your lists :</th></tr>");

  list();
}


function checkListNameForDeletion() {
  let listName_raw = $('#listDeleteTitle').val();

  let listName = listName_raw.toLowerCase();
  let json = ".json";

  let listName_json = listName.concat(json);

  $.ajax({
    method: "POST",
    url: "../php/checkListNameDeletion.php",
    data: {
      "fileName": listName_json
    }
  }).done(function (e) {
    if(e == 1){
      alert("This list doesn't exist");
      $("#listDeleteTitle").css("background", "red");
      $('#deleteBtn').prop('disabled', true);
    }else{
      $("#listDeleteTitle").css("background", "lightgreen");
      $('#deleteBtn').prop('disabled', false);
    }
  }).fail(function (e) {
      console.log(e);
  });

}


function deletePopup() {
  let test = confirm("Are you sure ? You won't be able to recover this list anymore");
  if(test){
    deleteList();
  }
}

function deleteList() {
  let listName_raw = $('#listDeleteTitle').val();

  let listName = listName_raw.toLowerCase();
  let json = ".json";

  let listName_json = listName.concat(json);

  $.ajax({
    method: "POST",
    url: "../php/deleteList.php",
    data: {
      "fileName": listName_json
    }
  }).done(function (e) {
    $('#listDeleteTitle').val("");
    $("#listDeleteTitle").css("background", "");
    $('#deleteBtn').prop('disabled', true);
    deleteListPageSetup();
  }).fail(function (e) {
    console.log(e);
  });
}

function list(){
  $.ajax({
    dataType: "json",
    url: "../php/checkListExistence.php"
  }).done(function(e) {
    for(let i = 0; i < e.length; i++){
      let filename = e[i].split(".");
      $('#listPerson').append("<tr><td> - "+ filename[0] +"</td></tr>");
    }
  }).fail(function (e) {
    console.log(e);
  });
}