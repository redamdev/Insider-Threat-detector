export interface SummaryData {
    total_tweets: number;
    avg_sentiment: number;
    avg_toxicity: number;
    avg_llm: number;
    threat_found: boolean;
}
  
export interface AnalysisData {
    username: string;
    tweet: string;
    sentiment: number;
    toxicity: number;
    llm: number;
    threat: number;
}

export interface AnalysisProps {
    data: AnalysisData[];
}
  
export interface SummaryProps {
    data_analysis: AnalysisData[];
    data_summary: SummaryData;
}

export interface DropZoneProps {
    onFileUpload: (files: File[]) => void;
}