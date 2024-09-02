import React, { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { Sheet } from 'react-modal-sheet';
import { database } from '../firebase/firebase';
import { useUser } from '../context/UserContext'; // Import hook useUser
import './Community.css';

const Community = () => {
    const [status, setStatus] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigate = useNavigate();
    const { user: currentUser } = useUser(); // Menggunakan UserContext

    useEffect(() => {
        if (currentUser === undefined) return; // Tunggu sampai currentUser ada
        if (!currentUser) {
            navigate('/login');
        } else {
            console.log('Current User in Community:', currentUser);
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const statusRef = ref(database, 'statuses');
        onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStatuses(Object.entries(data).reverse()); // Reverse the order here
            }
        });
    }, []);

    useEffect(() => {
        const usersRef = ref(database, 'transaksi/users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsers(data);
            }
        });
    }, []);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handlePostStatus = () => {
        if (status.trim() === '') return;

        if (!currentUser || !currentUser.uid) {
            console.error('Current user is not defined or uid is missing');
            return;
        }

        const newStatus = {
            text: status,
            timestamp: new Date().toISOString(),
            user: {
                uid: currentUser.uid,
                fullName: currentUser.displayName || 'Anonymous'
            }
        };

        push(ref(database, 'statuses'), newStatus)
            .then(() => {
                setStatus('');
            })
            .catch((error) => {
                console.error('Error posting status:', error);
            });
    };

    const handleOpenSheet = (statusId) => {
        setSelectedStatusId(statusId);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedStatusId(null);
        setNewComment('');
    };

    const handlePostComment = () => {
        if (!newComment.trim() || !selectedStatusId) return;

        const userFullName = currentUser?.displayName || 'Anonymous';

        const newCommentData = {
            text: newComment,
            timestamp: new Date().toISOString(),
            user: {
                uid: currentUser?.uid || 'unknown',
                fullName: userFullName
            }
        };

        push(ref(database, `statuses/${selectedStatusId}/comments`), newCommentData)
            .then(() => {
                setNewComment('');
                handleCloseSheet();
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const getUserFullName = (uid) => {
        return users[uid]?.fullName || 'Anonymous';
    };

    const handleProfileClick = (uid) => {
        navigate(`/akun/${uid}`);
    };

    return (
        <div className="community-container">
            <h2>Community Feed</h2>
            {currentUser && (
                <p>Hi, {currentUser.displayName || 'Anonymous'}! Share your thoughts!</p>
            )}
            {currentUser ? (
                <div className="status-input-container">
                    <textarea
                        value={status}
                        onChange={handleStatusChange}
                        placeholder="What's on your mind?"
                    />
                    <button onClick={handlePostStatus}>Post</button>
                </div>
            ) : (
                <p>Please log in to post a status.</p>
            )}
            <div className="statuses-list">
                {statuses.map(([id, statusData]) => (
                    <div key={id} className="status-card">
                        <p>
                            <strong 
                                className="status-user-name" 
                                onClick={() => handleProfileClick(statusData.user.uid)}
                            >
                                {statusData.user.fullName}
                            </strong>
                        </p>
                        <p>{statusData.text}</p>
                        <p className="status-timestamp">{formatTimestamp(statusData.timestamp)}</p>
                        <button onClick={() => handleOpenSheet(id)} className="comment-icon">
                            💬
                        </button>
                    </div>
                ))}
            </div>

            <Sheet isOpen={isSheetOpen} onClose={handleCloseSheet} snapPoints={[450, 0]} initialSnap={0}>
                <Sheet.Container>
                    <Sheet.Header>
                        <button className="close-sheet-button" onClick={handleCloseSheet}>X</button>
                    </Sheet.Header>
                    <Sheet.Content>
                        {selectedStatusId && statuses.find(([id]) => id === selectedStatusId)[1].comments &&
                            Object.values(statuses.find(([id]) => id === selectedStatusId)[1].comments).map((comment, index) => (
                                <div key={index} className="comment-card">
                                    <p><strong>{getUserFullName(comment.user.uid)}</strong>: {comment.text}</p>
                                    <p className="comment-timestamp">{formatTimestamp(comment.timestamp)}</p>
                                </div>
                            ))}
                        <div className="comment-input-container">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button onClick={handlePostComment}>Add Comment</button>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </div>
    );
};

export default Community;
