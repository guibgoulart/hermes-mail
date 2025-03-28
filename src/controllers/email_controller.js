import { Controller } from "https://cdn.skypack.dev/@hotwired/stimulus";
import { emails } from "../data/emails.js";
import { setupKeyboardShortcuts } from "../utils/keyboardShortcuts.js";

export default class extends Controller {
  static targets = [
    "emailList",
    "emailViewer",
    "emailBody",
    "emailSender",
    "emailSubject",
    "emailDate",
    "emailTo",
    "composePage",
    "composeTo",
    "composeSubject",
    "composeBody",
    "deleteModal",
  ];

  connect() {
    this.currentFolder = "inbox";
    this.renderEmails();
    this.selectedEmailIndex = -1;
    this.highlightNav("inbox");
    setupKeyboardShortcuts(this);
  }

  getEmails() {
    return emails;
  }

  renderEmails() {
    const folderEmails = this.getEmails().filter(
      (email) => email.folder === this.currentFolder
    );

    this.emailListTarget.innerHTML = folderEmails
      .map(
        (email) => `
          <div class="email-item ${
            email.read ? "" : "unread"
          }" data-email-id="${email.id}">
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

      // Store current email ID
      this.currentEmailId = parseInt(emailId);

      if (email.folder === "sent") {
        this.emailToTarget.textContent = `To: ${email.to || "me@hermes.local"}`;
      } else {
      // Assume it's an inbound email; the user is the recipient
        this.emailToTarget.textContent = "To: me@hermes.local";
      }
        

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
      to: to,
      subject,
      body,
      date: new Date().toLocaleString(),
      read: false,
      folder: "sent",
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
    const email = this.getEmails().find((e) => e.id === this.currentEmailId);
    if (!email) return;

    // Hide any visible sections
    this.emailListTarget.style.display = "none";
    this.emailViewerTarget.classList.remove("visible");

    // Show compose
    this.composePageTarget.classList.add("visible");

    // Fill fields for a reply
    this.composeToTarget.value = email.sender;

    // If subject doesn't already start with "Re: ", add it
    let subjectPrefix = email.subject.startsWith("Re: ") ? "" : "Re: ";
    this.composeSubjectTarget.value = subjectPrefix + email.subject;

    // Optionally quote the original email
    this.composeBodyTarget.value = `
    On ${email.date}, ${email.sender} wrote:
    ${email.body}
    `;
  }

  forward() {
    const email = this.getEmails().find((e) => e.id === this.currentEmailId);
    if (!email) return;

    // Hide other sections
    this.emailListTarget.style.display = "none";
    this.emailViewerTarget.classList.remove("visible");

    // Show compose
    this.composePageTarget.classList.add("visible");

    // "To" is blank by default
    this.composeToTarget.value = "";

    // If subject doesn't start with "Fwd: ", add it
    let subjectPrefix = email.subject.startsWith("Fwd: ") ? "" : "Fwd: ";
    this.composeSubjectTarget.value = subjectPrefix + email.subject;

    // Quote entire original email
    this.composeBodyTarget.value = `
    ---------- Forwarded message ---------
    From: ${email.sender}
    Date: ${email.date}
    Subject: ${email.subject}
    
    ${email.body}
    `;
  }

  delete() {
    // If not in the viewer or no currentEmailId, do nothing
    if (!this.currentEmailId || !this.emailViewerTarget.classList.contains("visible")) {
      return;
    }
    
    // Show modal
    this.deleteModalTarget.classList.add("show");
  }

  confirmDelete() {
    // Actually delete or move to trash
    const email = this.getEmails().find((e) => e.id === this.currentEmailId);
    if (!email) return;

    if (email.folder === "trash") {
      const idx = this.getEmails().indexOf(email);
      this.getEmails().splice(idx, 1);
    } else {
      email.folder = "trash";
    }

    // Hide the modal, show the list, re-render
    this.deleteModalTarget.classList.remove("show");
    this.showEmailList();
    this.renderEmails();
  }

  cancelDelete() {
    // Hide the modal only
    this.deleteModalTarget.classList.remove("show");
  }

  showInbox() {
    this.currentFolder = "inbox";
    this.highlightNav("inbox");
    this.showEmailList();
    this.renderEmails();
  }

  showSent() {
    this.currentFolder = "sent";
    this.highlightNav("sent");
    this.showEmailList();
    this.renderEmails();
  }

  showTrash() {
    this.currentFolder = "trash";
    this.highlightNav("trash");
    this.showEmailList();
    this.renderEmails();
  }

  highlightNav(folderName) {
    // Grab all nav links
    const navLinks = document.querySelectorAll("header nav ul li a");

    // Remove 'active' from any previously active link
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Find the link whose data-folder matches folderName
    const activeLink = [...navLinks].find(
      (link) => link.dataset.folder === folderName
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
}