# Calculation functions feeel free to modify or add as needed

def final_classification(sentiment, toxicity, llm):
    toxicity_weight = 0.2
    sentiment_weight = 0.3
    llm_weight = 0.5

    threat_score = (toxicity * toxicity_weight) + (sentiment * sentiment_weight) + (llm * llm_weight)

    if threat_score >= 50:
        return 1
    else:
        return 0

def get_summary(results):
    total_tweets = len(results)

    sentiment_avg = sum(result["sentiment"] for result in results) / total_tweets
    toxicity_avg = sum(result["toxicity"] for result in results) / total_tweets
    llm_avg = sum(result["llm"] for result in results) / total_tweets
    
    threat_found = any(result["threat"] for result in results)

    return {
        "total_tweets": total_tweets,
        "avg_sentiment": sentiment_avg,
        "avg_toxicity": toxicity_avg,
        "avg_llm": llm_avg,
        "threat_found": threat_found
    }