import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Search } from 'lucide-react';
import { messageService } from '../services/messageService';
import { useAuth } from '../contexts/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    refetchInterval: 5000,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', selectedConv],
    queryFn: () => messageService.getMessages(selectedConv!),
    enabled: !!selectedConv,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: ({ rid, content }: any) => messageService.sendMessage(rid, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConv] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConvData = conversations?.find(c => c.id === selectedConv);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const rid = selectedConvData?.otherParticipant.id || parseInt(recipientId);
    if (!rid) return;
    sendMutation.mutate({ rid, content: newMessage.trim() });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          <span className="gradient-text">Messages</span>
        </h1>
      </div>

      <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', display: 'flex', height: 'calc(100vh - 200px)', minHeight: 500 }}>
        {/* Conversation list */}
        <div style={{ width: 300, borderRight: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input className="input" style={{ paddingLeft: '2rem', fontSize: '0.8rem' }} placeholder="Search conversations..." />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {(conversations || []).map(conv => (
              <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
                style={{ width: '100%', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: selectedConv === conv.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                  borderLeft: selectedConv === conv.id ? '3px solid #6366f1' : '3px solid transparent' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                  {conv.otherParticipant.fullName?.[0]}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{conv.otherParticipant.fullName}</span>
                    {conv.unreadCount > 0 && (
                      <span style={{ background: '#6366f1', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>{conv.unreadCount}</span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.lastMessage || 'Start a conversation'}
                  </div>
                </div>
              </button>
            ))}
            {!conversations?.length && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* Chat window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selectedConv ? (
            <>
              {/* Chat header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                  {selectedConvData?.otherParticipant.fullName?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedConvData?.otherParticipant.fullName}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{selectedConvData?.otherParticipant.jobTitle}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(messages || []).map(msg => {
                  const isMe = msg.sender.id === user?.id;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '0.625rem 1rem', borderRadius: isMe ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                        background: isMe ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-card)',
                        border: isMe ? 'none' : '1px solid var(--border)',
                        color: isMe ? 'white' : 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.5
                      }}>
                        {msg.content}
                        <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.7, textAlign: 'right' }}>
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                <input className="input" style={{ flex: 1 }} placeholder="Type a message..." value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()} />
                <button onClick={handleSend} className="btn-primary" disabled={!newMessage.trim() || sendMutation.isPending} style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={16} /> Send
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.95rem' }}>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
