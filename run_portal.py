import os
import subprocess
import webbrowser
import http.server
import socketserver
import threading
import time

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def run_parser():
    print("Running parser.js to update data...")
    try:
        # Run node parser.js
        subprocess.run(["node", "parser.js"], check=True, cwd=DIRECTORY, shell=True)
        print("Data updated successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running parser: {e}")
    except Exception as e:
        print(f"Could not run parser (Node.js might be missing): {e}")

def serve():
    os.chdir(DIRECTORY)
    Handler = http.server.SimpleHTTPRequestHandler
    # Allow reusing address to avoid "Address already in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n--------------------------------------------------")
        print(f"Portal is live at: http://localhost:{PORT}")
        print(f"--------------------------------------------------\n")
        httpd.serve_forever()

if __name__ == "__main__":
    # 1. Run the parser to ensure data is fresh
    run_parser()

    # 2. Open browser after a slight delay
    def open_browser():
        time.sleep(1.5)
        print("Opening browser...")
        webbrowser.open(f"http://localhost:{PORT}")
    
    threading.Thread(target=open_browser, daemon=True).start()

    # 3. Start Server
    try:
        serve()
    except KeyboardInterrupt:
        print("\nServer stopped.")
