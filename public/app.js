// Check cookieStoreId based on the tabId
function logStores(cookieStores) {
  for (const store of cookieStores) {
    alert('bad');
    //console.log('Cookie store: ${store.id}\n Tab IDs: ${store.tabIds}'';
  }
}

function sendCookie(){
  //browser.cookies.getAllCookieStores().then(logStores);
  //var val = window.localStorage.getItem("Session");
  //alert(val);

  //let gettingStores = chrome.cookies.getAll();

  //alert(gettingStores);
  var todo = {"hello"};
  $.ajax({
    type: 'POST',
    url: '/sendcookie',
    data: todo,
    success: function(data){
      //alert(JSON.stringify(data));
    }
  });
}
//Load when html renders
$(document).ready(function(){
  //$('#butTest').on('click',function(event){
    sendCookie();
  //});
});
