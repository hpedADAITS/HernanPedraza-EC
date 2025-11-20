import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Chip } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MessageList from '../Chatbot/MessageList';
import Loading from './Loading';
import ErrorBlock from './ErrorBlock';
import { conversationManager } from '../../services/conversationManager';
import ConversationNotFound from '../Error/ConversationNotFound';

const SHARED_VIEW_LABEL = 'Shared View';
const READ_ONLY_MESSAGE = 'This is a read-only shared conversation.';

const SharedConversationView = () => {
    const { shareToken } = useParams();
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSharedConversation = async () => {
            try {
                setLoading(true);
                setError(null);
                const conv = await conversationManager.getConversationByShareToken(shareToken);
                setConversation(conv);
            } catch (err) {
                console.error("Error loading shared conversation:", err);
                setError(err.message || "Failed to load shared conversation");
            } finally {
                setLoading(false);
            }
        };

        loadSharedConversation();
    }, [shareToken]);

    if (loading) {
        return <Loading message="Loading shared conversation..." />;
    }

    if (error) {
        return <ErrorBlock message={error} onRetry={() => window.location.reload()} />;
    }

    if (!conversation) {
        return <ConversationNotFound currentUser={null} />;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100dvh',
                pt: 'env(safe-area-inset-top)',
                pl: 'env(safe-area-inset-left)',
                pr: 'env(safe-area-inset-right)',
                overflow: 'hidden',
            }}
        >
            <AppBar position="sticky" elevation={1} color="transparent">
                <Toolbar>
                    <AutoStoriesIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {conversation.title}
                    </Typography>
                    <Chip
                        label={SHARED_VIEW_LABEL}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <MessageList messages={conversation.messages} />
            </Box>

            <Box
                sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {READ_ONLY_MESSAGE}
                </Typography>
            </Box>
        </Box>
    );
};

export default SharedConversationView;
