import os
import psycopg2
from psycopg2 import Error
import json

# --- Configuration ---
DB_NAME = os.getenv("DB_NAME", "your_database_name")
DB_USER = os.getenv("DB_USER", "your_db_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "your_db_password")
DB_HOST = os.getenv("DB_HOST", "localhost") # Or your Render internal database host
DB_PORT = os.getenv("DB_PORT", "5432")
API_KEY = os.getenv("GOOGLE_API_KEY", "your_api_key")

# --- Function to insert data ---
def insert_words():
    connection = None
    try:
        # Establish the database connection
        connection = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME
        )
        cursor = connection.cursor()

        print("Successfully connected to PostgreSQL database!")

        # --- Define your table and data ---
        table_name = "words"
        # CREATE TABLE words_and_graphemes (
        #     id SERIAL PRIMARY KEY,
        #     original_word VARCHAR(255) NOT NULL,
        #     graphemes TEXT[] NOT NULL,
        #     category VARCHAR(100),
        #     image_url VARCHAR(2048)
        # );

        # Sample data to insert
        raw_data_to_insert = [
            ("apple", ["a", "p", "p", "l", "e"], "fruit", "https://example.com/apple.jpg"),
            ("banana", ["b", "a", "n", "a", "n", "a"], "fruit", "https://example.com/banana.jpg"),
            ("cat", ["c", "a", "t"], "animal", "https://example.com/cat.jpg"),
            ("dog", ["d", "o", "g"], "animal", "https://example.com/dog.jpg"),
            ("house", ["h", "ou", "s", "e"], "building", "https://example.com/house.jpg"),
            ("chair", ["ch", "ai", "r"], "furniture", "https://example.com/chair.jpg"),
            ("elephant", ["e", "l", "e", "ph", "a", "n", "t"], "animal", "https://example.com/elephant.jpg"),
            ("umbrella", ["u", "m", "b", "r", "e", "ll", "a"], "object", "https://example.com/umbrella.jpg"),
            ("sun", ["s", "u", "n"], "celestial", "https://example.com/sun.jpg"),
            ("moon", ["m", "oo", "n"], "celestial", "https://example.com/moon.jpg"),
        ]

        # SQL INSERT statement
        insert_query = f"""
            INSERT INTO {table_name} (original_word, graphemes, category, image_url)
            VALUES (%s, %s, %s, %s)
        """

        print(f"\nInserting {len(raw_data_to_insert)} records into '{table_name}'...")

        # Execute the insert statement for each record
        cursor.executemany(insert_query, raw_data_to_insert)

        # Commit the changes to the database
        connection.commit()
        print("Data inserted successfully!")
        print(f"Total rows affected: {cursor.rowcount}")

    except (Exception, Error) as error:
        print(f"Error while connecting to or interacting with PostgreSQL: {error}")
        if connection:
            connection.rollback() # Rollback in case of error
    finally:
        # Close the database connection
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection closed.")

# --- Main execution block ---
if __name__ == "__main__":
    insert_words()