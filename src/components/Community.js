import React, { useState, useEffect, useCallback } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { useUser } from '../context/UserContext';
import { Sheet } from 'react-modal-sheet';
import './Community.css';

const Community = () => {
    const [status, setStatus] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigate = useNavigate();
    const { user: currentUser } = useUser();

    // Fetch statuses and users once when component mounts
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Fetch statuses from Firebase
        const statusRef = ref(database, 'statuses');
        onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStatuses(Object.entries(data).reverse());
            } else {
                console.warn('No statuses found');
            }
        });

        // Fetch users from Firebase
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsers(data);
                console.log('Fetched users:', data); // Log all users
            } else {
                console.warn('No users found');
            }
        });
    }, [currentUser, navigate]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handlePostStatus = useCallback(() => {
        if (status.trim() === '') return;

        if (!currentUser || !currentUser.uid) {
            console.error('Current user is not defined or uid is missing');
            return;
        }

        const fullName = users[currentUser.uid]?.fullName || 'Anonymous';

        const newStatus = {
            text: status,
            timestamp: new Date().toISOString(),
            user: {
                uid: currentUser.uid,
                fullName: fullName,
            },
        };

        push(ref(database, 'statuses'), newStatus)
            .then(() => {
                setStatus('');
            })
            .catch((error) => {
                console.error('Error posting status:', error);
            });
    }, [status, currentUser, users]);

    const toggleCommentsModal = useCallback((statusId) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setSelectedStatusId(statusId);
        setIsSheetOpen(!isSheetOpen);

        if (statusId) {
            const commentsRef = ref(database, `statuses/${statusId}/comments`);
            onValue(commentsRef, (snapshot) => {
                const commentsObject = snapshot.val();
                const commentsArray = commentsObject ? Object.values(commentsObject) : [];
                commentsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setComments(commentsArray);
            }, (error) => {
                console.error('Error fetching comments:', error);
            });
        }
    }, [currentUser, navigate, isSheetOpen]);

    const handlePostComment = useCallback(() => {
        if (!newComment.trim()) return;

        const fullName = users[currentUser.uid]?.fullName || 'Anonymous';

        const newCommentData = {
            text: newComment,
            timestamp: new Date().toISOString(),
            user: {
                uid: currentUser?.uid || 'unknown',
                fullName: fullName,
            },
        };

        if (selectedStatusId) {
            const commentsRef = ref(database, `statuses/${selectedStatusId}/comments`);
            push(commentsRef, newCommentData)
                .then(() => {
                    setNewComment('');
                    // Fetch updated comments
                    onValue(commentsRef, (snapshot) => {
                        const commentsObject = snapshot.val();
                        const commentsArray = commentsObject ? Object.values(commentsObject) : [];
                        commentsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        setComments(commentsArray);
                    });
                })
                .catch((error) => {
                    console.error('Error posting comment:', error);
                });
        }
    }, [newComment, currentUser, selectedStatusId, users]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const getUserFullName = useCallback((uid) => {
        return users[uid]?.fullName || 'Anonymous'; // Fall back to 'Anonymous' if UID not found
    }, [users]);

    const handleProfileClick = useCallback((uid) => {
        navigate(`/akun/${uid}`);
    }, [navigate]);

    const fullName = currentUser ? users[currentUser.uid]?.fullName || 'User' : 'User';

    return (
        <div className="community-container">
            <h2>Community Feed</h2>
            {currentUser && (
                <p>Hi, {fullName} Share your thoughts!</p>
            )}
            {currentUser && (
                <div className="status-input-container">
                    <textarea
                        value={status}
                        onChange={handleStatusChange}
                        placeholder="What's on your mind?"
                    />
                    <button onClick={handlePostStatus}>Post</button>
                </div>
            )}
            <div className="statuses-list">
                {statuses.map(([id, statusData]) => (
                    <div key={id} className="status-card">
                        <p>
                            <strong 
                                className="status-user-name" 
                                onClick={() => handleProfileClick(statusData.user.uid)}
                            >
                                {getUserFullName(statusData.user.uid)}
                            </strong>
                        </p>
                        <p>{statusData.text}</p>
                        <p className="status-timestamp">{formatTimestamp(statusData.timestamp)}</p>
                        <button onClick={() => toggleCommentsModal(id)} className="comment-icon">
                            💬
                        </button>
                    </div>
                ))}
            </div>

            <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} snapPoints={[450, 0]} initialSnap={0}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <div className="comments-list">
                            {comments.map((comment, index) => (
                                <div key={index} className="comment-card">
                                    <strong>{getUserFullName(comment.user.uid)}</strong>
                                    <p>{comment.text}</p>
                                    <small>{formatTimestamp(comment.timestamp)}</small>
                                </div>
                            ))}
                        </div>
                        {currentUser && (
                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                />
                                <button onClick={handlePostComment}>Add Comment</button>
                            </div>
                        )}
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </div>
    );
};

export default Community;
