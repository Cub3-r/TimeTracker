console.log("JS coding ");
debugger;
const button = document.getElementById('btn_click');
button.addEventListener('click',function(e){
  console.log("clicked");
  fetch('/sample',{method: 'POST'})
    .then(function(res){
        if (res.ok) {
          console.log("it is okk");
          return;
        }
        throw new Error('Request failed');
    })
    .catch(function(error){
      console.log(error);
    });
});
