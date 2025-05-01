from flask import Blueprint, request, send_file
from helpers import generate_excel


generate_excel_bp = Blueprint('generate_excel', __name__)

# Generate Excel endpoint
@generate_excel_bp.route("/api/generate_excel", methods=["POST"])
def generate_excel_endpoint():
    
    # Get JSON data
    data = request.json
    analysis = data.get("analysis")
    summary = data.get("summary")
  
    excel_output = generate_excel(analysis, summary)
    return send_file(excel_output, download_name="tweet_analysis.xlsx", as_attachment=True)
    