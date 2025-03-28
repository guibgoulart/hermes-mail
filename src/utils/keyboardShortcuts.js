export function setupKeyboardShortcuts(controller) {
    document.addEventListener("keydown", (event) => {
      const tagName = event.target.tagName.toLowerCase();
      const isModalOpen = controller.deleteModalTarget.classList.contains("show");
      const isComposeOpen = controller.composePageTarget.classList.contains("visible");
      const isViewerOpen = controller.emailViewerTarget.classList.contains("visible");
  
      // If user is typing in input/textarea, skip global shortcuts except Escape/Enter
      if (
        (tagName === "input" || tagName === "textarea") &&
        event.key !== "Escape" &&
        event.key !== "Enter"
      ) {
        return;
      }
  
      // If modal is open, handle Y/N/Escape
      if (isModalOpen) {
        if (event.key === "Escape") {
          controller.cancelDelete();
        } else if (event.key === "y") {
          controller.confirmDelete();
        } else if (event.key === "n") {
          controller.cancelDelete();
        }
        return;
      }
  
      // If compose is open, handle Esc / Ctrl+Enter
      if (isComposeOpen) {
        if (event.key === "Escape") {
          controller.cancelCompose();
        } 
        // Only send if user pressed Ctrl + Enter
        else if (event.key === "Enter" && event.ctrlKey) {
          controller.sendComposedEmail();
        }
        return; // don't process other shortcuts if we're in compose
      }
  
      // If viewer is open, handle Escape to close viewer
      if (isViewerOpen) {
        if (event.key === "Escape") {
          controller.showEmailList();
        }
      }
  
      // Otherwise, user is in the list or "idle" state
      const emailItems = controller.emailListTarget.querySelectorAll(".email-item");
  
      switch (event.key) {
        case "i":
          controller.showInbox();
          break;
        case "s":
          controller.showSent();
          break;
        case "t":
          controller.showTrash();
          break;
        case "c":
          controller.composeEmail();
          break;
        case ":":
          document.getElementById("command-input")?.focus();
          break;
        case "ArrowDown":
          controller.selectedEmailIndex = Math.min(
            controller.selectedEmailIndex + 1,
            emailItems.length - 1
          );
          controller.highlightEmail(emailItems, controller.selectedEmailIndex);
          break;
        case "ArrowUp":
          controller.selectedEmailIndex = Math.max(
            controller.selectedEmailIndex - 1,
            0
          );
          controller.highlightEmail(emailItems, controller.selectedEmailIndex);
          break;
        case "Enter":
          // In the list, pressing Enter opens the selected email
          if (controller.selectedEmailIndex >= 0) {
            const emailId = emailItems[controller.selectedEmailIndex].dataset.emailId;
            controller.showEmail(emailId);
          }
          break;
        case "Escape":
          // As a fallback, if none of the above states are open
          controller.showEmailList();
          break;
        case "d":
          // Only if an email is open in the viewer
          if (controller.currentEmailId && isViewerOpen) {
            controller.delete();
          }
          break;
        case "r":
          if (controller.currentEmailId) {
            controller.reply();
          }
          break;
        case "f":
          if (controller.currentEmailId) {
            controller.forward();
          }
          break;
        default:
          break;
      }
    });
  }