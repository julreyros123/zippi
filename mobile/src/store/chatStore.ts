import { create } from 'zustand';

interface ChatStore {
  channels: any[];
  messages: any[];
  activeChannel: string | null;
  
  setChannels: (channels: any[]) => void;
  setActiveChannel: (channelId: string) => void;
  setMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  channels: [],
  messages: [],
  activeChannel: null,
  
  setChannels: (channels) => set({ channels }),
  setActiveChannel: (channelId) => set({ activeChannel: channelId }),
  
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
}));

export default useChatStore;
