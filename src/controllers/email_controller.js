import { Controller } from "https://cdn.skypack.dev/@hotwired/stimulus";
import { emails } from "../data/emails.js";

export default class extends Controller {
  static targets = [
    "emailList",
    "emailViewer",
    "emailBody",
    "emailSender",
    "emailSubject",
    "emailDate",
    "composePage",
    "composeTo",
    "composeSubject",
    "composeBody"
  ];

  connect() {
    console.log("Email controller connected");
    this.renderEmails();
    this.setupKeyboardShortcuts();
    this.selectedEmailIndex = -1;
  }

  getEmails() {
    return emails;
  }

  renderEmails() {
    this.emailListTarget.innerHTML = this.getEmails()
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

    this.setupEmailSelection();
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      // If the user is currently typing in input/textarea, skip global shortcuts
      const tagName = event.target.tagName.toLowerCase();
      if ((tagName === "input" || tagName === "textarea") && event.key !== "Escape") {
        return;
      }

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
        document.getElementById("command-input").focus();
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
        if (this.composePageTarget.classList.contains("visible")) {
          this.cancelCompose();
        } else {
          this.showEmailList();
        }
      }
    });
  }  

  setupEmailSelection() {
    const emailItems = this.emailListTarget.querySelectorAll(".email-item");
    this.selectedEmailIndex = -1;

    emailItems.forEach((item) => {
      item.removeEventListener("click", this.handleEmailClick);
    });

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
    emailItems.forEach((item) => item.classList.remove("selected"));
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

      // Hide list and compose, show viewer
      this.emailListTarget.style.display = "none";
      this.composePageTarget.classList.remove("visible");
      this.emailViewerTarget.classList.add("visible");

      // Mark as read and refresh
      email.read = true;
      this.renderEmails();
    }
  }

  showEmailList() {
    this.emailListTarget.style.display = "block";
    this.emailViewerTarget.classList.remove("visible");
    this.composePageTarget.classList.remove("visible");
  }

  composeEmail() {
    // Hide list and viewer if they are visible
    this.emailListTarget.style.display = "none";
    this.emailViewerTarget.classList.remove("visible");

    // Clear existing data in the compose fields
    this.composeToTarget.value = "";
    this.composeSubjectTarget.value = "";
    this.composeBodyTarget.value = "";

    // Show compose
    this.composePageTarget.classList.add("visible");
  }

  sendComposedEmail() {
    const to = this.composeToTarget.value.trim();
    const subject = this.composeSubjectTarget.value.trim() || "(No subject)";
    const body = this.composeBodyTarget.value.trim();

    if (!to) {
      alert("Please specify a recipient (To:).");
      return;
    }

    const newEmail = {
      id: this.getEmails().length + 1,
      sender: "me@hermes.local",
      subject,
      body,
      date: new Date().toLocaleString(),
      read: false
    };
    this.getEmails().push(newEmail);

    // Hide compose, show list, re-render
    this.cancelCompose();
    this.renderEmails();
    alert("Email sent!");
  }

  cancelCompose() {
    this.composePageTarget.classList.remove("visible");
    this.showEmailList();
  }

  reply() {
    alert("Reply functionality");
  }

  forward() {
    alert("Forward functionality");
  }

  delete() {
    alert("Delete functionality");
  }
}