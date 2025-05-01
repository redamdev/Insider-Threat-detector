import io
from openpyxl import Workbook

# Utility functions for the downloadable excel file

# Summary sheet (first sheeet)
def create_summary_sheet(wb, summary):
    
    summary_sheet = wb.active
    
    summary_sheet.title = "Summary"
    summary_sheet.append(["Metric", "Value"])

    summary_sheet.append(["Total Tweets", summary["total_tweets"]])

    summary_sheet.append(["Average Sentiment Score", summary["avg_sentiment"]])
    summary_sheet.append(["Average Toxicity Score", summary["avg_toxicity"]])
    summary_sheet.append(["Average LLM Score", summary["avg_llm"]])
    summary_sheet.append(["Potential Insider Threat in Set", summary["threat_found"]])
    
    adjust_column_widths(summary_sheet)

# Full data sheet (second sheet)
def create_analysis_sheet(wb, results):

    details_sheet = wb.create_sheet(title="Analysis")
    details_sheet.append(["Username", "Tweet", "Sentiment", "Toxicity", "LLM Score", "Insider Threat?"])

    for result in results:

        threat = "No"
        if result["threat"]== 1:
            threat = "Yes"
        

        details_sheet.append([
            result["username"],
            result["tweet"],
            result["sentiment"],
            result["toxicity"],
            result["llm"],
            threat
        ])
        
    adjust_column_widths(details_sheet)

def adjust_column_widths(sheet):
    for col in sheet.columns:
        col_letter = col[0].column_letter
        if col_letter == 'B':
            sheet.column_dimensions[col_letter].width = 50  
        else:
            sheet.column_dimensions[col_letter].width = 10 


def generate_excel(results, summary):
    
    wb = Workbook()
    create_summary_sheet(wb, summary)
    create_analysis_sheet(wb, results)
    
    excel_output = io.BytesIO()
    wb.save(excel_output)
    excel_output.seek(0)

    return excel_output