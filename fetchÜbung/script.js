

async function getData(requestedObject) {

  let url = `https://www.openthesaurus.de/synonyme/search?q=${requestedObject}&format=application/json`
  let response = await fetch(url);
  let currentRequest = await response.json();

  renderRequest(currentRequest);
}

function renderRequest(currentRequest) {
  let contentContainer = document.getElementById('output');
  let currentObject = currentRequest.synsets;
  contentContainer.innerHTML = "";

  for (let i = 0; i < currentObject.length; i++) {
    const element = currentObject[i];
    console.log(element);
    let printableResult = element.terms;

    for (let j = 0; j < printableResult.length; j++) {
      const element = printableResult[j].term;
      contentContainer.innerHTML += /*html*/`
      <div>${element}</div>
    `
    }
  }
}

function sendRequest(){
  let requestedObject = document.getElementById('inputField').value;
  getData(requestedObject)
}