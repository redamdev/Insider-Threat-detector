import time
import sys
import re
import os
import openai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Get OpenAI API key from environment variables
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    print("Warning: OPENAI_API_KEY not found in .env file or environment variables.", file=sys.stderr)
    print("Please add your OpenAI API key to the .env file in the server directory.", file=sys.stderr)

client = OpenAI(api_key=api_key)

def generate_text(input_text, max_tokens=100):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using gpt-3.5-turbo for better efficiency and cost
            messages=[
                {"role": "system", "content": "You are an expert at analyzing tweets for potential insider threat risks."},
                {"role": "user", "content": input_text}
            ],
            max_tokens=max_tokens,
            temperature=0.1  # Lower temperature for more consistent outputs
        )
        
        # Extract generated text
        generated_text = response.choices[0].message.content
        print(f"Generated text: {generated_text}", file=sys.stderr)
        return generated_text
    except Exception as e:
        print(f"Error generating text with OpenAI API: {str(e)}", file=sys.stderr)
        raise e  # Propagate the error instead of returning a default score

def process_batch(batch, max_time=60):
    start_time = time.time()
    print(f"Processing batch of {len(batch)} tweets with OpenAI API...", file=sys.stderr)
    
    try:
        prompt = get_prompt(batch)
        text = generate_text(prompt)
        
        # Extract numbers using regex patterns (looking for decimal values)
        number_pattern = r'\d+\.\d+'
        numbers = re.findall(number_pattern, text)
        
        # If we don't have enough numbers, raise an exception
        if not numbers or len(numbers) < len(batch):
            raise ValueError(f"Not enough scores received from API. Expected {len(batch)}, got {len(numbers)}.")
        
        # Convert extracted numbers to scores
        scores = []
        for i in range(len(batch)):
            if i < len(numbers):
                try:
                    score = float(numbers[i])
                    # Ensure score is in range [0.0, 1.0]
                    score = max(0.0, min(1.0, score))
                    scores.append(score * 100)
                except ValueError:
                    raise ValueError(f"Invalid score format: {numbers[i]}")
            else:
                raise ValueError(f"Missing score for tweet {i+1}")
        
        print(f"Batch processed in {time.time() - start_time:.2f} seconds", file=sys.stderr)
        return scores
    
    except Exception as e:
        print(f"Error in process_batch: {str(e)}", file=sys.stderr)
        raise e  # Propagate the error instead of returning default scores

def get_main(tweets):
    if not tweets:
        return []
        
    print(f"Processing {len(tweets)} tweets with OpenAI API...", file=sys.stderr)
    
    # Process in batches of 5 for efficiency
    batch_size = 5
    all_scores = []
    
    for i in range(0, len(tweets), batch_size):
        batch = tweets[i:i+batch_size]
        print(f"Processing batch {i//batch_size + 1}/{(len(tweets) + batch_size - 1)//batch_size}", file=sys.stderr)
        batch_scores = process_batch(batch)
        all_scores.extend(batch_scores)
        
    return all_scores

def get_prompt(tweets):
    """
    Create a prompt for the OpenAI API.
    """
    tweet_count = len(tweets)
    
    prompt = (
        f"Rate the following {tweet_count} tweet(s) for potential insider threat risk on a scale from 0.0 to 1.0, "
        f"where 0.0 is no risk and 1.0 is severe risk. "
        f"For each tweet, respond ONLY with a numerical score as a decimal between 0.0 and 1.0. "
        f"Separate multiple scores with commas.\n\n"
    )

    for i, tweet in enumerate(tweets):
        prompt += f"Tweet {i+1}: {tweet}\n"
    
    prompt += "\nScores:"
    
    return prompt