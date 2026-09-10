import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

const initialMessages = [
  {
    id: 1,
    doctor: "Dr. Ahmed Hassan",
    specialty: "Internal Medicine",
    unread: 2,
    messages: [
      {
        id: 1,
        sender: "doctor",
        text: "Your latest blood test results look good.",
        time: "10:35 AM",
      },
      {
        id: 2,
        sender: "doctor",
        text: "Keep following your current treatment plan.",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    doctor: "Dr. Sara Ali",
    specialty: "Cardiology",
    unread: 1,
    messages: [
      {
        id: 1,
        sender: "doctor",
        text: "Please remember your upcoming appointment on September 15.",
        time: "03:15 PM",
      },
    ],
  },
  {
    id: 3,
    doctor: "Dr. Omar Khaled",
    specialty: "Radiology",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "doctor",
        text: "Your chest X-Ray report is now available in your reports.",
        time: "11:30 AM",
      },
    ],
  },
  {
    id: 4,
    doctor: "MedTrack Support",
    specialty: "Patient Support",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "doctor",
        text: "Welcome to MedTrack. Let us know if you need any help.",
        time: "09:20 AM",
      },
    ],
  },
];

export const MessagesProvider = ({ children }) => {
  const [conversations, setConversations] =
    useState(initialMessages);

  const markAsRead = (id) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  };

  const sendMessage = (conversationId, text) => {
    const newMessage = {
      id: Date.now(),
      sender: "patient",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread: 0,
              messages: [
                ...conversation.messages,
                newMessage,
              ],
            }
          : conversation
      )
    );
  };

  const deleteConversation = (id) => {
    setConversations((prev) =>
      prev.filter(
        (conversation) => conversation.id !== id
      )
    );
  };

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        markAsRead,
        sendMessage,
        deleteConversation,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  return useContext(MessagesContext);
};