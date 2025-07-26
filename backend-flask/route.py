from flask import request, jsonify
from model import db, Expense
from sqlalchemy.exc import SQLAlchemyError

def register_routes(app):
    @app.route('/add-expense', methods=['POST'])
    def add_expense():
        try:
            data = request.get_json()

            # Ensure JSON data exists
            if not data:
                return jsonify({'error': 'Request must be in JSON format'}), 400

            # Required fields check
            required_fields = ['date', 'category', 'amount']
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

            # Validate amount
            try:
                amount = float(data['amount'])
            except (ValueError, TypeError):
                return jsonify({'error': 'Amount must be a valid number'}), 400

            # Optional description field
            description = data.get('description', '')

            # Create Expense instance
            expense = Expense(
                date=data['date'],
                category=data['category'],
                amount=amount,
                description=description  # optional field
            )

            db.session.add(expense)
            db.session.commit()

            return jsonify({'message': 'Expense added successfully'}), 201

        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': f'Database error: {str(e)}'}), 500

        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
