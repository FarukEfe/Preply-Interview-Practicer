import React, { useEffect, useState } from "react";
import { analyzeResults } from "../../api/twelve";
import type { QuestionToTranscriptMapping } from "../../api/twelve";
import "./Results.css";
interface AccuracyItem {
    script_question: string;
    accuracy_score: number;
    strengths: string;
    needs_improvement: string;
}

interface Metrics {
    number_of_filler_words: number;
    confidence_score: number;
    enthusiasm: number;
    eye_contact: number;
    major_timestamps?: number[];
    summary?: string;
}

interface AnalysisResults {
    accuracy: AccuracyItem[];
    metrics: Metrics;
}

const Results: React.FC = () => {
    const [data, setData] = useState<AnalysisResults | null>(null);
    const [loading, setLoading] = useState(true);

    // TODO: Replace with actual values from your app logic or props
    const videoUrl = "VIDEO_URL_FROM_RIBBON";
    const questionsToTranscriptMapping: QuestionToTranscriptMapping[] = []; // Fill this with Ribbon API data

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const result = await analyzeResults(videoUrl, questionsToTranscriptMapping);
            setData(result);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Error loading results.</div>;

    return (
        <div className="results-container">
            <h2>Interview Analysis Results</h2>
            <h3>Accuracy Analysis</h3>
            {data.accuracy && data.accuracy.map((item, idx) => (
                <div key={idx} className="score-item">
                    <strong>Q:</strong> {item.script_question}<br />
                    <strong>Score:</strong> {item.accuracy_score}<br />
                    <strong>Strengths:</strong> {item.strengths}<br />
                    <strong>Needs Improvement:</strong> {item.needs_improvement}
                </div>
            ))}
            <h3>Video Metrics</h3>
            {data.metrics && (
                <div className="scores">
                    <div className="score-item">
                        <span className="score-label">Filler Words</span>
                        <span className="score-value">{data.metrics.number_of_filler_words}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Confidence</span>
                        <span className="score-value">{data.metrics.confidence_score}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Enthusiasm</span>
                        <span className="score-value">{data.metrics.enthusiasm}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Eye Contact</span>
                        <span className="score-value">{data.metrics.eye_contact}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Major Timestamps</span>
                        <span className="score-value">{data.metrics.major_timestamps?.join(", ")}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Summary</span>
                        <span className="score-value">{data.metrics.summary}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
