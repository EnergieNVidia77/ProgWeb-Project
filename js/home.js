function checkBallots() {
$.ajax(
{
    method: "GET",
    dataType: "json", 
    url: "../php/checkBallots.php", 
    data: 
    {
    }
}).done(function(obj) {
    for (bal of obj)
        $("#content").append("<tr><td>"+bal.title+"</td><td>"+bal.promoter+"</td><td>"+bal.pr+"</td></tr>");
}).fail(function(e) {
    console.log(e);
    $("#message").html("<span class='ko'> Error: network problem </span>");
});
}