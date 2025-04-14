from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
app.secret_key = 'h123h46h89h10'  # Use a strong secret key in production

# Simulating a database with a JSON file for simplicity
USER_DB = 'users.json'

@app.route('/')
def index():
    return render_template('proj.html')

def load_users():
    """Helper function to load users from the database (JSON file)."""
    try:
        with open(USER_DB, 'r') as f:
            users = json.load(f)
    except FileNotFoundError:
        users = []
    return users


def save_users(users):
    """Helper function to save users to the database (JSON file)."""
    with open(USER_DB, 'w') as f:
        json.dump(users, f)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        first_name = request.form['fname']
        last_name = request.form['lName']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirmPassword']

        # Check if the passwords match
        if password != confirm_password:
            flash("Passwords do not match.", "error")
            return redirect(url_for('register'))

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Check if user already exists
        users = load_users()
        for user in users:
            if user['email'] == email:
                flash("Email already registered.", "error")
                return redirect(url_for('register'))

        # Add the new user to the list
        new_user = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': hashed_password
        }
        users.append(new_user)
        save_users(users)

        flash("Registration successful!", "success")
        return redirect(url_for('login'))

    return render_template('proj.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        users = load_users()
        user_found = None
        for user in users:
            if user['email'] == email:
                user_found = user
                break

        if user_found and check_password_hash(user_found['password'], password):
            session['user'] = user_found['email']
            flash("Login successful!", "success")
            print("Redirecting to dashboard for:", session['user'])
            return redirect(url_for('dashboard'))  # Redirect to a logged-in page/dashboard
        else:
            flash("Invalid email or password.", "error")
            return redirect(url_for('dashboard'))

    return render_template('proj.html')



@app.route('/recover', methods=['GET', 'POST'])
def recover():
    if request.method == 'POST':
        email = request.form['email']
        new_password = request.form['newPassword']
        confirm_new_password = request.form['confirmNewPassword']

        if new_password != confirm_new_password:
            flash("Passwords do not match.", "error")
            return redirect(url_for('recover'))

        users = load_users()
        user_found = None
        for user in users:
            if user['email'] == email:
                user_found = user
                break

        if user_found:
            hashed_new_password = generate_password_hash(new_password)
            user_found['password'] = hashed_new_password
            save_users(users)
            flash("Password reset successful!", "success")
            return redirect(url_for('login'))
        else:
            flash("Email not found.", "error")
            return redirect(url_for('recover'))

    return render_template('proj.html')



@app.route('/logout')
def logout():
    session.pop('user', None)
    flash("You have been logged out.", "success")
    return redirect(url_for('login'))  # This should return proj.html if login renders proj.html


@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        flash("Please log in first.", "error")
        return redirect(url_for('login'))
    return render_template('nextpage.html')


if __name__ == '__main__':
    app.run(debug=True)