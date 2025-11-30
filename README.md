# WhatsApp Chat Intelligence 🧠

A powerful local analytics portal for your WhatsApp chats. Visualize, search, and categorize your message history with ease.

## 🚀 Features

-   **Smart Categorization**: Automatically classifies messages into categories like *Opportunities*, *Events*, *Funding*, *Resources*, and more.
-   **Intelligent Tagging**: Detects modes (Online/Offline), costs (Free/Paid), audiences (Students/Founders), and urgency.
-   **Search & Filter**: Instantly search through thousands of messages and filter by category or date.
-   **Privacy First**: Runs 100% locally on your machine. Your chat data never leaves your computer.
-   **Responsive Design**: Clean, modern interface for browsing your chat history.

## 🛠️ Prerequisites

-   **Python 3.x**: To run the local server.
-   **Node.js**: To parse and process the chat data.

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/whatsapp-chat-intelligence.git
    cd whatsapp-chat-intelligence
    ```

2.  **Prepare your data**:
    *   Export your WhatsApp chats (see [User Guide](USER_GUIDE.md) for details).
    *   Unzip the exported chats.
    *   Place the chat folders (containing `_chat.txt` or similar text files) inside the `chats/` directory of this project.

    **Structure should look like this:**
    ```text
    whatsapp-chat-intelligence/
    ├── chats/
    │   ├── WhatsApp Chat with Group A/
    │   │   └── _chat.txt
    │   └── WhatsApp Chat with Group B/
    │       └── ...
    ├── parser.js
    ├── run_portal.py
    └── ...
    ```

## 🏃‍♂️ Usage

1.  **Run the Portal**:
    Double-click `run_portal.py` or run it from the terminal:
    ```bash
    python run_portal.py
    ```

2.  **That's it!**
    *   The script will automatically run the parser to update the data.
    *   It will start a local web server.
    *   It will open your default browser to `http://localhost:8080`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
