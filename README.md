# Hermes Email Client

Minimal, terminal-inspired web email client for the Kagi Labs take-home assignment.  
Built with plain JavaScript, Stimulus.js, HTML, and CSS.\
Only for UI demo purposes. Entire backend is in-memory.

## Features

- Terminal-inspired aesthetic
- Basic Inbox, Sent, Trash views
- Compose new email
- Reply, Forward, and Delete
- Keyboard-driven navigation (e.g., `i`, `s`, `t`, `c`, etc.) or mouse-driven.

## Setup & Running

1. **Clone or Download** this repository.
2. **Open a terminal** in the project folder.
3. **Start a local server** (for example, using Python):

   ```bash
   python3 -m http.server 8000
4. Open your browser at http://localhost:8000.
5. Enjoy typing shortcuts (like c to compose) or clicking around.

## Keyboard Shortcuts

* i – Go to Inbox

* s – Go to Sent

* t – Go to Trash

* c – Compose

* d – Delete (when viewing an email)

* r – Reply (when viewing an email)

* f – Forward (when viewing an email)

* Escape – Cancel/Close (modal, compose screen, or email viewer)

* Enter – In Compose view, sends email. In Inbox list, opens the selected email.