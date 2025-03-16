export function setupKeyboardShortcuts(emailController) {
    document.addEventListener("keydown", (event) => {
        const emailItems = emailController.emailListTarget.querySelectorAll(".email-item");

        if (event.key === "i") {
            window.location.hash = "#inbox";
        } else if (event.key === "s") {
            window.location.hash = "#sent";
        } else if (event.key === "t") {
            window.location.hash = "#trash";
        } else if (event.key === "c") {
            emailController.composeEmail();
        } else if (event.key === ":") {
            const commandInput = document.getElementById("command-input");
            commandInput.focus();
        } else if (event.key === "ArrowDown") {
            emailController.selectedEmailIndex = Math.min(emailController.selectedEmailIndex + 1, emailItems.length - 1);
            emailController.highlightEmail(emailItems, emailController.selectedEmailIndex);
        } else if (event.key === "ArrowUp") {
            emailController.selectedEmailIndex = Math.max(emailController.selectedEmailIndex - 1, 0);
            emailController.highlightEmail(emailItems, emailController.selectedEmailIndex);
        } else if (event.key === "Enter" && emailController.selectedEmailIndex >= 0) {
            const emailId = emailItems[emailController.selectedEmailIndex].dataset.emailId;
            emailController.viewEmail(emailId);
        }
    });
}