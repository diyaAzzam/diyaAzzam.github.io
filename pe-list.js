const toggleItem = (index) => {
  const myProgress = JSON.parse(localStorage.getItem("myProgress")) || {};
  const itemStatus = myProgress[`item_${index}`] || {};
  if (itemStatus.isCompleted) {
    itemStatus.isCompleted = false;
    itemStatus.date = '';
  } else {
    itemStatus.isCompleted = true;
    itemStatus.date = new Date();
  }
  myProgress[`item_${index}`] = itemStatus;
  localStorage.setItem('myProgress', JSON.stringify(myProgress));
}

const appendItem = (item, index) => {
  const myProgress = JSON.parse(localStorage.getItem("myProgress")) || {};
  const itemStatus = myProgress[`item_${index}`] || {};
  const itemContent = `
<input type="checkbox" id="item-${index}" name="item-${index}" ${itemStatus.isCompleted ? 'checked' : ''}>
<label for="item-${index}" class="text">
  ${item.title}
  <span class="details">
    ${item.timeLine ? `Timeline: ${item.timeLine}` : ''}
    ${item.timeLine && item.form ? ' - ' : ''}
    ${item.form ? `Form: ${item.form}` : ''}
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
${ itemStatus.date ? `<div class="item-status">Completed on ${new Date(itemStatus.date).toLocaleDateString("en-US")}</div>` : '' }
`;
  const listItem = document.createElement("li");
  listItem.style.animation = `slide-up ${index/7}s`;
  listItem.innerHTML = itemContent;
  // handle clicking on text
  listItem.querySelector('.text').addEventListener('click', e => toggleItem(index));
  // handle clicking on checkbox
  listItem.querySelector('.button').addEventListener('click', e => toggleItem(index));

  // Append list item
  const listContainer = document.getElementById("pe-list");
  listContainer.appendChild(listItem);
};

fetch("./list.json")
  .then((response) => response.json())
  .then((items) => {
    items.forEach((item, index) => {
      appendItem(item, index);
    });
  });
