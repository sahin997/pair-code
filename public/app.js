
async function connectBot(){

  const number =
    document.getElementById("number").value;

  const res = await fetch("/pair",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({number})
  });

  const data = await res.json();

  if(data.success){

    document.getElementById("result")
      .innerText =
      "Pair Code: " + data.code;

  } else {

    document.getElementById("result")
      .innerText =
      data.error;
  }
}
