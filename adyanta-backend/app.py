
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import secrets
import hashlib
import re
from datetime import datetime, timedelta, timezone

app = Flask(__name__)
CORS(app)

DATABASE = "adyanta.db"
TOKEN_HOURS = 12


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullname TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        """)


def hash_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_authenticated_user():
    header = request.headers.get("Authorization", "")
    scheme, _, token = header.partition(" ")

    if scheme.lower() != "bearer" or not token:
        return None

    with get_db() as conn:
        session = conn.execute("""
            SELECT user_id FROM sessions
            WHERE token_hash = ? AND expires_at > ?
        """, (
            hash_token(token),
            datetime.now(timezone.utc).isoformat()
        )).fetchone()

        if not session:
            return None

        return conn.execute("""
            SELECT id, fullname, email FROM users WHERE id = ?
        """, (session["user_id"],)).fetchone()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Adyanta API is running"
    }), 200


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    fullname = data.get("fullname", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not all(isinstance(v, str) for v in (fullname, email, password)):
        return jsonify({"success": False, "message": "Invalid input"}), 400

    fullname = fullname.strip()
    email = email.strip().lower()

    if not fullname or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    if len(fullname) > 100 or len(email) > 254:
        return jsonify({
            "success": False,
            "message": "Name or email is too long"
        }), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({
            "success": False,
            "message": "Enter a valid email address"
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must be at least 8 characters"
        }), 400

    password_hash = generate_password_hash(password)

    try:
        with get_db() as conn:
            conn.execute("""
                INSERT INTO users (fullname, email, password_hash)
                VALUES (?, ?, ?)
            """, (fullname, email, password_hash))

        return jsonify({
            "success": True,
            "message": "Registration successful. Please log in."
        }), 201

    except sqlite3.IntegrityError:
        return jsonify({
            "success": False,
            "message": "This email is already registered"
        }), 409


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    password = data.get("password", "")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({
            "success": False,
            "message": "Invalid input"
        }), 400

    email = email.strip().lower()

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    with get_db() as conn:
        user = conn.execute("""
            SELECT id, fullname, email, password_hash
            FROM users WHERE email = ?
        """, (email,)).fetchone()

        if not user or not check_password_hash(
            user["password_hash"], password
        ):
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        token = secrets.token_urlsafe(32)
        expiry = (
            datetime.now(timezone.utc) +
            timedelta(hours=TOKEN_HOURS)
        ).isoformat()

        conn.execute("""
            INSERT INTO sessions (token_hash, user_id, expires_at)
            VALUES (?, ?, ?)
        """, (hash_token(token), user["id"], expiry))

    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "fullname": user["fullname"],
            "email": user["email"]
        }
    }), 200


@app.route("/api/profile", methods=["GET"])
def profile():
    user = get_authenticated_user()

    if user is None:
        return jsonify({
            "success": False,
            "message": "Invalid or expired session"
        }), 401

    return jsonify({
        "success": True,
        "user": {
            "id": user["id"],
            "fullname": user["fullname"],
            "email": user["email"]
        }
    }), 200


@app.route("/api/logout", methods=["POST"])
def logout():
    header = request.headers.get("Authorization", "")
    scheme, _, token = header.partition(" ")

    if scheme.lower() != "bearer" or not token:
        return jsonify({
            "success": False,
            "message": "Authentication required"
        }), 401

    with get_db() as conn:
        cursor = conn.execute("""
            DELETE FROM sessions WHERE token_hash = ?
        """, (hash_token(token),))

    if cursor.rowcount == 0:
        return jsonify({
            "success": False,
            "message": "Session not found or already expired"
        }), 401

    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200


init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
