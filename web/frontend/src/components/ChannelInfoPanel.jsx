import React, { useEffect, useState } from 'react';
import { X, Hash, Lock, Globe, Users, Crown, BellOff, Bell, Trash2, Shield, Tag } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ChannelInfoPanel({ channelId, user, token, onClose, onDeleted, onMuteToggled }) {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mutingLoading, setMutingLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', tags: '' });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchChannel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChannel(data);
        const myMembership = data.members.find(m => m.userId === user.id);
        if (myMembership) setIsMuted(myMembership.isMuted);
        setEditForm({ name: data.name, description: data.description || '', tags: data.tags || '' });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (channelId) fetchChannel();
  }, [channelId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/channels/${channelId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { onDeleted(channelId); onClose(); }
      else { const d = await res.json(); alert(d.error || 'Failed to delete'); }
    } catch (e) { alert('Network error'); }
    setDeleting(false);
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch(`${API_URL}/channels/${channelId}`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setIsEditing(false);
        fetchChannel();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to update');
      }
    } catch (e) { alert('Network error'); }
    setSaveLoading(false);
  };
  const handleToggleMute = async () => {
    setMutingLoading(true);
    try {
      const res = await fetch(`${API_URL}/channels/${channelId}/mute`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsMuted(data.isMuted);
        if (onMuteToggled) onMuteToggled(channelId, data.isMuted);
      }
    } catch (e) { alert('Network error'); }
    setMutingLoading(false);
  };
  const adminMember = channel?.members?.find(m => m.role === 'ADMIN');
  const isAdmin = channel?.members?.some(m => m.userId === user.id && m.role === 'ADMIN');
  const tags = channel?.tags?.split(',').map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-md w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-5 border-b border-gray-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-gray-700 border border-gray-600 flex items-center justify-center shrink-0">
              {channel?.isPrivate ? <Lock size={28} className="text-blue-400" /> : <Hash size={28} className="text-blue-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white truncate">{channel?.name || 'Loading...'}</h2>
              <div className="flex items-center gap-2 mt-1">
                {channel?.isPrivate ? (
                  <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    <Lock size={10} /> Private
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Globe size={10} /> Public
                  </span>
                )}
                {isAdmin && (
                  <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                    <Crown size={10} /> {isEditing ? 'Cancel Edit' : 'Edit Channel'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {!isEditing ? (
            <>
              {channel?.description && (
                <p className="text-gray-400 text-sm mt-4 text-left leading-relaxed">{channel.description}</p>
              )}

              {tags.length > 0 && (
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  <Tag size={13} className="text-gray-500 shrink-0 mt-0.5" />
                  {tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleUpdateChannel} className="mt-4 space-y-3 animate-in fade-in duration-300">
              <input 
                type="text" 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-gray-950 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Channel Name"
              />
              <textarea 
                value={editForm.description} 
                onChange={e => setEditForm({...editForm, description: e.target.value})}
                className="w-full bg-gray-950 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none h-20"
                placeholder="Description"
              />
              <input 
                type="text" 
                value={editForm.tags} 
                onChange={e => setEditForm({...editForm, tags: e.target.value})}
                className="w-full bg-gray-950 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Tags (comma separated)"
              />
              <button 
                type="submit" 
                disabled={saveLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold transition-colors"
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/40 rounded p-3 flex flex-col gap-1 border border-gray-700/50">
                  <Users size={18} className="text-blue-400" />
                  <p className="text-xl font-bold text-white">{channel?.members?.length ?? 0}</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
                <div className="bg-gray-800/40 rounded p-3 flex flex-col gap-1 border border-gray-700/50">
                  <Shield size={18} className="text-emerald-400" />
                  <p className="text-xl font-bold text-white">{channel?._count?.messages ?? 0}</p>
                  <p className="text-xs text-gray-500">Messages</p>
                </div>
              </div>

              {/* Founder */}
              {adminMember && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Crown size={12} className="text-yellow-400" /> Founder
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded">
                    <img
                      src={`https://ui-avatars.com/api/?background=random&color=fff&name=${adminMember.user.username}`}
                      alt="founder"
                      className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20"
                    />
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {adminMember.user.nickname || adminMember.user.username}
                      </p>
                      <p className="text-xs text-yellow-400 flex items-center gap-1">
                        <Crown size={10} /> Channel Founder
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Members list */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users size={12} /> All Members ({channel?.members?.length})
                </h4>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {channel?.members?.map(m => (
                    <div key={m.userId} className="flex items-center gap-3 p-2.5 rounded hover:bg-gray-800/40 transition-colors">
                      <div className="relative shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?background=random&color=fff&name=${m.user.username}`}
                          alt={m.user.username}
                          className="w-8 h-8 rounded-full bg-gray-800"
                        />
                        {m.role === 'ADMIN' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Crown size={8} className="text-yellow-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {m.user.nickname || m.user.username}
                          {m.userId === user.id && <span className="text-gray-500 font-normal ml-1">(you)</span>}
                        </p>
                        <p className="text-xs text-gray-600">@{m.user.username}</p>
                      </div>
                      {m.role === 'ADMIN' ? (
                        <span className="text-xs text-yellow-400 font-medium px-2 py-0.5 bg-yellow-500/10 rounded">Admin</span>
                      ) : (
                        <span className="text-xs text-gray-600">Member</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <button
                  onClick={handleToggleMute}
                  disabled={mutingLoading}
                  className="w-full flex items-center gap-3 p-3 rounded hover:bg-gray-800/40 transition-colors text-left"
                >
                  {isMuted ? (
                    <>
                      <Bell size={18} className="text-emerald-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Unmute Channel</p>
                        <p className="text-xs text-gray-500">Re-enable notifications</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <BellOff size={18} className="text-gray-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Mute Channel</p>
                        <p className="text-xs text-gray-500">Disable notifications</p>
                      </div>
                    </>
                  )}
                  {isMuted && <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Muted</span>}
                </button>

                {isAdmin && !showDeleteConfirm && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 p-3 rounded hover:bg-red-500/10 transition-colors text-left border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 size={18} className="text-red-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-400">Delete Channel</p>
                      <p className="text-xs text-gray-500">This action cannot be undone</p>
                    </div>
                  </button>
                )}

                {isAdmin && showDeleteConfirm && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded space-y-3">
                    <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
                      <Trash2 size={16} /> Confirm channel deletion?
                    </p>
                    <p className="text-xs text-gray-400">All messages and members will be permanently deleted.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 rounded border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 text-white transition-colors text-sm font-semibold disabled:opacity-60"
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
