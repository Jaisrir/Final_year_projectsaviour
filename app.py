from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import os
import re
import pandas as pd

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['saviour_db']
users = db['users']
cards = db['cards']
transactions = db['transactions']

UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')

@app.route('/')
def index():
    if 'email' not in session:
        return redirect(url_for('login'))
    user_cards = list(cards.find({'email': session['email']}))
    return render_template('index.html', cards=user_cards)

@app.route('/cards', methods=['GET', 'POST'])
def cards_page():
    if 'email' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        try:
            card_number = request.form['cardNumber'].replace(' ', '')
            if len(card_number) < 13 or not card_number.isdigit():
                flash('Invalid card number', 'error')
                return redirect(url_for('cards_page'))
            cards.insert_one({
                'email': session['email'],
                'card_holder': request.form['cardHolder'].strip(),
                'card_number': card_number,
                'expiry_date': request.form['expiryDate'],
                'card_type': request.form['cardType']
            })
            flash('Card added successfully!', 'success')
        except Exception as e:
            print("Error saving card:", e)
            flash('Error saving card', 'error')
        return redirect(url_for('cards_page'))
    user_cards = list(cards.find({'email': session['email']}))
    return render_template('cards.html', cards=user_cards)

@app.route('/delete_card/<card_id>', methods=['POST'])
def delete_card(card_id):
    if 'email' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    result = cards.delete_one({'_id': ObjectId(card_id), 'email': session['email']})
    if result.deleted_count > 0:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Card not found'}), 404


@app.route('/transactions')
def transactions_page():
    if 'email' not in session:
        return redirect(url_for('login'))
    
    # Fetch transactions from the database
    user_transactions = list(transactions.find({'email': session['email']}))
    
    # Separate credits and debits
    credits = [t for t in user_transactions if t['type'] == 'credit']
    debits = [t for t in user_transactions if t['type'] == 'debit']
    
    return render_template('transactions.html', credits=credits, debits=debits)
@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    if 'email' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    transaction_type = request.form['transactionType']
    description = request.form['description']
    amount = float(request.form['amount'])
    date = request.form['date']
    try:
        transactions.insert_one({
            'email': session['email'],
            'type': transaction_type,
            'description': description,
            'amount': amount,
            'date': date
        })
        return jsonify({'success': True})
    except Exception as e:
        print("Error inserting transaction into MongoDB:", e)
        return jsonify({'success': False, 'message': 'An error occurred while adding the transaction.'}), 500



@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    if 'email' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'}), 400
    file = request.files['file']
    if not file.filename.endswith(('.csv', '.xlsx')):
        return jsonify({'success': False, 'message': 'Invalid file type. Only CSV and Excel files are allowed.'}), 400
    try:
        transactions.delete_many({'email': session['email']})
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        # Normalize column names (trim and convert to lowercase)
        df.columns = df.columns.str.strip().str.lower()

        # Check if required columns exist
        required_columns = {'date', 'description', 'credits history', 'debits history'}
        if not required_columns.issubset(df.columns):
            return jsonify({'success': False, 'message': 'File is missing required columns.'}), 400

        total_credits = 0
        total_debits = 0
        credit_count = 0
        debit_count = 0
        for index, row in df.iterrows():
            transaction_type = 'credit' if row['credits history'] > 0 else 'debit'
            amount = abs(row['credits history'] if transaction_type == 'credit' else row['debits history'])
            transactions.insert_one({
                'email': session['email'],
                'type': transaction_type,
                'description': row['description'],
                'amount': amount,
                'date': row['date']
            })
            if transaction_type == 'credit':
                total_credits += amount
                credit_count += 1
            else:
                total_debits += amount
                debit_count += 1

        # Calculate net worth
        net_worth = total_credits - total_debits

        # Prepare analysis results
        analysis_results = {
            'total_credits': total_credits,
            'total_debits': total_debits,
            'net_worth': net_worth,
            'credit_count': credit_count,
            'debit_count': debit_count
        }

        return jsonify({'success': True, 'analysis': analysis_results})
    except Exception as e:
        print("Error processing file:", e)
        return jsonify({'success': False, 'message': f'An error occurred while processing the file: {str(e)}'}), 500  
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            session['email'] = email
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password', 'error')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        first_name = request.form['firstName']
        last_name = request.form['lastName']
        email = request.form['email']
        phone = request.form['phone']
        dob = request.form['dob']
        gender = request.form['gender']
        password = request.form['password']
        confirm_password = request.form['confirmPassword']
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return redirect(url_for('signup'))
        profile_image = None
        if 'profileImage' in request.files:
            file = request.files['profileImage']
            if file.filename != '':
                filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(filename)
                profile_image = f"uploads/{file.filename}"
        user_data = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone,
            'dob': dob,
            'gender': gender,
            'profile_image': profile_image,
            'password': generate_password_hash(password)
        }
        try:
            users.insert_one(user_data)
            flash('Signup successful! Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            print("Error inserting data into MongoDB:", e)
            flash('An error occurred during signup. Please try again.', 'error')
            return redirect(url_for('signup'))
    return render_template('signup.html')

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'email' not in session:
        return redirect(url_for('login'))
    user = users.find_one({'email': session['email']})
    if request.method == 'POST':
        first_name = request.form['firstName']
        last_name = request.form['lastName']
        email = request.form['email']
        phone = request.form['phone']
        dob = request.form['dob']
        gender = request.form['gender']
        if 'profileImage' in request.files:
            file = request.files['profileImage']
            if file.filename != '':
                filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(filename)
                profile_image = f"uploads/{file.filename}"
            else:
                profile_image = user['profile_image']
        else:
            profile_image = user['profile_image']
        users.update_one(
            {'email': session['email']},
            {'$set': {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'dob': dob,
                'gender': gender,
                'profile_image': profile_image
            }}
        )
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))
    return render_template('profile.html', profile=user)

@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)