import subprocess
import time
import sys
import os

def run_system():
    print("🚀 Starting Biometric Attendance System...")
    
    # 1. Path setup - Robust detection
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # If we are already inside the 'backend' folder, the root is one level up
    if os.path.basename(current_dir) == "backend":
        backend_dir = current_dir
        root_dir = os.path.dirname(current_dir)
    else:
        root_dir = current_dir
        backend_dir = os.path.join(root_dir, "backend")

    if not os.path.exists(backend_dir):
        print(f"❌ Error: Backend directory not found at {backend_dir}")
        return
    
    # 2. Start Main Data API (Port 8000)
    print("--- Starting Main API on Port 8000...")
    api_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=backend_dir
    )

    # 3. Start Biometric Agent (Port 8001)
    print("--- Starting Biometric Agent on Port 8001...")
    agent_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.biometric_agent.agent:app", "--host", "127.0.0.1", "--port", "8001"],
        cwd=backend_dir
    )

    print("\n✅ System is running!")
    print("👉 Frontend: http://localhost:5173")
    print("👉 API Docs: http://localhost:8000/docs")
    print("👉 Hardware Agent: http://localhost:8001/status")
    print("\nPress Ctrl+C to shut down all components.")

    try:
        while True:
            time.sleep(1)
            if api_process.poll() is not None:
                print("❌ Main API stopped unexpectedly.")
                break
            if agent_process.poll() is not None:
                print("❌ Biometric Agent stopped unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\n🛑 Shutting down system...")
    finally:
        api_process.terminate()
        agent_process.terminate()
        print("Done.")

if __name__ == "__main__":
    run_system()
