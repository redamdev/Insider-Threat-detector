from flask import Blueprint, request, jsonify
from models import get_main, get_sentiment, get_toxicity
from helpers import get_summary, final_classification
import pandas as pd
import traceback
import time
import sys

analyze_bp = Blueprint('analyze', __name__)

# Analyze endpoint
@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        print("Starting analyze endpoint...", file=sys.stderr)
        if 'file' not in request.files:
            return jsonify({"message": "No file provided"}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"message": "No file selected"}), 400
            
        print(f"Received file: {file.filename}", file=sys.stderr)
        
        # Try to read all sheets and find one with the 'Tweet' column
        try:
            # Read all sheets in the Excel file
            excel_file = pd.ExcelFile(file)
            sheet_names = excel_file.sheet_names
            
            print(f"Excel file has {len(sheet_names)} sheets: {sheet_names}", file=sys.stderr)
            
            df = None
            sheet_with_tweets = None
            
            # Try each sheet until we find one with a 'Tweet' column
            for sheet_name in sheet_names:
                print(f"Checking sheet: {sheet_name}", file=sys.stderr)
                sheet_df = pd.read_excel(excel_file, sheet_name=sheet_name)
                print(f"Sheet columns: {sheet_df.columns.tolist()}", file=sys.stderr)
                if 'Tweet' in sheet_df.columns:
                    df = sheet_df
                    sheet_with_tweets = sheet_name
                    break
            
            if df is None:
                return jsonify({"message": "No sheet with 'Tweet' column found in the Excel file"}), 400
                
            print(f"Found tweets in sheet: {sheet_with_tweets}", file=sys.stderr)
            
        except Exception as e:
            print(f"Error reading Excel file: {str(e)}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            return jsonify({"message": f"Error reading Excel file: {str(e)}"}), 400

        # Extract tweets and usernames
        tweets = df['Tweet'].dropna().tolist()
        
        # Handle missing Username column
        usernames = df['Username'].tolist() if 'Username' in df.columns else ["Anonymous"] * len(tweets)
        
        if not tweets:
            return jsonify({"message": "No tweets found in the Excel file"}), 400
        
        print(f"Processing {len(tweets)} tweets...", file=sys.stderr)
        
        # Get scores for each tweet, catch errors from models
        try:
            print("Starting toxicity analysis...", file=sys.stderr)
            start_time = time.time()
            toxicity_scores = get_toxicity(tweets)
            print(f"Toxicity analysis completed in {time.time() - start_time:.2f} seconds", file=sys.stderr)
        except Exception as e:
            print(f"Toxicity analysis failed: {str(e)}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            return jsonify({"message": f"Toxicity analysis failed: {str(e)}"}), 500
        
        try:
            print("Starting sentiment analysis...", file=sys.stderr)
            start_time = time.time()
            sentiment_scores = get_sentiment(tweets)
            print(f"Sentiment analysis completed in {time.time() - start_time:.2f} seconds", file=sys.stderr)
        except Exception as e:
            print(f"Sentiment analysis failed: {str(e)}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            return jsonify({"message": f"Sentiment analysis failed: {str(e)}"}), 500
        
        try:
            print("Starting LLM analysis...", file=sys.stderr)
            start_time = time.time()
            llm_scores = get_main(tweets)
            print(f"LLM analysis completed in {time.time() - start_time:.2f} seconds", file=sys.stderr)
        except Exception as e:
            print(f"LLM analysis failed: {str(e)}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            return jsonify({"message": f"LLM analysis failed: {str(e)}"}), 500

        threat_scores = []
        for i in range(len(tweets)):
            threat_scores.append(final_classification(toxicity_scores[i], sentiment_scores[i], llm_scores[i]))

        results = []
        
        # Combine all the results
        print("Combining results...", file=sys.stderr)
        for i, tweet in enumerate(tweets):
            results.append({
                "username": usernames[i] if i < len(usernames) else "Anonymous",
                "tweet": tweet, 
                "sentiment": sentiment_scores[i],
                "toxicity": toxicity_scores[i],
                "llm": llm_scores[i],
                "threat": threat_scores[i],
            })

        print("Generating summary...", file=sys.stderr)
        summary = get_summary(results)

        print("Analysis complete, returning results", file=sys.stderr)
        return jsonify({
            "analysis": results,
            "summary": summary
        }), 200
        
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return jsonify({"message": f"Server error: {str(e)}"}), 500

