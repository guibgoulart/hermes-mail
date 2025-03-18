import { Controller } from "https://cdn.skypack.dev/@hotwired/stimulus";
import { emails } from "../data/emails.js";

export default class extends Controller {
  static targets = ["emailList", "emailViewer", "emailBody", "emailSender", "emailSubject", "emailDate"];

  connect() {
    console.log("Email controller connected");
    this.renderEmails();
    this.setupKeyboardShortcuts();
  }

  // Mocked data
  getEmails() {
    return emails;
  }

  renderEmails() {
    this.emailListTarget.innerHTML = emails
      .map(
        (email) => `
          <div class="email-item ${email.read ? "" : "unread"}" data-email-id="${email.id}">
            <div class="email-id">${email.id}</div>
            <div class="email-sender">${email.sender}</div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-date">${email.date}</div>
          </div>
        `
      )
      .join("");

    // Reattach event listeners after rendering
    this.setupEmailSelection();
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      const emailItems = this.emailListTarget.querySelectorAll(".email-item");

      if (event.key === "i") {
        window.location.hash = "#inbox";
      } else if (event.key === "s") {
        window.location.hash = "#sent";
      } else if (event.key === "t") {
        window.location.hash = "#trash";
      } else if (event.key === "c") {
        this.composeEmail();
      } else if (event.key === ":") {
        const commandInput = document.getElementById("command-input");
        commandInput.focus();
      } else if (event.key === "ArrowDown") {
        this.selectedEmailIndex = Math.min(this.selectedEmailIndex + 1, emailItems.length - 1);
        this.highlightEmail(emailItems, this.selectedEmailIndex);
      } else if (event.key === "ArrowUp") {
        this.selectedEmailIndex = Math.max(this.selectedEmailIndex - 1, 0);
        this.highlightEmail(emailItems, this.selectedEmailIndex);
      } else if (event.key === "Enter" && this.selectedEmailIndex >= 0) {
        const emailId = emailItems[this.selectedEmailIndex].dataset.emailId;
        this.showEmail(emailId);
      } else if (event.key === "Escape") {
        this.showEmailList();
      }
    });
  }

  setupEmailSelection() {
    const emailItems = this.emailListTarget.querySelectorAll(".email-item");
    this.selectedEmailIndex = -1;

    // Remove existing event listeners (if any)
    emailItems.forEach((item) => {
      item.removeEventListener("click", this.handleEmailClick);
    });

    // Attach new event listeners
    emailItems.forEach((item, index) => {
      item.addEventListener("click", this.handleEmailClick.bind(this, index));
    });
  }

  handleEmailClick(index, event) {
    const emailItems = this.emailListTarget.querySelectorAll(".email-item");
    this.selectedEmailIndex = index;
    this.highlightEmail(emailItems, this.selectedEmailIndex);
    const emailId = event.currentTarget.dataset.emailId;
    this.showEmail(emailId);
  }

  highlightEmail(emailItems, index) {
    emailItems.forEach((item) => {
      item.classList.remove("selected");
    });

    if (index >= 0 && index < emailItems.length) {
      emailItems[index].classList.add("selected");
    }
  }

  showEmail(emailId) {
    const email = this.getEmails().find((e) => e.id === parseInt(emailId));
    if (email) {
      this.emailSenderTarget.textContent = `From: ${email.sender}`;
      this.emailSubjectTarget.textContent = `Subject: ${email.subject}`;
      this.emailDateTarget.textContent = `Date: ${email.date}`;
      this.emailBodyTarget.textContent = email.body;

      this.emailListTarget.style.display = "none";
      this.emailViewerTarget.classList.add("visible");

      // Mark email as read
      email.read = true;
      this.renderEmails(); // Re-render to update the unread indicator
    }
  }

  showEmailList() {
    this.emailListTarget.style.display = "block";
    this.emailViewerTarget.classList.remove("visible");
  }

  composeEmail() {
    alert("Compose email functionality coming soon!");
  }
}