# User Guide: Exporting WhatsApp Chats 📱

This guide explains how to export your WhatsApp chats and prepare them for the **WhatsApp Chat Intelligence** portal.

## Step 1: Export Chat from WhatsApp

### Android
1.  Open the chat or group you want to export.
2.  Tap the **three dots** (menu) in the top right corner.
3.  Select **More** > **Export chat**.
4.  Choose **Without Media** (recommended for faster processing, as the portal currently analyzes text only).
5.  Save the file (e.g., send it to yourself via email or save to Google Drive).

### iPhone (iOS)
1.  Open the chat or group info.
2.  Scroll down and tap **Export Chat**.
3.  Choose **Without Media**.
4.  Save the file to your computer.

## Step 2: Organize Your Folders

1.  Navigate to the `chats` folder inside the project directory.
2.  Create a new folder for each chat group (this helps keep things organized and names the group in the portal).
    *   *Example*: Create a folder named `Startup Group`.
3.  Place the exported text file (usually named `_chat.txt` or `WhatsApp Chat with....txt`) inside that folder.

**Correct Structure:**
```text
chats/
├── My Tech Group/
│   └── _chat.txt
├── Family Group/
│   └── WhatsApp Chat with Family.txt
└── ...
```

## Step 3: Run the Portal

Once your files are in place, simply run `python run_portal.py` to see your data!
