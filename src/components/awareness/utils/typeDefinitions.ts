export interface NutritionalProfile {
    calories: number;
    protein: number;
    fiber: number;
    iron: number;
    magnesium: number;
    calcium: number;
    glycemic_index: number;
}

export interface AyurvedicProfile {
    dosha_effects: {
        Vata: string;
        Pitta: string;
        Kapha: string;
    };
    guna: string;
    virya: string;
    vipaka: string;
    ama_reduction_score: number;
    ayurvedic_benefits: {
        improves_digestion: boolean;
        reduces_inflammation: boolean;
        balances_blood_sugar: boolean;
        supports_metabolism: boolean;
        enhances_gut_health: boolean;
    };
}

export interface VernacularNames {
    Hindi: string;
    Marathi: string;
    Tamil: string;
    Telugu: string;
    Kannada: string;
    Gujarati: string;
}

export interface MilletRecipe {
    recipe_name: string;
    dosha_focus: string;
    season: string;
}

export interface Contraindications {
    who_should_avoid: string;
    how_much_is_safe: string;
    scientific_references_needed: boolean;
}

export interface Millet {
    millet_id: string;
    millet_name: string;
    type: string;
    vernacular_names: VernacularNames;
    botanical_name: string;
    nutritional_profile_per_100g: NutritionalProfile;
    ayurvedic_profile: AyurvedicProfile;
    diseases_or_conditions_it_helps: string[];
    lifestyle_benefits: {
        better_energy: boolean;
        weight_management: boolean;
        improved_sleep_cycle: boolean;
        controlling_cravings: boolean;
        better_gut_microbiome: boolean;
    };
    ayurvedic_reasoning_why_it_helps_disease: string;
    contraindications: Contraindications;
    recommended_ayurvedic_recipes: MilletRecipe[];
}

export interface AyurvedicPrinciple {
    principle_name: string;
    explanation: string;
    image_prompt: string;
}

export interface Disease {
    disease_id: string;
    disease_name: string;
    ayurvedic_cause: string;
    symptoms: string;
    millets_recommended: { millet_name: string; GI: number }[];
    why_these_millets_help: string;
    lifestyle_recommendations: string;
}

export interface DoshaRecommendation {
    dosha: string;
    recommendation: string;
    preferred_millets: string[];
    recipes_example: string[];
}

export interface GoalRecommendation {
    goal: string;
    millet_focus: string;
    millets: string[];
    explanation: string;
}

export interface AyurvedicData {
    database_title: string;
    millets: Millet[];
    ayurvedic_principles_related_to_millets: {
        section_id: string;
        principles: AyurvedicPrinciple[];
    };
    database_section_for_diseases: {
        section_id: string;
        diseases: Disease[];
    };
    user_personalization: {
        section_id: string;
        dosha_based_millet_recommendations: DoshaRecommendation[];
        goal_based_recommendations: GoalRecommendation[];
    };
}
