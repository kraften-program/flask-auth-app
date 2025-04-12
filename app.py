from flask import Flask, request, jsonify
from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv
import hashlib
import os

# Load environment variables from .env
load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SECRET_KEY = os.getenv("SECRET_KEY")

# Flask setup
app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app)

# Serializer for tokens
serializer = URLSafeTimedSerializer(SECRET_KEY)

# In-memory user database
users_db = {}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ========== ROUTES ==========

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("passwordHash")  # Already hashed by frontend
    first_name = data.get("firstName")
    last_name = data.get("lastName")

    if email in users_db:
        return jsonify({"error": "User already exists"}), 400

    token = serializer.dumps(email, salt='email-confirm')

    users_db[email] = {
        "firstName": first_name,
        "lastName": last_name,
        "passwordHash": password,
        "verified": False
    }

    # Send confirmation email
    confirm_url = f"http://localhost:5000/confirm/{token}"
    send_email(
        to=email,
        subject="Please confirm your email",
        content=f"Hi {first_name}, click the link to confirm: {confirm_url}"
    )

    return jsonify({"message": "Signup successful! Please check your email to verify your account."}), 200

@app.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=3600)
    except Exception as e:
        return jsonify({"error": "Invalid or expired token"}), 400

    if email in users_db:
        users_db[email]["verified"] = True
        return jsonify({"message": "Email verified successfully!"}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("passwordHash")

    user = users_db.get(email)
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not user["verified"]:
        return jsonify({"error": "Please verify your email before logging in."}), 401
    if user["passwordHash"] != password:
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": f"Welcome back, {user['firstName']}!"}), 200

@app.route('/recover', methods=['POST'])
def recover_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("newPassword")

    user = users_db.get(email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user["passwordHash"] = hash_password(new_password)
    return jsonify({"message": "Password reset successful."}), 200

# ========== EMAIL HELPER ==========

def send_email(to, subject, content):
    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=to,
        subject=subject,
        plain_text_content=content
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"[SendGrid] Email sent to {to}: Status {response.status_code}")
    except Exception as e:
        print(f"[SendGrid ERROR]: {str(e)}")

# ========== RUN SERVER ==========

if __name__ == '__main__':
    app.run(debug=True)
