export interface Plan {
  assumptions: string[];
  execution_plan: string[];
  critic_rubric: string[];
  exit_condition: {
    score_threshold: number;
    max_iterations: number;
  };
}

export interface CriticResult {
  score: number; // 0-100
  issues: string[];
  verdict: "approved" | "needs_revision";
}

export interface Iteration {
  iteration_number: number;
  output: string;
  critic: CriticResult;
}

export interface LoopResult {
  plan: Plan;
  iterations: Iteration[];
  final_output: string;
  exit_reason: "score_threshold_met" | "max_iterations_reached";
}

interface LLMResult {
  text: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}