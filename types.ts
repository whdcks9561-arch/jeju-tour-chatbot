export interface TouristSpot {
  id: number;
  name: string;
  type: string;
  normal_price: number;
  discount_price: number | null;
  address: string;
  note: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}