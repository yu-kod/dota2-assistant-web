import { type ChangeEvent, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RefreshIcon from "@mui/icons-material/Refresh";

import type { HeroSummary } from "../types/heroes";

interface HeroRandomizerProps {
  heroes: HeroSummary[];
  onRandomPick: (hero: HeroSummary) => void;
  selectedHeroId: number | null;
}

export function HeroRandomizer({
  heroes,
  onRandomPick,
  selectedHeroId,
}: HeroRandomizerProps) {
  const [searchText, setSearchText] = useState("");

  const filteredHeroes = useMemo(() => {
    if (!searchText.trim()) {
      return heroes;
    }
    const lowered = searchText.toLowerCase();
    return heroes.filter((hero) =>
      [hero.localizedName, hero.shortName, hero.roles?.join(" ") || ""].some(
        (value) => value?.toLowerCase().includes(lowered)
      )
    );
  }, [heroes, searchText]);

  const handleRandomPick = () => {
    if (!filteredHeroes.length) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredHeroes.length);
    const hero = filteredHeroes[randomIndex];
    onRandomPick(hero);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">ランダムピック</Typography>
          <Tooltip title="ランダム選択">
            <span>
              <Button
                variant="contained"
                startIcon={<ShuffleIcon />}
                onClick={handleRandomPick}
                disabled={!filteredHeroes.length}
              >
                ランダムピック
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <TextField
          value={searchText}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearchText(event.target.value)
          }
          placeholder="ヒーローを検索 (名前・ロール)"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => setSearchText("")}
                  edge="end"
                  size="small"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="caption" color="text.secondary">
          候補ヒーロー: {filteredHeroes.length} / {heroes.length}
        </Typography>

        <Divider />

        <List dense disablePadding sx={{ maxHeight: 260, overflowY: "auto" }}>
          {!filteredHeroes.length ? (
            <ListItem>
              <Typography variant="body2" color="text.secondary">
                条件に合致するヒーローが見つかりませんでした。
              </Typography>
            </ListItem>
          ) : null}
          {filteredHeroes.map((hero: HeroSummary) => {
            const isSelected = hero.id === selectedHeroId;
            return (
              <ListItemButton
                key={hero.id}
                onClick={() => onRandomPick(hero)}
                selected={isSelected}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="img"
                        src={hero.icon}
                        alt={hero.localizedName}
                        width={32}
                        height={32}
                        sx={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                      <Typography variant="subtitle2">
                        {hero.localizedName}
                      </Typography>
                    </Stack>
                  }
                  secondary={`ロール: ${hero.roles.join(", ")}`}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Stack>
    </Paper>
  );
}
