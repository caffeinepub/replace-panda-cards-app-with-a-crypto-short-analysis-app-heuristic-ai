import type { Principal } from "@icp-sdk/core/principal";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}

export interface None {
    __kind__: "None";
}

export type Option<T> = Some<T> | None;

export interface AnimationParams {
    type: string;
    speed: bigint;
}

export interface PandaCard {
    id: bigint;
    glowEffect: GlowEffect;
    rarity: string;
    colorScheme: ColorScheme;
    animationParams: AnimationParams;
}

export interface GlowEffect {
    color: string;
    intensity: bigint;
}

export interface ColorScheme {
    accent: string;
    secondary: string;
    primary: string;
}

// Types for crypto analysis (to be implemented in backend)
export interface OHLCVDataPoint {
    timestamp: bigint;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface AnalysisResult {
    id: string;
    asset: string;
    timestamp: bigint;
    recommendation: string;
    score: number;
    reasons: string[];
}

export interface AnalysisSummary {
    id: string;
    asset: string;
    timestamp: bigint;
    recommendation: string;
    score: number;
}

export interface backendInterface {
    // Existing panda card methods (to be removed/replaced)
    getAllCards(): Promise<Array<PandaCard>>;
    getBaseGlowEffectIntensity(): Promise<bigint>;
    getCardById(id: bigint): Promise<PandaCard>;
    getCardCount(): Promise<bigint>;
    getCardsByRarity(rarity: string): Promise<Array<PandaCard>>;
    getRandomCard(): Promise<PandaCard>;
    initialize(): Promise<void>;
    
    // New crypto analysis methods (to be implemented in backend)
    // submitAnalysis(asset: string, ohlcvData: OHLCVDataPoint[]): Promise<AnalysisResult>;
    // listAnalysisHistory(): Promise<AnalysisSummary[]>;
    // getAnalysisById(id: bigint): Promise<AnalysisResult>;
}
