export interface User {
    id: string;
    username: string;
    avatar?: string;
    bg_color?: string;
    is_column_challenge: boolean;
    dream_days?: number;
    created_at?: string;
}

export type SubmissionType = 'item1' | 'item2';

export interface DailySubmission {
    id: string;
    user_id: string;
    date: string;
    type: SubmissionType;
    content?: string;
    link?: string;
    amount?: number;
    created_at: string;
}

export const SUBMISSION_TYPES: { id: SubmissionType; label: string; icon?: string }[] = [
    { id: 'item1', label: '세줄글쓰기' },
    { id: 'item2', label: '미션 글쓰기' },
];
