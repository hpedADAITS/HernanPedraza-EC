import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHistoryState } from "../../hooks/useHistoryState";
import { useTranslation } from "../../hooks/useTranslation";
import {
  Box,
  Card,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
  Divider,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { conversationManager } from "../../services/conversationManager";

const ConversationsView = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFocus } = useHistoryState();
  const { t } = useTranslation();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Read from URL query params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate async operation (in real app, this might be an API call)
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = conversationManager.getAllConversations();
      setConversations(data);
    } catch (err) {
      setError("Failed to load conversations. Please try again.");
      console.error("Error loading conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sync state to URL whenever search or sort changes
  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (sortOrder && sortOrder !== "newest") params.sort = sortOrder;
    setSearchParams(params);
  }, [searchQuery, sortOrder, setSearchParams]);

  const handleNewConversation = async () => {
    try {
      const conv = conversationManager.createConversation(newTitle || undefined);
      await loadConversations();
      setNewTitle("");
      setOpenNewDialog(false);
      navigate(`/conversation/${conv.id}`);
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  const handleSelectConversation = (id) => {
    navigate(`/conversation/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      conversationManager.deleteConversation(deleteId);
      loadConversations();
      setDeleteId(null);
    }
    setOpenDeleteDialog(false);
  };

  const handleShareClick = (e, id) => {
    e.stopPropagation();
    const token = conversationManager.generateShareToken(id);
    if (token) {
      const link = `${window.location.origin}/share/${token}`;
      setShareLink(link);
      setOpenShareDialog(true);
      setCopied(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Focus on search input when component mounts
  useEffect(() => {
    setFocus("conversations-search");
  }, [setFocus]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter and sort conversations
  const filteredAndSortedConversations = conversations
    .filter((conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        pt: "env(safe-area-inset-top)",
        pl: "env(safe-area-inset-left)",
        pr: "env(safe-area-inset-right)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AutoStoriesIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {t('conversations')}
          </Typography>
          <IconButton color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              zIndex: 1300,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, minWidth: 240 }}>
            <Box sx={{ textAlign: 'center', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                {currentUser}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <MenuItem
              onClick={onLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <LogoutIcon fontSize="small" />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
            <Divider sx={{ mt: 1.5, mb: 1.5 }} />
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                Made by Hernan
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                for Sprint 1.5
              </Typography>
            </Box>
          </Box>
        </Menu>

        {/* Search and Sort Controls */}
        <Box sx={{ px: 2, pb: 2, display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            id="conversations-search"
            fullWidth
            size="small"
            placeholder={t('searchConversations')}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>{t('sortBy')}</InputLabel>
            <Select value={sortOrder} onChange={handleSortChange} label={t('sortBy')}>
              <MenuItem value="newest">{t('newestFirst')}</MenuItem>
              <MenuItem value="oldest">{t('oldestFirst')}</MenuItem>
              <MenuItem value="alphabetical">{t('alphabetical')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        sx={{ flex: 1, overflow: "auto", p: 2 }}
        data-preserve-scroll="conversations-list"
      >
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
            {t('loadingConversations')}
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button variant="outlined" onClick={loadConversations}>
            {t('tryAgain')}
            </Button>
          </Box>
        ) : filteredAndSortedConversations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
            {searchQuery ? t('noConversationsFound') : t('noConversationsYet')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {searchQuery ? t('tryDifferentSearch') : t('createNewConversation')}
            </Typography>
          </Box>
        ) : (
          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filteredAndSortedConversations.map((conv) => (
              <Card
                key={conv.id}
                sx={{
                  p: 0,
                  hover: {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        onClick={(e) => handleShareClick(e, conv.id)}
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        <ShareIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleDeleteClick(e, conv.id)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemButton onClick={() => handleSelectConversation(conv.id)}>
                    <ListItemText
                      primary={conv.title}
                      secondary={formatDate(conv.createdAt)}
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="New Conversation"
        onClick={() => setOpenNewDialog(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: "max(16px, env(safe-area-inset-right))",
          zIndex: 1200,
          boxShadow: 4,
        }}
      >
        <AddIcon />
      </Fab>

      {/* New Conversation Dialog */}
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleNewConversation();
              }
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Cancel</Button>
          <Button onClick={handleNewConversation} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this conversation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Link Dialog */}
      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Conversation</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Anyone with this link can view this conversation without logging in.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              value={shareLink}
              InputProps={{
                readOnly: true,
              }}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleCopyLink}
              sx={{ minWidth: 100 }}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConversationsView;
