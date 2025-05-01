from transformers import pipeline
import time
import sys
import torch

"""
Pretrained Toxicity model:
https://huggingface.co/unitary/toxic-bert

"""

device = 0 if torch.cuda.is_available() else -1
print(f"Using device for toxicity model: {'CUDA' if device == 0 else 'CPU'}", file=sys.stderr)

print("Loading toxicity model...", file=sys.stderr)
start_time = time.time()
toxicity_pipe = pipeline("text-classification", model="unitary/toxic-bert", device=device)
print(f"Toxicity model loaded in {time.time() - start_time:.2f} seconds", file=sys.stderr)

def get_toxicity(tweets):
    if not tweets:
        return []
    
    print(f"Processing {len(tweets)} tweets with toxicity model...", file=sys.stderr)
    
    # Process in batches
    batch_size = 8
    scores = []
    
    for i in range(0, len(tweets), batch_size):
        batch = tweets[i:i+batch_size]
        print(f"Processing toxicity batch {i//batch_size + 1}/{(len(tweets) + batch_size - 1)//batch_size}", file=sys.stderr)
        batch_scores = process_toxicity_batch(batch)
        scores.extend(batch_scores)
    
    return scores

def process_toxicity_batch(tweets):
    start_time = time.time()
    
    results = toxicity_pipe(tweets)
    batch_scores = []

    for i, result in enumerate(results):
        # Extract the score - if any step fails, it will raise an exception and fail as required
        score = float(result['score']) * 100
        batch_scores.append(score)
    
    print(f"Toxicity batch processed in {time.time() - start_time:.2f} seconds", file=sys.stderr)
    print(f"Toxicity scores: {batch_scores}", file=sys.stderr)
    return batch_scores





