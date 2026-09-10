import { useState } from "react";

import {
  Search,
  MessageSquare,
  User,
  Clock,
  ChevronRight,
  Send,
  X,
  Trash2,
} from "lucide-react";

import { useMessages } from "../../context/MessagesContext";
import { useNotifications } from "../../context/NotificationsContext";

const Messages = () => {
  const {
    conversations,
    markAsRead,
    sendMessage,
    deleteConversation,
  } = useMessages();

  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [messageText, setMessageText] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const filteredMessages = conversations.filter(
    (conversation) => {
      const search =
        searchTerm.toLowerCase();

      const lastMessage =
        conversation.messages[
          conversation.messages.length - 1
        ];

      return (
        conversation.doctor
          .toLowerCase()
          .includes(search) ||
        conversation.specialty
          .toLowerCase()
          .includes(search) ||
        lastMessage.text
          .toLowerCase()
          .includes(search)
      );
    }
  );

  const unreadCount = conversations.reduce(
    (total, conversation) =>
      total + conversation.unread,
    0
  );

  const handleOpenConversation = (
    conversation
  ) => {
    setSelectedConversation(conversation);

    markAsRead(conversation.id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    if (!selectedConversation) {
      return;
    }

    const trimmedMessage = messageText.trim();

    sendMessage(
      selectedConversation.id,
      trimmedMessage
    );

    addNotification({
      title: "Message Sent",
      message: `Your message to ${selectedConversation.doctor} was sent successfully.`,
      type: "message",
      path: "/patient/messages",
    });

    setMessageText("");

    const updatedConversation =
      conversations.find(
        (conversation) =>
          conversation.id ===
          selectedConversation.id
      );

    if (updatedConversation) {
      setSelectedConversation({
        ...updatedConversation,
        messages: [
          ...updatedConversation.messages,
          {
            id: Date.now(),
            sender: "patient",
            text: trimmedMessage,
            time: new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          },
        ],
      });
    }
  };

  const handleDelete = () => {
    if (!selectedConversation) {
      return;
    }

    deleteConversation(
      selectedConversation.id
    );

    setSelectedConversation(null);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="messages-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Messages</h1>

          <p>
            Communicate with your doctors and
            MedTrack support.
          </p>
        </div>

        <div className="messages-count">
          {unreadCount} Unread
        </div>
      </div>

      {/* Search */}
      <div className="messages-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* Messages */}
      <section className="messages-list">

        {filteredMessages.length > 0 ? (
          filteredMessages.map(
            (conversation) => {

              const lastMessage =
                conversation.messages[
                  conversation.messages.length - 1
                ];

              return (
                <button
                  type="button"
                  className={`message-card ${
                    conversation.unread > 0
                      ? "message-unread"
                      : ""
                  }`}
                  key={conversation.id}
                  onClick={() =>
                    handleOpenConversation(
                      conversation
                    )
                  }
                >

                  <div className="message-avatar">
                    {conversation.doctor ===
                    "MedTrack Support" ? (
                      <MessageSquare
                        size={21}
                      />
                    ) : (
                      <User size={21} />
                    )}
                  </div>

                  <div className="message-main">

                    <div className="message-header">

                      <div>
                        <h3>
                          {conversation.doctor}
                        </h3>

                        <span>
                          {
                            conversation.specialty
                          }
                        </span>
                      </div>

                      <div className="message-time">
                        <Clock size={13} />

                        {lastMessage.time}
                      </div>

                    </div>

                    <p>
                      {lastMessage.text}
                    </p>

                  </div>

                  <div className="message-right">

                    {conversation.unread >
                      0 && (
                      <span className="unread-badge">
                        {conversation.unread}
                      </span>
                    )}

                    <ChevronRight
                      size={18}
                    />

                  </div>

                </button>
              );
            }
          )
        ) : (
          <div className="messages-empty">

            <MessageSquare size={40} />

            <h3>
              No Messages Found
            </h3>

            <p>
              Try searching with a different
              keyword.
            </p>

          </div>
        )}

      </section>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="modal-overlay">

          <div className="message-modal">

            {/* Header */}
            <div className="message-modal-header">

              <div className="message-modal-user">

                <div className="message-avatar">
                  {selectedConversation.doctor ===
                  "MedTrack Support" ? (
                    <MessageSquare
                      size={21}
                    />
                  ) : (
                    <User size={21} />
                  )}
                </div>

                <div>
                  <h2>
                    {
                      selectedConversation.doctor
                    }
                  </h2>

                  <span>
                    {
                      selectedConversation.specialty
                    }
                  </span>
                </div>

              </div>

              <div className="message-modal-actions">

                <button
                  type="button"
                  className="message-delete-button"
                  title="Delete Conversation"
                  onClick={() =>
                    setShowDeleteConfirm(
                      true
                    )
                  }
                >
                  <Trash2 size={17} />
                </button>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() =>
                    setSelectedConversation(
                      null
                    )
                  }
                >
                  <X size={20} />
                </button>

              </div>

            </div>

            {/* Conversation */}
            <div className="conversation-body">

              {selectedConversation.messages.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${
                      message.sender ===
                      "patient"
                        ? "chat-message-patient"
                        : "chat-message-doctor"
                    }`}
                  >
                    <div className="chat-bubble">
                      <p>
                        {message.text}
                      </p>

                      <span>
                        {message.time}
                      </span>
                    </div>
                  </div>
                )
              )}

            </div>

            {/* Send Message */}
            <form
              className="message-input-area"
              onSubmit={
                handleSendMessage
              }
            >

              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) =>
                  setMessageText(
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                className="send-message-button"
                disabled={
                  !messageText.trim()
                }
              >
                <Send size={18} />
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm &&
        selectedConversation && (
          <div className="modal-overlay">

            <div className="modal-card delete-modal">

              <div className="delete-icon">
                <Trash2 size={24} />
              </div>

              <h2>
                Delete Conversation?
              </h2>

              <p>
                Are you sure you want to delete
                your conversation with{" "}
                <strong>
                  {
                    selectedConversation.doctor
                  }
                </strong>
                ?
              </p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowDeleteConfirm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default Messages;