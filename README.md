# **Starlancer – Smart Installer Proxy**
**Made&nbsp;by Arjun, Codex o3**

Starlancer is a lightweight, scriptable proxy that intercepts package‑installation commands
(`pip`, `apt`, `curl`, etc.), enforces custom allow/deny rules, logs every invocation to a
SQLite database, and optionally serves a tiny web dashboard for real‑time auditing.

> **Why?**  
> • Prevent risky or unwanted installs • Keep an immutable audit trail • Mirror or
> redirect traffic to trusted sources • Prototype SOC‑style approval flows without
> heavyweight tooling.

---

## ✨ Key Features
| Feature | What it does |
|---------|--------------|
| **Command Interception** | Wraps installers, captures the full command string. |
| **Rule Engine** | Whitelist / blacklist logic, plus optional regex matches. |
| **SQLite Logging** | Writes `timestamp`, `cmd`, and `allowed` flag to `starlancer.db`. |
| **Dry‑Run & Verbose** | Test rules without executing, or echo every decision. |
| **FastAPI Dashboard _(optional)_** | Browse the last 100 installs at `/logs`. |
| **Modular Codebase** | `src/` for core, `web/` for UI, `tests/` for coverage. |

---

## 🚀 Quick Start

```bash
git clone https://github.com/arjun18rama/Starlancer.git
cd Starlancer
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
chmod +x src/proxy.py           # make the proxy executable

# alias pip & curl through Starlancer (session only)
alias pip="python src/proxy.py pip"
alias curl="python src/proxy.py curl"

# test it!
pip install numpy --dry-run     # intercepted → not executed
pip install pandas              # allowed/forwarded if on whitelist
