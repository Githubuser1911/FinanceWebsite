import mysql.connector
from mysql.connector import Error

# Define the database connection parameters
db_config = {
    'host': 'localhost',
    'user': 'root',  # Replace with your MySQL username
    'password': '',  # Replace with your MySQL password
    'database': 'nodejs-login'
}

def test_mysql_connection():
    try:
        # Establish a connection to the database
        connection = mysql.connector.connect(**db_config)
        
        if connection.is_connected():
            print("Successfully connected to the database")
            
            cursor = connection.cursor()
            
            # Prepare the SQL insert query
            insert_query = """
                INSERT INTO dividends (user_id, ticker, shares, purchase_date, reinvest)
                VALUES (%s, %s, %s, %s, %s)
            """
            
            # Define the data to be inserted (you can replace these with any test data)
            data = (1, 'AAPL', 10, '2024-12-01', True)
            
            # Execute the query and commit the transaction
            cursor.execute(insert_query, data)
            connection.commit()
            print("Data inserted successfully")

    except Error as e:
        print("Error while connecting to MySQL:", e)
    finally:
        # Close the cursor and connection
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

# Run the test function
if __name__ == "__main__":
    test_mysql_connection()
