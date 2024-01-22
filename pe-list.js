let selectedList = 0;

const toggleItem = (index) => {
  const myProgress = JSON.parse(localStorage.getItem("myProgress")) || {};
  const itemStatus = myProgress[`list_${selectedList}_item_${index}`] || {};
  if (itemStatus.isCompleted) {
    itemStatus.isCompleted = false;
    itemStatus.date = "";
  } else {
    itemStatus.isCompleted = true;
    itemStatus.date = new Date();
  }
  myProgress[`list_${selectedList}_item_${index}`] = itemStatus;
  localStorage.setItem("myProgress", JSON.stringify(myProgress));
};

const appendList = (list, index) => {
  const listContent = `
    <div class="head">
      <div class="title">${list.title}</div>
      <div class="subtitle">${list.subTitle}</div>
    </div>
    <ul class="pe-list-${index}"></ul>
    <div class="appendix">${list.appendix}</div>
  `;
  const listContainer = document.createElement("div");
  listContainer.classList.add(`list`);
  listContainer.innerHTML = listContent;

  // Append list
  const container = document.getElementById("container");
  container.appendChild(listContainer);
};

const appendItem = (list, listIndex, item, index) => {
  const myProgress = JSON.parse(localStorage.getItem("myProgress")) || {};
  const itemStatus = myProgress[`list_${selectedList}_item_${index}`] || {};
  const itemContent = `
<input type="checkbox" id="item-${index}" name="item-${index}" ${
    itemStatus.isCompleted ? "checked" : ""
  }>
<label for="item-${index}" class="text">
  ${item.action}
  <span class="details">
    ${item.timeLine ? `Timeline: ${item.timeLine}` : ""}
    ${item.timeLine && item.form ? " - " : ""}
    ${item.form ? 
      item.form.link ? `Form: <a href="${item.form.link}" target="_blank">${item.form.name}</a>`
        : `Form: ${item.form.name}`
      : ""}
  </span>
</label>
<label for="item-${index}" class="button"></label>
<div class="wrapper">
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 98.5 98.5" enable-background="new 0 0 98.5 98.5" xml:space="preserve">
  <path class="checkmark" fill="none" stroke-width="8" stroke-miterlimit="10" d="M81.7,17.8C73.5,9.3,62,4,49.2,4
  C24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3"/>
  </svg>
</div>
${
  itemStatus.date
    ? `<div class="item-status">Completed on ${new Date(
        itemStatus.date
      ).toLocaleDateString("en-US")}</div>`
    : ""
}
`;
  const listItem = document.createElement("li");
  listItem.style.animation = `slide-up ${index / 7}s`;
  listItem.innerHTML = itemContent;
  // handle clicking on text
  listItem
    .querySelector(".text")
    .addEventListener("click", (e) => toggleItem(index));
  // handle clicking on checkbox
  listItem
    .querySelector(".button")
    .addEventListener("click", (e) => toggleItem(index));

  // Append list item
  const listContainer = document.querySelector(`.pe-list-${listIndex}`);
  listContainer.appendChild(listItem);
};

const appendTab = (list, index) => {
  const tabs = document.getElementById("tabs");
  const tabItem = document.createElement("li");
  if (selectedList === index) {
    tabItem.classList.add("active");
  }
  tabItem.innerHTML = list.title;
  tabItem.addEventListener("click", () => {
    selectedList = index;
    document.getElementById("tabs").innerHTML = ""; // clear tabs
    document.getElementById("container").innerHTML = ""; // clear list
    renderList(list, index);
  });
  tabs.appendChild(tabItem);
};

const renderList = (list, listIndex) => {
  fetch("./lists.json")
    .then((response) => response.json())
    .then((lists) => {
      lists.forEach((list, listIndex) => {
        appendTab(list, listIndex);
        if (selectedList === listIndex) {
          appendList(list, listIndex);
          list.items.forEach((item, index) =>
            appendItem(list, listIndex, item, index)
          );
        }
      });
    });
};


renderList();