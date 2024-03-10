const save_btn = document.getElementById('button-el');
const clear_btn = document.getElementById('clear-el');
const clear_btn2 = document.getElementById('clear-el2');
const clear_btn3 = document.getElementById('clear-el3');
const list_dsp = document.getElementById('ul-el');
const text_inp = document.getElementById('input-el');
const empty_dsp = document.getElementById('empty-container');
let linkList = [];

getStorage(linkList);
renderList(linkList);
save_btn.addEventListener('click', addItem);
text_inp.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    addItem();
  }
});

//Get the items from local storage
//And store it in tempList;
function getStorage(tempList) {
  for (let i = 0; i < localStorage.length; i++) {
    tempList[i] = JSON.parse(localStorage.getItem(i));
  }
}

function addItem() {
  if (text_inp.value != '') {
    linkList.push({
      url: text_inp.value,
    });
    renderList(linkList);
    refreshStorage(linkList);
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      linkList.push({
        url: tabs[0].url,
        title: tabs[0].title,
      });
      renderList(linkList);
      refreshStorage(linkList);
    });
  }
  text_inp.value = '';
}

function renderList(tempList) {
  list_dsp.textContent = '';
  for (let i = 0; i < tempList.length; i++) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.setAttribute('href', tempList[i].url);
    link.setAttribute('target', '_blank');
    link.textContent = tempList[i].title || tempList[i].url;

    const img = getFavicon(tempList[i].url);
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'delete-btn');
    deleteButton.addEventListener('click', () => {
      deleteItem(i);
      renderList(linkList);
      refreshStorage(linkList);
    });
    listItem.appendChild(img);
    listItem.appendChild(link);
    listItem.appendChild(deleteButton);
    list_dsp.appendChild(listItem);
  }
  renderEmpty();
}

function deleteItem(index) {
  localStorage.removeItem(index);
  linkList.splice(index, 1);
}

function refreshStorage(tempList) {
  localStorage.clear();
  for (let i = 0; i < tempList.length; i++) {
    localStorage.setItem(i, JSON.stringify(tempList[i]));
  }
}

//Display features

function getFavicon(url) {
  const img = document.createElement('img');
  img.src = 'https://www.google.com/s2/favicons?domain=' + url;
  img.setAttribute('class', 'favicon');
  return img;
}

function renderEmpty() {
  if (linkList.length > 0) {
    empty_dsp.style.display = 'none';
  } else {
    empty_dsp.style.display = 'block';
  }
}

clear_btn3.addEventListener('click', () => {
  clear_btn.style.display = 'inline-block';
  clear_btn2.style.display = 'none';
  clear_btn3.style.display = 'none';
});

clear_btn2.addEventListener('click', () => {
  localStorage.clear();
  linkList.length = 0;
  list_dsp.textContent = '';
  renderEmpty();
  clear_btn.style.display = 'inline-block';
  clear_btn2.style.display = 'none';
  clear_btn3.style.display = 'none';
});

clear_btn.addEventListener('click', () => {
  clear_btn.style.display = 'none';
  clear_btn2.style.display = 'inline-block';
  clear_btn3.style.display = 'inline-block';
});
