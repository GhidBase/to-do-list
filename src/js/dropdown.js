export class Dropdown {
  constructor(targetDropdown) {
    this.targetDropdown = targetDropdown;
    this.dropdownItemContainer = document.createElement("div");
    this.displayBool = false;
    this.initialize();
  }

  initialize() {
    this.dropdownItemContainerSetup();
    this.targetDropdown.addEventListener("click", () => this.toggleDisplay());
  }

  dropdownItemContainerSetup() {
    this.dropdownItemContainer.classList.add("drop-down-item-container");
    this.appendDropdownItem("Tic-Tac-Toe");
    this.appendDropdownItem("Lucky Defense Guides");
  }

  appendDropdownItem(title) {
    const newItem =  document.createElement("button");
    newItem.textContent = title;
    newItem.classList.add("drop-down-item");
    this.dropdownItemContainer.appendChild(newItem);
    return newItem;
  }

  toggleDisplay() {
    this.displayBool = this.displayBool ? false :  true;
    if (this.displayBool) this.displayOptions();
        else this.hideOptions();
  }

  displayOptions() {
    console.log("display options");
    this.targetDropdown.appendChild(this.dropdownItemContainer);
  }

  hideOptions() {
    this.dropdownItemContainer.remove();
  }
}