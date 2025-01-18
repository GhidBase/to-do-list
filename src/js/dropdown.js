export class Dropdown {
  constructor(targetDropdown) {
    this.targetDropdown = targetDropdown;
    this.dropdownItemContainer = document.createElement("div");
    this.initialize();
    this.displayBool = false;
  }

  initialize() {
    this.dropdownItemContainerSetup();
    this.targetDropdown.addEventListener("click", () => this.toggleDisplay());
  }

  dropdownItemContainerSetup() {
    this.dropdownItemContainer.classList.add("drop-down-item-container");
    this.dropdownItemContainer.appendChild(this.createDropdownItem("Tic-Tac-Toe"));
  }

  createDropdownItem(title) {
    const newItem =  document.createElement("button");
    newItem.textContent = title;
    newItem.classList.add("drop-down-item")
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