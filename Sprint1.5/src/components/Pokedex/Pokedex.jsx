import React, { useState, useEffect } from "react";
import {
Box,
Typography,
Card,
CardContent,
Grid,
Button,
CircularProgress,
TextField,
InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTranslation } from "../../hooks/useTranslation";

const Pokedex = () => {
  const { t } = useTranslation();
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingMore, setIsSearchingMore] = useState(false);
  const [offset, setOffset] = useState(20);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    // Filter Pokemon based on search query
    const filtered = pokemon.filter(poke =>
      poke.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poke.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poke.id.toString().includes(searchQuery)
    );
    setFilteredPokemon(filtered);
  }, [pokemon, searchQuery]);

  const fetchPokemon = async (currentOffset = 0, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setIsSearchingMore(true);
      }
      setError(null);

      // Only check cache for initial load
      if (currentOffset === 0 && !append) {
        const cachedPokemon = localStorage.getItem('pokedex-data');
        const cacheTimestamp = localStorage.getItem('pokedex-timestamp');
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (cachedPokemon && cacheTimestamp) {
          const isCacheValid = Date.now() - parseInt(cacheTimestamp) < CACHE_DURATION;
          if (isCacheValid) {
            const parsedPokemon = JSON.parse(cachedPokemon);
            setPokemon(parsedPokemon);
            return;
          }
        }
      }

      // Fetch Pokemon from PokeAPI
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${currentOffset}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon: ${response.status}`);
      }

      const data = await response.json();

      // Get detailed info for each Pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch Pokemon details: ${detailResponse.status}`);
          }
          return await detailResponse.json();
        })
      );

      // Transform data to match our format
      const transformedPokemon = pokemonDetails.map(poke => ({
        id: poke.id,
        name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
        type: poke.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join('/'),
        sprite: poke.sprites.front_default
      }));

      if (append) {
        // Append new Pokemon to existing list
        setPokemon(prevPokemon => {
          const combined = [...prevPokemon, ...transformedPokemon];
          // Update cache with combined data
          localStorage.setItem('pokedex-data', JSON.stringify(combined));
          localStorage.setItem('pokedex-timestamp', Date.now().toString());
          return combined;
        });
        setOffset(prevOffset => prevOffset + 20);
      } else {
        // Replace existing Pokemon
        localStorage.setItem('pokedex-data', JSON.stringify(transformedPokemon));
        localStorage.setItem('pokedex-timestamp', Date.now().toString());
        setPokemon(transformedPokemon);
      }
    } catch (err) {
      // Try to use cached data even if expired as fallback (only for initial load)
      if (!append) {
        const cachedPokemon = localStorage.getItem('pokedex-data');
        if (cachedPokemon) {
          try {
            const parsedPokemon = JSON.parse(cachedPokemon);
            setPokemon(parsedPokemon);
            setError("Using cached data. Network error occurred.");
            return;
          } catch (parseErr) {
            console.error("Error parsing cached data:", parseErr);
          }
        }
      }

      setError(append ? "Failed to load more Pokemon. Please try again." : "Failed to load Pokemon data. Please check your connection and try again.");
      console.error("Error fetching Pokemon:", err);
    } finally {
      setLoading(false);
      setIsSearchingMore(false);
    }
  };

  const searchSpecificPokemon = async (query) => {
    try {
      setIsSearchingMore(true);
      setError(null);

      // Check if this specific Pokemon is already cached
      const cachedSpecific = localStorage.getItem(`pokedex-specific-${query.toLowerCase()}`);
      if (cachedSpecific) {
        const parsedPokemon = JSON.parse(cachedSpecific);
        // Check if it's already in our list
        const exists = pokemon.some(p => p.id === parsedPokemon.id);
        if (!exists) {
          setPokemon(prevPokemon => {
            const combined = [...prevPokemon, parsedPokemon];
            localStorage.setItem('pokedex-data', JSON.stringify(combined));
            localStorage.setItem('pokedex-timestamp', Date.now().toString());
            return combined;
          });
        }
        return;
      }

      // Fetch specific Pokemon from PokeAPI
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Pokemon "${query}" not found`);
        }
        throw new Error(`Failed to fetch Pokemon: ${response.status}`);
      }

      const pokeData = await response.json();

      // Transform to match our format
      const transformedPokemon = {
        id: pokeData.id,
        name: pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1),
        type: pokeData.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join('/'),
        sprite: pokeData.sprites.front_default
      };

      // Cache this specific Pokemon
      localStorage.setItem(`pokedex-specific-${query.toLowerCase()}`, JSON.stringify(transformedPokemon));

      // Check if it's already in our list
      const exists = pokemon.some(p => p.id === transformedPokemon.id);
      if (!exists) {
        setPokemon(prevPokemon => {
          const combined = [...prevPokemon, transformedPokemon];
          localStorage.setItem('pokedex-data', JSON.stringify(combined));
          localStorage.setItem('pokedex-timestamp', Date.now().toString());
          return combined;
        });
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching specific Pokemon:", err);
    } finally {
      setIsSearchingMore(false);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      if (filteredPokemon.length === 0) {
        // No results found in current list, try to search for specific Pokemon
        searchSpecificPokemon(searchQuery.trim());
      } else {
        // Results found, load more batch
        fetchPokemon(offset, true);
      }
    }
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearCache = () => {
    localStorage.removeItem('pokedex-data');
    localStorage.removeItem('pokedex-timestamp');
    // Clear specific Pokemon cache items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('pokedex-specific-')) {
        localStorage.removeItem(key);
      }
    });
    setPokemon([]);
    setFilteredPokemon([]);
    fetchPokemon(); // Reload fresh data
    handleClose();
  };

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
          <CatchingPokemonIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {t('pokedex')}
          </Typography>
          <IconButton color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            placeholder={t('searchPokemon')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            disabled={isSearchingMore}
          />
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
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
                Pokédex Settings
              </Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <MenuItem
              onClick={handleClearCache}
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
              <Typography variant="body2">Clear Cache</Typography>
            </MenuItem>
            <Divider sx={{ mt: 1.5, mb: 1.5 }} />
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                Powered by PokeAPI
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                Data from pokeapi.co
              </Typography>
            </Box>
          </Box>
        </Menu>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {t('loadingPokemon')}
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button variant="outlined" onClick={fetchPokemon}>
              Try Again
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredPokemon.length} of {pokemon.length} Pokémon
              </Typography>
              {isSearchingMore && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    {filteredPokemon.length === 0 ? "Searching for Pokemon..." : "Loading more..."}
                  </Typography>
                </Box>
              )}
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                mb: 4,
              }}
            >
              {filteredPokemon.map((p) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={p.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      borderRadius: 2,
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: (theme) => theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "100%",
                        minHeight: 180,
                        "&:last-child": { pb: 2 }
                      }}
                    >
                      {/* Image section - fixed height */}
                      <Box sx={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                        {p.sprite && (
                          <img
                            src={p.sprite}
                            alt={p.name}
                            style={{
                              width: 64,
                              height: 64,
                              imageRendering: "pixelated",
                              display: "block"
                            }}
                          />
                        )}
                      </Box>

                      {/* Name section - fixed height with truncation */}
                      <Box sx={{ height: 24, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", px: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.95rem",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                            textAlign: "center"
                          }}
                        >
                          {p.name}
                        </Typography>
                      </Box>

                      {/* ID and Type section - fixed height */}
                      <Box sx={{ height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0.5, width: "100%" }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem", lineHeight: 1 }}
                        >
                          #{String(p.id).padStart(3, '0')}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary.main"
                          sx={{
                            fontWeight: "medium",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.7rem",
                            lineHeight: 1
                          }}
                        >
                          {p.type}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {filteredPokemon.length === 0 && searchQuery && !isSearchingMore && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                {t('noPokemonFound')} "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Press Enter to search for this specific Pokémon
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Pokedex;
