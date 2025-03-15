import { Controller } from "https://cdn.skypack.dev/@hotwired/stimulus";

export default class extends Controller {
  static targets = ["emailList"];

  connect() {
    console.log("Email controller connected");
    this.renderEmails();
  }

  // Mocked data
  getEmails() {
    return [
      {
        id: 1,
        sender: "test@mock.com",
        subject: "Welcome to Hermes",
        date: "2025-01-01",
        body: "Thank you for joining Hermes!",
        read: false,
      },
      {
        id: 2,
        sender: "team@kagi.com",
        subject: "Email Assignment",
        date: "2025-01-02",
        body: "Please complete the email client assignment.",
        read: false,
      },
      {
        id: 3,
        sender: "team@kagi.com",
        subject: "Questions?",
        date: "2025-01-03",
        body: "Let us know if you need help.",
        read: false,
      },
    ];
  }

  renderEmails() {
    const emails = this.getEmails();
    this.emailListTarget.innerHTML = emails
      .map(
        (email) => `
          <div class="email-item" data-email-id="${email.id}">
            <div class="email-sender">${email.sender}</div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-date">${email.date}</div>
          </div>
        `
      )
      .join("");
  }
}