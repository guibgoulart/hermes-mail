import { Controller } from "https://cdn.skypack.dev/@hotwired/stimulus";
import { emails } from "../data/emails.js";
import { setupKeyboardShortcuts } from "../utils/keyboardShortcuts.js";

export default class extends Controller {
  static targets = ["emailList"];

  connect() {
    console.log("Email controller connected");
    this.renderEmails();
    this.setupKeyboardShortcuts();
    this.setupEmailSelection();
  }

  renderEmails() {
    this.emailListTarget.innerHTML = emails
      .map(
        (email) => `
          <div class="email-item" data-email-id="${email.id}">
            <div class="email-id">${email.id}</div>
            <div class="email-sender">${email.sender}</div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-date">${email.date}</div>
          </div>
        `
      )
      .join("");
  }

  setupKeyboardShortcuts() {
    setupKeyboardShortcuts(this);
  }

  setupEmailSelection() {
    const emailItems = this.emailListTarget.querySelectorAll(".email-item");
    this.selectedEmailIndex = -1;

    emailItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        this.selectedEmailIndex = index;
        this.highlightEmail(emailItems, this.selectedEmailIndex);
        const emailId = item.dataset.emailId;
        this.viewEmail(emailId);
      });
    });
  }

  highlightEmail(emailItems, index) {
    emailItems.forEach((item) => {
      item.classList.remove("selected");
    });

    if (index >= 0 && index < emailItems.length) {
      emailItems[index].classList.add("selected");
    }
  }

  composeEmail() {
    alert("Compose email functionality coming soon!");
  }

  viewEmail(emailId) {
    alert(`Viewing email with ID: ${emailId}`);
  }
}