from transformers import pipeline
import time
import sys
import torch

"""
Pretrained Sentiment model using the following applicable datasets (tweets and reviews):
https://huggingface.co/datasets/stanfordnlp/sentiment140

"""

device = 0 if torch.cuda.is_available() else -1
print(f"Using device for sentiment model: {'CUDA' if device == 0 else 'CPU'}", file=sys.stderr)

print("Loading sentiment model...", file=sys.stderr)
start_time = time.time()
sentiment_pipe = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment-latest", device=device)
print(f"Sentiment model loaded in {time.time() - start_time:.2f} seconds", file=sys.stderr)

def get_sentiment(tweets):
    if not tweets:
        return []
    
    print(f"Processing {len(tweets)} tweets with sentiment model...", file=sys.stderr)
    
    # Process in batches
    batch_size = 8
    scores = []
    
    for i in range(0, len(tweets), batch_size):
        batch = tweets[i:i+batch_size]
        print(f"Processing sentiment batch {i//batch_size + 1}/{(len(tweets) + batch_size - 1)//batch_size}", file=sys.stderr)
        batch_scores = process_sentiment_batch(batch)
        scores.extend(batch_scores)
    
    return scores

def process_sentiment_batch(tweets):
    start_time = time.time()
    
    # Process tweets with sentiment model
    results = sentiment_pipe(tweets)
    batch_scores = []

    for i, result in enumerate(results):
        label = result['label']
        if label == 'negative':
            score = 70.0  # High threat score for negative sentiment
        elif label == 'neutral':
            score = 50.0  # Medium threat score for neutral sentiment
        else:  # positive
            score = 30.0  # Lower threat score for positive sentiment
            
        # Add some variance based on the confidence score
        if 'score' in result:
            score = score * (0.8 + 0.4 * result['score'])
            
        batch_scores.append(score)
    
    print(f"Sentiment batch processed in {time.time() - start_time:.2f} seconds", file=sys.stderr)
    print(f"Sentiment scores: {batch_scores}", file=sys.stderr)
    return batch_scores








